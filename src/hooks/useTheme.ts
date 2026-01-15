import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();

  // Apply theme class to document root immediately
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    console.log('Theme changed to:', theme); // Debug log
    
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('Applied dark class');
    } else if (theme === 'light') {
      // Explicitly ensure light mode (remove dark class)
      root.classList.remove('dark');
      console.log('Removed dark class for light mode');
    } else if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        console.log('Applied dark class for system dark preference');
      } else {
        root.classList.remove('dark');
        console.log('Removed dark class for system light preference');
      }
    } else {
      // Fallback to light mode
      root.classList.remove('dark');
      console.log('Fallback: removed dark class');
    }
  }, [theme]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Initialize theme immediately on first load
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    
    console.log('Initializing theme, saved theme:', savedTheme); // Debug log
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Set default to light mode if no saved theme
      console.log('No saved theme, setting to light');
      setTheme('light');
      localStorage.setItem('theme', 'light');
      root.classList.remove('dark'); // Ensure light mode is active immediately
    }
    
    // Force light mode if currently selected
    if (!savedTheme || savedTheme === 'light') {
      root.classList.remove('dark');
      console.log('Forced light mode on initialization');
    }
  }, [setTheme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setSystemTheme = () => {
    setTheme('system');
  };

  const isDarkMode = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    setSystemTheme,
    isDarkMode: isDarkMode(),
  };
};