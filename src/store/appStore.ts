import { create } from 'zustand';
import type { ComponentSpec } from '../templates/core/types';
import type { JobStatus, QueueStatus } from '../types/api.types';
import { generateUUID } from '../utils/uuid';

interface AppState {
  // Current session
  currentSessionId: string;

  // Inspector state
  inspectedComponent: ComponentSpec | null;
  setInspectedComponent: (component: ComponentSpec | null) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Current thread context
  currentThreadId: string | null;
  lastActiveThreadId: string | null;
  setCurrentThreadId: (threadId: string | null) => void;

  // Component generation history (in-memory for current session)
  generatedComponents: ComponentSpec[];
  addGeneratedComponent: (component: ComponentSpec) => void;
  clearGeneratedComponents: () => void;

  // Chat state management
  shouldStartNewChat: boolean;
  triggerNewChat: () => void;
  resetNewChatTrigger: () => void;

  // Active threads state (supporting concurrent generation)
  activeThreads: Record<string, {
    isLoading: boolean;
    jobStatus: JobStatus | null;
    queueStatus: QueueStatus | null;
    jobId: string | null;
    historyItemId: string | null;
    abortController: AbortController | null;
  }>;
  setThreadState: (threadId: string, state: Partial<AppState['activeThreads'][string]>) => void;
  clearThreadState: (threadId: string) => void;

  // Current chat draft (persistent while navigating)
  currentChatMessages: {
    id: string;
    role: 'user' | 'assistant';
    content: string | ComponentSpec;
    timestamp: number;
  }[];
  setCurrentChatMessages: (messages: AppState['currentChatMessages']) => void;
  addChatMessage: (message: AppState['currentChatMessages'][number]) => void;
  clearCurrentChatMessages: () => void;
  currentChatInput: string;
  setCurrentChatInput: (input: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSessionId: generateUUID(),

  inspectedComponent: null,
  setInspectedComponent: (component) => set({ inspectedComponent: component }),

  theme: 'light', // Ensure default is light
  setTheme: (theme) => {
    set({ theme });
  },

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  currentThreadId: null,
  lastActiveThreadId: null,
  setCurrentThreadId: (threadId) => set(() => {
    // If setting a real thread ID, remember it as the last active one
    if (threadId !== null) {
      return { currentThreadId: threadId, lastActiveThreadId: threadId };
    }
    return { currentThreadId: threadId };
  }),

  generatedComponents: [],
  addGeneratedComponent: (component) =>
    set((state) => ({
      // Cap at 50 to prevent unbounded memory growth
      generatedComponents: [...state.generatedComponents, component].slice(-50),
    })),
  clearGeneratedComponents: () => set({ generatedComponents: [] }),

  // Chat state
  shouldStartNewChat: false,
  triggerNewChat: () => set({ shouldStartNewChat: true }),
  resetNewChatTrigger: () => set({ shouldStartNewChat: false }),

  // Active threads
  activeThreads: {},
  setThreadState: (threadId, partialState) =>
    set((state) => ({
      activeThreads: {
        ...state.activeThreads,
        [threadId]: {
          ...(state.activeThreads[threadId] || {
            isLoading: false,
            jobStatus: null,
            queueStatus: null,
            jobId: null,
            historyItemId: null,
            abortController: null,
          }),
          ...partialState,
        },
      },
    })),
  clearThreadState: (threadId) =>
    set((state) => {
      const newThreads = { ...state.activeThreads };
      delete newThreads[threadId];
      return { activeThreads: newThreads };
    }),

  // Current chat draft
  currentChatMessages: [],
  setCurrentChatMessages: (messages) => set({ currentChatMessages: messages }),
  addChatMessage: (message) =>
    set((state) => ({
      currentChatMessages: [...state.currentChatMessages, message],
    })),
  clearCurrentChatMessages: () => set({ currentChatMessages: [] }),
  currentChatInput: '',
  setCurrentChatInput: (input) => set({ currentChatInput: input }),
}));
