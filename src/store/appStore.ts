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
  setCurrentThreadId: (threadId: string | null) => void;

  // Component generation history (in-memory for current session)
  generatedComponents: ComponentSpec[];
  addGeneratedComponent: (component: ComponentSpec) => void;
  clearGeneratedComponents: () => void;

  // Chat state management
  shouldStartNewChat: boolean;
  triggerNewChat: () => void;
  resetNewChatTrigger: () => void;

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
  chatIsLoading: boolean;
  setChatIsLoading: (isLoading: boolean) => void;
  chatJobStatus: JobStatus | null;
  setChatJobStatus: (status: JobStatus | null) => void;
  chatQueueStatus: QueueStatus | null;
  setChatQueueStatus: (status: QueueStatus | null) => void;
  chatJobId: string | null;
  setChatJobId: (jobId: string | null) => void;
  chatHistoryItemId: string | null;
  setChatHistoryItemId: (historyItemId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSessionId: generateUUID(),

  inspectedComponent: null,
  setInspectedComponent: (component) => set({ inspectedComponent: component }),

  theme: 'light', // Ensure default is light
  setTheme: (theme) => {
    console.log('Store: Setting theme to', theme);
    set({ theme });
  },

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  currentThreadId: null,
  setCurrentThreadId: (threadId) => set({ currentThreadId: threadId }),

  generatedComponents: [],
  addGeneratedComponent: (component) =>
    set((state) => ({
      generatedComponents: [...state.generatedComponents, component],
    })),
  clearGeneratedComponents: () => set({ generatedComponents: [] }),

  // Chat state
  shouldStartNewChat: false,
  triggerNewChat: () => set({ shouldStartNewChat: true }),
  resetNewChatTrigger: () => set({ shouldStartNewChat: false }),

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
  chatIsLoading: false,
  setChatIsLoading: (isLoading) => set({ chatIsLoading: isLoading }),
  chatJobStatus: null,
  setChatJobStatus: (status) => set({ chatJobStatus: status }),
  chatQueueStatus: null,
  setChatQueueStatus: (status) => set({ chatQueueStatus: status }),
  chatJobId: null,
  setChatJobId: (jobId) => set({ chatJobId: jobId }),
  chatHistoryItemId: null,
  setChatHistoryItemId: (historyItemId) => set({ chatHistoryItemId: historyItemId }),
}));
