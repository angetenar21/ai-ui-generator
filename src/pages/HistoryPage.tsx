import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import StorageService from '../services/storageService';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import type { GenerationHistory } from '../templates/core/types';

interface Thread {
  id: string;
  items: GenerationHistory[];
  lastTimestamp: number;
  firstPrompt: string;
}

const HistoryPage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const navigate = useNavigate();
  const { setCurrentThreadId, clearGeneratedComponents, triggerNewChat } = useAppStore();

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = () => {
    const history = StorageService.getHistory();
    
    // Group history items by threadId
    const threadMap = new Map<string, GenerationHistory[]>();
    
    history.forEach(item => {
      const threadId = item.threadId || item.id;
      if (!threadMap.has(threadId)) {
        threadMap.set(threadId, []);
      }
      threadMap.get(threadId)!.push(item);
    });

    // Convert to Thread objects
    const threadList: Thread[] = Array.from(threadMap.entries()).map(([threadId, items]) => {
      const sortedItems = items.sort((a, b) => a.timestamp - b.timestamp);
      return {
        id: threadId,
        items: sortedItems,
        lastTimestamp: Math.max(...items.map(i => i.timestamp)),
        firstPrompt: sortedItems[0].prompt,
      };
    });

    // Sort threads by last activity
    threadList.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
    
    setThreads(threadList);
  };

  const handleThreadClick = (threadId: string) => {
    clearGeneratedComponents();
    setCurrentThreadId(threadId);
    triggerNewChat();
    navigate('/');
  };

  const handleDeleteThread = (threadId: string) => {
    if (confirm('Are you sure you want to delete this entire thread?')) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        thread.items.forEach(item => {
          StorageService.deleteHistoryItem(item.id);
        });
        loadThreads();
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      StorageService.clearHistory();
      loadThreads();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-page mx-auto px-6 pt-8 pb-24">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-700 dark:text-gray-400 mb-2" style={{ color: '#6B7280' }}>
            History
          </p>
          <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2" style={{ color: '#111827' }}>
            Chat History
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg" style={{ color: '#374151' }}>
            Browse through your previous AI generations
          </p>
        </div>

        {threads.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 rounded-xl
                     font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {threads.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="card rounded-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white">
              <MessageSquare className="w-8 h-8" />
            </div>
                        <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2" style={{ color: '#111827' }}>
              No History Found
            </h3>
            <p className="text-gray-700 dark:text-gray-300" style={{ color: '#374151' }}>
              Create your first AI component to see it here
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="card rounded-card p-5 hover:shadow-card transition-all hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleThreadClick(thread.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete thread"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" style={{ color: '#111827' }}>
                {thread.firstPrompt}
              </h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400" style={{ color: '#6B7280' }}>
                  {thread.items.length} {thread.items.length === 1 ? 'message' : 'messages'}
                </span>
                <span className="text-gray-500 dark:text-gray-500 text-xs" style={{ color: '#9CA3AF' }}>
                  {formatDate(thread.lastTimestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
