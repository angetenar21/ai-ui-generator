import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Sparkles, RotateCcw, StopCircle, Mic } from 'lucide-react';
import ApiService from '../services/apiService';
import StorageService from '../services/storageService';
import SessionManager from '../services/sessionManager';
import { ComponentRenderer } from '../templates';
import { useAppStore } from '../store/appStore';
import TypingIndicator from '../components/TypingIndicator';
import ResponsiveComponentWrapper from '../components/ResponsiveComponentWrapper';
import type { ComponentSpec } from '../templates/core/types';
import { generateUUID } from '../utils/uuid';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | ComponentSpec;
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const location = useLocation();
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
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
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
      // Do NOT clear fetching state here - let background jobs finish
    }
  }, [shouldStartNewChat, resetNewChatTrigger, setCurrentThreadId, clearCurrentChatMessages, setInput]);

  // Load thread history when currentThreadId changes
  useEffect(() => {
    if (currentThreadId && messages.length === 0) {
      const threadHistory = StorageService.getHistoryByThread(currentThreadId);
      if (threadHistory.length > 0) {
        const loadedMessages: ChatMessage[] = [];
        threadHistory.forEach(item => {
          loadedMessages.push({
            id: `${item.id}-user`,
            role: 'user',
            content: item.prompt,
            timestamp: item.timestamp,
          });
          loadedMessages.push({
            id: item.id,
            role: 'assistant',
            content: item.status === 'stopped' ? 'Generation stopped.' : item.response,
            timestamp: item.timestamp,
          });
        });
        setMessages(loadedMessages);
      }
    }
  }, [currentThreadId, messages.length, setMessages]);

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

  const handleRetry = async (originalPrompt: string) => {
    setInput(originalPrompt);
    await handleSend(originalPrompt);
  };

  const handleSend = async (retryPrompt?: string) => {
    const promptText = retryPrompt || input;
    if (!promptText.trim() || isLoading) return;

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

    // Determine thread ID
    const threadId = currentThreadId || generateUUID();
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

      const pendingResponse: ComponentSpec = {
        name: 'panel',
        templateProps: {
          title: 'Processing…',
          content: 'This generation is still running. Check back soon.',
          tone: 'info',
          variant: 'subtle',
        },
        metadata: {
          componentId: `pending-${historyId}`,
          generatedAt: new Date().toISOString(),
        },
      };

      StorageService.saveToHistory({
        id: historyId,
        prompt: userMessage.content as string,
        response: pendingResponse,
        timestamp: Date.now(),
        threadId,
        sessionId: SessionManager.getSessionId(),
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
          previousComponents: messages
            .filter((m) => m.role === 'assistant' && typeof m.content === 'object')
            .map((m) => m.content as ComponentSpec),
        },
        {
          onStatusUpdate: (status) => {
            setThreadState(threadId, { jobStatus: status });
            console.log(`[ChatPage] Thread ${threadId} status: ${status}`);
          },
          onJobId: (jobId) => setThreadState(threadId, { jobId }),
          signal: abortController.signal,
        }
      );

      const assistantMessage: ChatMessage = {
        id: historyId,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      // Only add message to UI if we are still viewing this thread
      // (Though in a real app we might want to update the store's message list for that thread even if not active)
      // Since messages are currently global in store, check if we are active:
      // Note: This needs improvement in a future pass to scope messages to threads in the store too.
      // For now, we rely on StorageService persistence.
      if (useAppStore.getState().currentThreadId === threadId) {
        addChatMessage(assistantMessage);
      }

      StorageService.updateHistoryItem(assistantMessage.id, {
        response: response,
        timestamp: Date.now(),
        status: 'completed',
      });
      setThreadState(threadId, { historyItemId: null });

      addGeneratedComponent(response);
    } catch (error) {
      // Don't show error if request was aborted by user
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted by user');
        return;
      }

      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: 'assistant',
        content: {
          type: 'text',
          props: {
            content: `Error: ${error instanceof Error ? error.message : 'Failed to generate UI'}. Please check your backend connection at ${ApiService.getApiUrl()}`,
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

      if (historyId) {
        StorageService.updateHistoryItem(historyId, {
          response: errorMessage.content as ComponentSpec,
          timestamp: Date.now(),
          status: 'error',
        });
        setThreadState(threadId, { historyItemId: null });
      }
    } finally {
      setThreadState(threadId, {
        isLoading: false,
        jobStatus: null,
        queueStatus: null,
        jobId: null,
        abortController: null
      });
    }
  };

  const quickStarts = [
    { icon: '🎯', label: 'Dashboard', prompt: 'Create a modern analytics dashboard with KPIs and charts', gradient: 'from-orange-500 to-amber-600' },
    { icon: '📋', label: 'Form', prompt: 'Create a beautiful user registration form', gradient: 'from-purple-500 to-pink-600' },
    { icon: '📊', label: 'Chart', prompt: 'Create a sales performance chart', gradient: 'from-blue-500 to-cyan-600' },
    { icon: '🧱', label: 'Card', prompt: 'Create a product showcase card', gradient: 'from-green-500 to-emerald-600' },
    { icon: '🧩', label: 'Layout', prompt: 'Create a responsive grid layout', gradient: 'from-pink-500 to-rose-600' },
  ];

  // Scroll to bottom of the container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement?.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative h-full flex flex-col bg-[#f9fafb] dark:bg-gray-900 overflow-hidden">
      {/* Unified Scroll Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-32">
        {messages.length === 0 ? (
          /* Hero Section - Centered */
          <div className="min-h-full flex flex-col items-center justify-center px-4">
            {/* Badge */}
            <div className="glass-light px-6 py-3 rounded-full mb-8 shadow-lg border border-orange-200/40 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Modern • Beautiful • AI-Powered
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-center max-w-4xl leading-tight">
              <span className="inline-block animate-twinkle mr-3">✨</span>
              <span className="bg-gradient-to-r from-gray-900 via-orange-700 to-amber-800 dark:from-white dark:via-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
                What would you like to create?
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl leading-relaxed text-lg px-4">
              Describe any UI component and watch AI generate it instantly with
              <span className="font-semibold text-orange-600 dark:text-orange-400"> beautiful, production-ready designs</span>
            </p>

            {/* Quick Start Cards */}
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl px-4">
              {quickStarts.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setInput(item.prompt)}
                  className={`
                    group relative px-6 py-4 rounded-2xl transition-all duration-300
                    hover:scale-105 hover:-translate-y-2 flex items-center gap-3
                    bg-gradient-to-br ${item.gradient} text-white shadow-lg hover:shadow-2xl
                    border border-white/20
                  `}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-base">{item.label}</div>
                    <div className="text-xs opacity-90 font-medium">Click to try</div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages Area */
          <div className="flex flex-col px-4 pt-8">
            <div className="w-full max-w-5xl mx-auto space-y-3">
              {/* Status Badge */}
              {jobStatus && (
                <div className="flex justify-center animate-slide-up">
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 dark:border-orange-800 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-sm font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                        {jobStatus}
                      </span>
                    </div>
                    {queueStatus && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
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
                    <div className="max-w-[75%] md:max-w-[65%] relative group">
                      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white px-6 py-4 rounded-3xl rounded-tr-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <p className="text-sm md:text-base leading-relaxed font-medium">
                          {message.content as string}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Assistant Message
                    <div className="flex flex-col items-start w-full max-w-[90%] gap-2">
                      <div className="w-full">
                        {typeof message.content === 'string' ? (
                          <div className="glass-light rounded-3xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        ) : (
                          <div className="w-full max-w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl rounded-tl-md p-4 md:p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-shadow duration-300 overflow-hidden">
                            <div className="w-full max-w-full overflow-x-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                              <ResponsiveComponentWrapper maxWidth={1200}>
                                <ComponentRenderer spec={message.content as ComponentSpec} />
                              </ResponsiveComponentWrapper>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons for assistant messages */}
                      {index === messages.length - 1 && !isLoading && (
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => {
                              const previousUserMessage = messages.slice(0, index).reverse().find(m => m.role === 'user');
                              if (previousUserMessage) {
                                handleRetry(previousUserMessage.content as string);
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Retry"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start gap-2 animate-slide-up">
                  <div className="glass-light rounded-3xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                      <TypingIndicator status={jobStatus} />
                      {queueStatus && (
                        <div className="flex items-center gap-2 pl-4 border-l border-gray-300 dark:border-gray-600">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Queue: {queueStatus.jobs.queued}
                          </span>
                        </div>
                      )}
                    </div>
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
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Bar - Absolutely Positioned */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="relative">
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-xl" />

            {/* Input container */}
            {/* Input container */}
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-2 flex items-center gap-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="✨ Describe your perfect UI..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-3 text-base font-medium"
              />

              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50">
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white p-3 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
