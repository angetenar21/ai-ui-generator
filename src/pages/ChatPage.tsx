import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Sparkles, RotateCcw, StopCircle, LayoutDashboard, FormInput, BarChart3, PanelTop, Grid, Wand2, AlertTriangle } from 'lucide-react';
import ApiService from '../services/apiService';
import StorageService from '../services/storageService';
import { ComponentRenderer } from '../templates';
import { useAppStore } from '../store/appStore';
// Used for auto-closing sidebar on mobile when input is focused
const MOBILE_BREAKPOINT = 1024;
import ResponsiveComponentWrapper from '../components/ResponsiveComponentWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DashboardSkeleton } from '../components/Skeleton';
import type { ComponentSpec } from '../templates/core/types';
import ErrorBoundary from '../components/ErrorBoundary';
import { generateUUID } from '../utils/uuid';

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | ComponentSpec;
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const {
    currentChatMessages: messages,
    setCurrentChatMessages: setMessages,
    addChatMessage,
    clearCurrentChatMessages,
    currentChatInput: input,
    setCurrentChatInput: setInput,
  } = useAppStore();
  const {
    activeThreads,
    setThreadState,
  } = useAppStore();
  const {
    currentThreadId,
    setCurrentThreadId,
    addGeneratedComponent,
    shouldStartNewChat,
    resetNewChatTrigger,
  } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Computed state for current thread
  const currentThreadState = currentThreadId ? activeThreads[currentThreadId] : null;
  const isLoading = currentThreadState?.isLoading || false;
  const jobStatus = currentThreadState?.jobStatus || null;
  const queueStatus = currentThreadState?.queueStatus || null;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement?.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Handle initial prompt from template gallery
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      setInput(state.initialPrompt);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle new chat trigger from sidebar
  useEffect(() => {
    if (shouldStartNewChat) {
      clearCurrentChatMessages();
      setInput('');
      setCurrentThreadId(null);
      resetNewChatTrigger();
    }
  }, [shouldStartNewChat, resetNewChatTrigger, setCurrentThreadId, clearCurrentChatMessages, setInput]);

  // Load thread history when currentThreadId changes
  useEffect(() => {
    if (currentThreadId) {
      // Clear existing messages when switching threads to prevent bleed-through
      setMessages([]);

      const threadHistory = StorageService.getHistoryByThread(currentThreadId);
      if (threadHistory.length > 0) {
        const loadedMessages: ChatMessage[] = [];
        threadHistory.forEach(item => {
          // ALWAYS push the user prompt, even if the generation is still pending
          loadedMessages.push({
            id: `${item.id}-user`,
            role: 'user',
            content: item.prompt,
            timestamp: item.timestamp,
          });

          // Skip pushing the assistant message for pending items in the UI (isLoading skeleton handles this)
          if (item.status === 'pending') return;

          loadedMessages.push({
            id: item.id,
            role: 'assistant',
            content: item.status === 'stopped' ? 'Generation stopped.' : item.response,
            timestamp: item.timestamp,
          });
        });
        setMessages(loadedMessages);
      }
    } else {
      // If we move to a 'new chat' state (currentThreadId is null), clear messages
      setMessages([]);
    }
  }, [currentThreadId, setMessages]);

  const handleStopGeneration = () => {
    if (!currentThreadId || !activeThreads[currentThreadId]) return;

    const { abortController, jobId, historyItemId } = activeThreads[currentThreadId];

    if (abortController) {
      abortController.abort();
    }

    if (jobId) {
      ApiService.cancelJob(jobId).catch((error) => {
        console.error('Failed to cancel job:', error);
      });
    }

    setThreadState(currentThreadId, {
      isLoading: false,
      jobStatus: null,
      queueStatus: null,
      jobId: null,
      abortController: null,
      historyItemId: null
    });

    if (historyItemId) {
      StorageService.updateHistoryItem(historyItemId, {
        response: {
          name: 'panel',
          templateProps: {
            title: 'Generation stopped',
            content: 'This generation was stopped by the user.',
            tone: 'warning',
            variant: 'subtle',
          },
          metadata: {
            componentId: `stopped-${historyItemId}`,
            generatedAt: new Date().toISOString(),
          },
        },
        timestamp: Date.now(),
        status: 'stopped',
      });
    }

    addChatMessage({
      id: generateUUID(),
      role: 'assistant',
      content: 'Generation stopped.',
      timestamp: Date.now(),
    });
  };

  const handleRetry = async (originalPrompt: string, contextComponents?: ComponentSpec[]) => {
    await handleSend(originalPrompt, contextComponents);
  };

  const handleSend = async (retryPrompt?: string, overrideContext?: ComponentSpec[]) => {
    const promptText = retryPrompt || input;

    // 1. Synchronous Guard: Check direct store state to prevent multiple prompts in same thread
    // while one is still initializing and before React has re-rendered the UI.
    const threadId = currentThreadId || generateUUID();
    const currentState = useAppStore.getState().activeThreads[threadId];
    if (!promptText.trim() || currentState?.isLoading) {
      console.log(`[ChatPage] Blocking concurrent send for thread ${threadId}`);
      return;
    }

    let historyId: string | null = null;

    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    addChatMessage(userMessage);
    if (!retryPrompt) {
      setInput('');
    }

    // 2. Thread initialization
    if (!currentThreadId) {
      setCurrentThreadId(threadId);
    }

    // Create abort controller for this specific request
    const abortController = new AbortController();

    setThreadState(threadId, {
      isLoading: true,
      jobId: null,
      jobStatus: null,
      abortController
    });

    try {
      historyId = generateUUID();
      setThreadState(threadId, { historyItemId: historyId });

      // Persist to history immediately so prompt isn't lost on navigation
      StorageService.saveToHistory({
        id: historyId,
        prompt: promptText,
        response: { name: 'panel', templateProps: { title: 'Generating...' } },
        timestamp: Date.now(),
        threadId,
        sessionId: useAppStore.getState().currentSessionId,
        status: 'pending',
      });

      try {
        const stats = await ApiService.getQueueStatus();
        setThreadState(threadId, { queueStatus: stats });
      } catch (error) {
        console.error('Failed to fetch queue status:', error);
      }

      const response = await ApiService.sendMessage(
        promptText,
        threadId,
        {
          previousComponents: overrideContext || messages
            .filter((m) => m.role === 'assistant' && typeof m.content === 'object')
            .map((m) => m.content as ComponentSpec),
        },
        {
          onStatusUpdate: (status) => {
            setThreadState(threadId, { jobStatus: status });
          },
          onJobId: (jobId) => setThreadState(threadId, { jobId }),
          signal: abortController.signal,
        }
      );

      // Verify we are still looking for THIS response
      const latestLock = useAppStore.getState().activeThreads[threadId]?.historyItemId;
      if (latestLock !== historyId) {
        console.warn(`[ChatPage] Discarding stale response for thread ${threadId}. Local: ${historyId}, Store: ${latestLock}`);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: historyId,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      // Only add message to UI if we are still viewing this thread
      if (useAppStore.getState().currentThreadId === threadId) {
        addChatMessage(assistantMessage);
      }

      StorageService.updateHistoryItem(assistantMessage.id, {
        prompt: promptText, // Ensure prompt is kept/set
        response: response,
        timestamp: Date.now(),
        status: 'completed',
        threadId,
      });

      // Note: We don't unset historyItemId here anymore, that's done in the finally block

      addGeneratedComponent(response);
    } catch (error) {
      // Don't show error if request was aborted by user
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted by user');
        return;
      }

      console.error('Error:', error);

      // Detect demo mode / missing API key scenarios
      const errMsg = error instanceof Error ? error.message : 'Failed to generate UI';
      const isDemoMode = /api.?key|gemini|model|quota|GOOGLE_API_KEY|unauthorized|500|503/i.test(errMsg);

      const errorContent = isDemoMode
        ? 'DEMO_MODE_ERROR'
        : errMsg;

      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: 'assistant',
        content: isDemoMode ? errorContent : {
          type: 'text',
          props: {
            content: `Error: ${errMsg}.`,
            variant: 'body',
          },
          metadata: {
            componentId: 'error-' + Date.now(),
            generatedAt: new Date().toISOString(),
          },
        },
        timestamp: Date.now(),
      };

      if (useAppStore.getState().currentThreadId === threadId) {
        addChatMessage(errorMessage);
      }

      if (historyId && useAppStore.getState().activeThreads[threadId]?.historyItemId === historyId) {
        StorageService.updateHistoryItem(historyId, {
          prompt: promptText,
          response: (typeof errorMessage.content === 'string' ? { type: 'text', props: { content: errorMessage.content } } : errorMessage.content) as ComponentSpec,
          timestamp: Date.now(),
          status: 'error',
          threadId,
        });
      }
    } finally {
      // Only reset loading state if this specific request is the latest one
      if (useAppStore.getState().activeThreads[threadId]?.historyItemId === historyId || !historyId) {
        setThreadState(threadId, {
          isLoading: false,
          jobStatus: null,
          queueStatus: null,
          jobId: null,
          abortController: null,
          historyItemId: null
        });
        // Fix #7: Remove stale thread entry to prevent AbortController memory leak
        useAppStore.getState().clearThreadState(threadId);
      }
    }
  };

  const quickStarts = [
    { icon: LayoutDashboard, label: 'Dashboard', prompt: 'Create a modern analytics dashboard with KPIs and charts' },
    { icon: FormInput,       label: 'Form',      prompt: 'Create a user registration form' },
    { icon: BarChart3,       label: 'Chart',     prompt: 'Create a sales performance chart' },
    { icon: PanelTop,        label: 'Card',      prompt: 'Create a product showcase card' },
    { icon: Grid,            label: 'Layout',    prompt: 'Create a responsive grid layout' },
  ];

  // Scroll to bottom of the container — used only for non-message triggers if needed
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement?.parentElement;
      if (container) { container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }); }
    }
  };
  void scrollToBottom; // suppress unused-var lint warning — kept for future imperative use

  return (
    <div className="relative h-full flex flex-col bg-transparent overflow-hidden">
      {/* Unified Scroll Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-32 relative z-10">
        {!currentThreadId ? (
          /* Hero Section - Centered */
          <motion.div 
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="hero-container min-h-full flex flex-col items-center justify-center px-3 sm:px-4"
          >
            {/* Badge */}
            <motion.div variants={heroItemVariants} className="hero-badge glass-light px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-8 shadow-sm border border-orange-200/40 dark:border-orange-800/40 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-stone-600 dark:text-gray-300">
                  Modern • Beautiful • AI-Powered
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={heroItemVariants} className="hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-semibold mb-4 sm:mb-6 text-center max-w-4xl leading-tight">
              <span className="hero-icon inline-flex items-center justify-center mr-2 sm:mr-4">
                <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-orange-500 animate-float drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
              </span>
              <span className="text-stone-900 dark:text-white">
                What would you like to create?
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={heroItemVariants} className="hero-subheading text-stone-500 text-center mb-6 sm:mb-12 max-w-2xl leading-relaxed text-sm sm:text-base md:text-lg px-3 sm:px-4 font-medium transition-all duration-300">
              Describe any UI component and watch AI generate it instantly with
              <span className="text-stone-400 dark:text-gray-500 block mt-1"> beautiful, production-ready designs.</span>
            </motion.p>

            {/* Quick Start Cards */}
            <div className="hero-cards grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full max-w-5xl px-2 sm:px-4">
              {quickStarts.map((item, index) => (
                <motion.button
                  variants={heroItemVariants}
                  key={item.label}
                  onClick={() => {
                    setInput(item.prompt);
                    // Auto-submit so users get results in one click
                    setTimeout(() => handleSend(item.prompt), 50);
                  }}
                  className={`
                    hero-card group relative px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl transition-all duration-300
                    hover:scale-[1.02] hover:-translate-y-1 flex items-center gap-2 sm:gap-3
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm hover:shadow-lg
                    border border-stone-200/50 dark:border-gray-700/50
                    focus:outline-none focus:ring-2 focus:ring-orange-500/50
                  `}
                >
                  <div className="hero-card-icon w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-pink-600 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-gray-300 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <div className="hero-card-label font-bold text-[13px] sm:text-[15px] text-stone-800 dark:text-gray-100">{item.label}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-500 dark:text-gray-400 font-medium tracking-wide hidden sm:block">Click to try</div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-orange-500/0 group-hover:bg-orange-500/[0.02] dark:group-hover:bg-white/5 transition-colors duration-300" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Messages Area */
          <div className="flex flex-col px-2 sm:px-4 pt-4 sm:pt-8">
            <div className="w-full max-w-5xl mx-auto space-y-3">
              {/* Status Badge */}
              {jobStatus && (
                <div className="flex justify-center animate-slide-up">
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/50 dark:bg-gray-800/50 border border-orange-200/50 dark:border-orange-800/50 backdrop-blur-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-sm font-medium tracking-wide text-stone-700 dark:text-gray-300">
                        {jobStatus}
                      </span>
                    </div>
                    {queueStatus && (
                      <span className="text-xs text-stone-600 dark:text-gray-400 font-medium">
                        {queueStatus.jobs.queued} in queue
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {message.role === 'user' ? (
                    // User Message
                    <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] relative group">
                      <div className="bg-gray-50/50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 px-6 py-4 rounded-3xl rounded-tr-md shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-md">
                        {(() => {
                          const rawContent = message.content as string;
                          // Detect JSON — try to parse the string
                          let parsed: any = null;
                          try {
                            parsed = JSON.parse(rawContent);
                          } catch {
                            // not JSON, render as plain text
                          }
                          if (parsed !== null && typeof parsed === 'object') {
                            return (
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold mb-2">JSON Input</div>
                                <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl p-3 overflow-x-auto max-h-48 whitespace-pre leading-relaxed">
                                  {JSON.stringify(parsed, null, 2)}
                                </pre>
                              </div>
                            );
                          }
                          return (
                            <p className="text-sm md:text-base leading-relaxed font-medium">
                              {rawContent}
                            </p>
                          );
                        })()}
                      </div>
                    </div>

                  ) : (
                    // Assistant Message
                    <div className="flex flex-col items-start w-full max-w-[90%] gap-2">
                      <div className="w-full">
                        {typeof message.content === 'string' && message.content === 'DEMO_MODE_ERROR' ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-xl rounded-2xl p-5 border border-amber-200/60 dark:border-amber-800/40 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Demo Mode Active</h4>
                                <p className="text-sm text-amber-700/80 dark:text-amber-400/70 leading-relaxed">
                                  Live component generation requires a valid Gemini API key configured on the backend. 
                                  Please add your <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/40 rounded text-xs font-mono">GOOGLE_API_KEY</code> to continue creating!
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : typeof message.content === 'string' ? (
                          <div className="glass-light rounded-3xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="w-full relative mt-2"
                          >
                            <div className="w-full min-w-0 flex items-start justify-start">
                              <ErrorBoundary fallbackTitle="AI Component Error">
                                <ResponsiveComponentWrapper alignLeft={true}>
                                  <ComponentRenderer spec={message.content as ComponentSpec} />
                                </ResponsiveComponentWrapper>
                              </ErrorBoundary>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Action buttons for assistant messages */}
                      {!isLoading && (
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => {
                              const previousUserMessage = messages.slice(0, index).reverse().find(m => m.role === 'user');
                              if (previousUserMessage) {
                                // Filter components to only those that existed BEFORE this message
                                const relevantComponents = messages
                                  .slice(0, index)
                                  .filter(m => m.role === 'assistant' && typeof m.content === 'object')
                                  .map(m => m.content as ComponentSpec);

                                handleRetry(previousUserMessage.content as string, relevantComponents);
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                            title="Regenerate this specific response"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {/* Loading Skeleton */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    className="flex flex-col items-start gap-4 w-full pb-8"
                  >
                    {/* Modern Skeleton UI */}
                    <div className="w-full max-w-3xl overflow-hidden mt-2">
                      <DashboardSkeleton />
                    </div>

                    {/* Stop button during generation */}
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={handleStopGeneration}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Stop generation"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                        <span>Stop</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Bar - Absolutely Positioned */}
      <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 px-2 sm:px-4 z-[15] pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-xl" />

            {/* Input container */}
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-2 flex items-center gap-2 shadow-md border border-stone-200 dark:border-gray-800 focus-within:ring-1 focus-within:ring-orange-500/50 focus-within:border-orange-500/50 transition-all duration-300">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onFocus={() => {
                  // Auto-hide sidebar on mobile when user starts typing
                  if (window.innerWidth < MOBILE_BREAKPOINT) {
                    useAppStore.getState().setSidebarOpen(false);
                  }
                }}
                placeholder={document.activeElement === inputRef.current ? "Describe your perfect UI..." : "Describe your perfect UI... (Cmd+K to focus)"}
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-3 text-base font-medium"
              />

              {/* Mic button removed — voice recording not yet implemented */}

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 disabled:from-stone-200 disabled:to-stone-200 dark:disabled:from-gray-800 dark:disabled:to-gray-800 dark:disabled:text-gray-600 disabled:text-stone-400 text-white p-3 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center shadow-sm active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ChatPage;
