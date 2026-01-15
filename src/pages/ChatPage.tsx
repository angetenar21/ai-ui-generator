import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Sparkles } from 'lucide-react';
import ApiService from '../services/apiService';
import StorageService from '../services/storageService';
import SessionManager from '../services/sessionManager';
import { renderComponent } from '../templates';
import { useAppStore } from '../store/appStore';
import TypingIndicator from '../components/TypingIndicator';
import ResponsiveComponentWrapper from '../components/ResponsiveComponentWrapper';
import type { ComponentSpec } from '../templates/core/types';
import type { JobStatus, QueueStatus } from '../types/api.types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | ComponentSpec;
  timestamp: number;
}

const ChatPage: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const { currentThreadId, setCurrentThreadId, addGeneratedComponent, shouldStartNewChat, resetNewChatTrigger } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      setMessages([]);
      setInput('');
      setCurrentThreadId(null);
      resetNewChatTrigger();
    }
  }, [shouldStartNewChat, resetNewChatTrigger, setCurrentThreadId]);

  // Load thread history when currentThreadId changes
  useEffect(() => {
    if (currentThreadId) {
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
            content: item.response,
            timestamp: item.timestamp,
          });
        });
        setMessages(loadedMessages);
      }
    }
  }, [currentThreadId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const threadId = currentThreadId || crypto.randomUUID();
      if (!currentThreadId) {
        setCurrentThreadId(threadId);
      }

      try {
        const stats = await ApiService.getQueueStatus();
        setQueueStatus(stats);
      } catch (error) {
        console.error('Failed to fetch queue status:', error);
      }

      const response = await ApiService.sendMessage(
        input,
        threadId,
        {
          previousComponents: messages
            .filter((m) => m.role === 'assistant' && typeof m.content === 'object')
            .map((m) => m.content as ComponentSpec),
        },
        {
          onStatusUpdate: (status) => {
            setJobStatus(status);
            console.log(`[ChatPage] Job status: ${status}`);
          },
        }
      );

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      StorageService.saveToHistory({
        id: assistantMessage.id,
        prompt: userMessage.content as string,
        response: response,
        timestamp: Date.now(),
        threadId,
        sessionId: SessionManager.getSessionId(),
      });

      addGeneratedComponent(response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
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
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setJobStatus(null);
      setQueueStatus(null);
    }
  };

  const quickStarts = [
    { icon: '🎯', label: 'Dashboard', prompt: 'Create a modern analytics dashboard with KPIs and charts', gradient: 'from-orange-500 to-amber-600' },
    { icon: '📋', label: 'Form', prompt: 'Create a beautiful user registration form', gradient: 'from-purple-500 to-pink-600' },
    { icon: '📊', label: 'Chart', prompt: 'Create a sales performance chart', gradient: 'from-blue-500 to-cyan-600' },
    { icon: '🧱', label: 'Card', prompt: 'Create a product showcase card', gradient: 'from-green-500 to-emerald-600' },
    { icon: '🧩', label: 'Layout', prompt: 'Create a responsive grid layout', gradient: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-40 overflow-y-auto">
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
      )}

      {/* Messages Area */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-40 pt-8 scrollbar-thin">
          <div className="w-full max-w-5xl mx-auto space-y-6">
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
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-300" />
                  </div>
                ) : (
                  // Assistant Message
                  <div className="flex justify-start w-full max-w-[90%]">
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
                            {renderComponent(message.content)}
                          </ResponsiveComponentWrapper>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-slide-up">
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
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Floating Input Bar */}
      <div className="fixed bottom-8 left-0 right-0 px-4 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="relative">
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-xl" />

            {/* Input container */}
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-full p-2 flex items-center gap-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all duration-300">
              <button className="p-3 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-full transition-colors ml-1">
                <span className="text-xl">📎</span>
              </button>

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
                className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-4 text-base font-medium"
              />

              <button className="p-3 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                <span className="text-xl">🎙️</span>
              </button>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
