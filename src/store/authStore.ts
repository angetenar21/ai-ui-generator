import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeAuth: () => () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true by default until Firebase verifies state
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Sync user data to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLoginAt: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error('[authStore] Failed to establish user DB sync:', error);
        }
      }

      // Automatically updates UI when user logs in/out
      set({ 
        user: user || null, 
        isAuthenticated: !!user, 
        isLoading: false 
      });
    });
    return unsubscribe;
  },
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false })
}));
