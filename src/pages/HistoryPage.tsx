import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { GenerationHistory } from '../templates/core/types';

interface Thread {
  id: string;
  items: GenerationHistory[];
  lastTimestamp: number;
  firstPrompt: string;
  status?: 'pending' | 'completed' | 'error' | 'stopped';
}

const HistoryPage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setCurrentThreadId, clearGeneratedComponents, clearCurrentChatMessages, setCurrentChatInput } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadThreads();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadThreads = async () => {
    setIsLoading(true);
    if (!user) return;

    try {
      // PERFORMANCE FIX: We strictly limit query results to 100 heavily-sorted components max 
      // preventing infinite loops, massive memory overhead, and uncontrolled database billing
      const q = query(
        collection(db, 'components'), 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      
      const history: GenerationHistory[] = [];
      querySnapshot.forEach((document: any) => {
        const data = document.data();
        history.push({
          id: document.id,
          timestamp: data.timestamp || Date.now(),
          prompt: data.prompt,
          response: data.spec ? (typeof data.spec === 'string' ? JSON.parse(data.spec) : data.spec) : {},
          threadId: data.threadId || data.jobId,
          sessionId: data.userId || 'unknown',
          status: data.status || 'completed'
        });
      });

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
        const hasPending = items.some((item) => item.status === 'pending');
        const hasError = items.some((item) => item.status === 'error');
        const hasStopped = items.some((item) => item.status === 'stopped');
        return {
          id: threadId,
          items: sortedItems,
          lastTimestamp: Math.max(...items.map(i => i.timestamp)),
          firstPrompt: sortedItems[0].prompt,
          status: hasPending ? 'pending' : hasError ? 'error' : hasStopped ? 'stopped' : 'completed',
        };
      });

      // Sort threads by last activity
      threadList.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
      setThreads(threadList);
    } catch (error) {
      console.error('Failed to load history from Firestore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadClick = (threadId: string) => {
    clearGeneratedComponents();
    clearCurrentChatMessages();
    setCurrentChatInput('');
    setCurrentThreadId(threadId);
    navigate('/');
  };

  const handleDeleteThread = async (threadId: string) => {
    if (confirm('Are you sure you want to delete this entire thread from the cloud?')) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        try {
          for (const item of thread.items) {
            await deleteDoc(doc(db, 'components', item.id));
          }
          await loadThreads();
        } catch (error) {
          console.error('Error deleting thread:', error);
        }
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to permanently clear all history?')) {
      try {
        for (const thread of threads) {
          for (const item of thread.items) {
            await deleteDoc(doc(db, 'components', item.id));
          }
        }
        await loadThreads();
      } catch (error) {
        console.error('Error clearing history:', error);
      }
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
    <div className="h-full w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-24 flex flex-col bg-transparent relative z-10 overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-3 sm:gap-4 pl-2">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-stone-900 dark:text-white mb-1 sm:mb-2 tracking-tight">
            Chat History
          </h2>
          <p className="text-stone-500 dark:text-gray-400 text-sm md:text-base max-w-2xl">
            Browse through your previous AI generations
          </p>
        </div>

        {threads.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400 rounded-2xl
                     text-sm sm:text-base font-medium transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : threads.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
           <div className="max-w-md w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl p-12 text-center border border-stone-200/50 dark:border-gray-700/50 shadow-sm animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-50 dark:bg-gray-900/50 flex items-center justify-center border border-orange-100/50 dark:border-gray-700 shadow-inner">
              <MessageSquare className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-stone-900 dark:text-white mb-2">
              No History Found
            </h3>
            <p className="text-stone-500 dark:text-gray-400">
              Create your first AI component to see it here
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 animate-fade-in-up">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[1.5rem] p-5 border border-stone-200/50 dark:border-gray-800 hover:border-orange-300/60 dark:hover:border-orange-800/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden flex flex-col h-full"
              onClick={() => handleThreadClick(thread.id)}
            >
              {/* Decorative background gradient on hover */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-orange-100/50 dark:border-gray-700 shadow-inner transition-all group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-pink-600">
                  <MessageSquare className="w-4 h-4 text-orange-500 dark:text-gray-300 group-hover:text-white transition-colors drop-shadow-none group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
                {thread.status === 'pending' && (
                  <div className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/40">
                    Processing
                  </div>
                )}
                {thread.status === 'error' && (
                  <div className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40">
                    Error
                  </div>
                )}
                {thread.status === 'stopped' && (
                  <div className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                    Stopped
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                  className="p-2 ml-auto -mr-2 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-500 dark:text-gray-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                  title="Delete thread"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-4 line-clamp-2 leading-snug relative z-10 group-hover:text-orange-500 transition-colors">
                {thread.firstPrompt}
              </h3>

              <div className="flex items-center justify-between text-xs font-medium border-t border-stone-100 dark:border-gray-800 pt-3 relative z-10 mt-auto">
                <span className="text-stone-500 dark:text-gray-400 font-semibold">
                  {thread.items.length} {thread.items.length === 1 ? 'msg' : 'msgs'}
                </span>
                <span className="text-stone-400 dark:text-gray-500">
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
