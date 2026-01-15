import { create } from 'zustand';
import type { ComponentSpec } from '../templates/core/types';

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
}

export const useAppStore = create<AppState>((set) => ({
  currentSessionId: crypto.randomUUID(),

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
}));
