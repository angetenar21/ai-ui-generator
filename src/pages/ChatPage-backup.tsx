import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send } from 'lucide-react';
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

  // Handle initial prompt from template gallery
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      setInput(state.initialPrompt);
      // Clear the state so it doesn't persist on refresh
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
        // Convert history items to chat messages
        const loadedMessages: ChatMessage[] = [];
        threadHistory.forEach(item => {
          // Add user message
          loadedMessages.push({
            id: `${item.id}-user`,
            role: 'user',
            content: item.prompt,
            timestamp: item.timestamp,
          });
          // Add assistant message
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
      // Use existing thread ID or create new one
      const threadId = currentThreadId || crypto.randomUUID();
      if (!currentThreadId) {
        setCurrentThreadId(threadId);
      }

      // Fetch queue status when job is sent
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

      // Save to history
      StorageService.saveToHistory({
        id: assistantMessage.id,
        prompt: userMessage.content as string,
        response: response,
        timestamp: Date.now(),
        threadId,
        sessionId: SessionManager.getSessionId(),
      });

      // Add to app state
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
    { icon: '🎯', label: 'Dashboard', prompt: 'Create a modern analytics dashboard' },
    { icon: '📋', label: 'Form', prompt: 'Create a user registration form' },
    { icon: '📊', label: 'Chart', prompt: 'Create a sales chart component' },
    { icon: '🧱', label: 'Card', prompt: 'Create a product card component' },
    { icon: '🧩', label: 'Layout', prompt: 'Create a responsive grid layout' },
  ];

  return (
    <div className="h-full flex flex-col relative">
      {/* Hero Section */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="card px-6 py-3 rounded-pill mb-6 shadow-card">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Modern • Clean • AI-Powered</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 text-center" style={{ color: '#111827' }}>
            <span className="text-5xl mr-2">✨</span>
            What would you like to create?
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl leading-relaxed" style={{ color: '#6B7280' }}>
            Describe any UI component and watch AI generate it instantly with beautiful designs
          </p>

          {/* Quick Starts */}
          <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
            {quickStarts.map((item) => (
              <button
                key={item.label}
                onClick={() => setInput(item.prompt)}
                className="card hover:scale-105 px-4 py-3 rounded-pill transition-all duration-300 hover:shadow-hover flex items-center gap-2 text-gray-900 dark:text-white"
                style={{ color: '#111827' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-32 pt-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {jobStatus && (
              <div className="flex justify-center">
                <div className="inline-flex flex-col md:flex-row md:items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-border-subtle shadow-card">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Live Status
                  </span>
                  <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                    {jobStatus}
                  </span>
                  {queueStatus && (
                    <span className="text-xs text-gray-500">
                      Pending in queue: {queueStatus.jobs.queued}
                    </span>
                  )}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {message.role === 'user' ? (
                  <div className="max-w-[70%] gradient-primary text-white px-6 py-4 rounded-2xl shadow-card">
                    <p className="text-sm md:text-base leading-relaxed">{message.content as string}</p>
                  </div>
                ) : (
                  <div className="flex justify-start w-full">
                    {typeof message.content === 'string' ? (
                      <div className="card rounded-2xl px-6 py-4">
                        <p className="text-gray-900 dark:text-gray-400" style={{ color: '#374151' }}>{message.content}</p>
                      </div>
                    ) : (
                      <div className="card-elevated rounded-2xl p-4 max-w-4xl">
                        {/* Responsive component container to prevent horizontal overflow */}
                        <ResponsiveComponentWrapper maxWidth={1200}>
                          {renderComponent(message.content)}
                        </ResponsiveComponentWrapper>

                        {/* Action Buttons - Disabled for non-interactive rendering */}
                        {/*
                        <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                          <button
                            className="flex items-center gap-2 px-4 py-2 glass hover-scale btn-press rounded-lg transition-all text-sm"
                            onClick={() => {}}
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Regenerate</span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 glass hover-scale btn-press rounded-lg transition-all text-sm"
                            onClick={() => {}}
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 glass hover-scale btn-press rounded-lg transition-all text-sm"
                            onClick={() => handleCopyJSON(message.content as ComponentSpec)}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>
                        </div>
                        */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-slide-up">
                <div className="card rounded-2xl">
                  <div className="flex items-center gap-4">
                    <TypingIndicator status={jobStatus} />
                    {queueStatus && (
                      <div className="flex items-center gap-2 pr-4 border-l border-border-subtle pl-4">
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Queue:</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {queueStatus.jobs.queued} waiting
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                              {queueStatus.jobs.processing} active
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Input Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="prompt-bar rounded-full p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-accent-solid transition-all duration-300 shadow-xl">
            <button className="p-2 hover:bg-bg-sub rounded-full transition-colors ml-1 text-gray-900 dark:text-gray-400" style={{ color: '#374151' }}>
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
              placeholder="🪄 Type your prompt..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 px-4 py-3 text-sm md:text-base"
              style={{ color: '#111827' }}
            />

            <button className="p-2 hover:bg-bg-sub rounded-full transition-colors text-gray-900 dark:text-gray-400" style={{ color: '#374151' }}>
              <span className="text-xl">🎙️</span>
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition-all  disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
