import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  /** Optional label */
  label?: string;
  /** Size of the toggle */
  size?: 'small' | 'medium' | 'large';
  /** Display format */
  variant?: 'icon' | 'button' | 'switch';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  label,
  size = 'medium',
  variant = 'icon'
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    small: 'p-1.5 py-1 text-sm',
    medium: 'p-2 py-1.5 text-base',
    large: 'p-3 py-2 text-lg',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  if (variant === 'switch') {
    // A nice iOS-style switch toggle
    return (
      <div className="flex items-center gap-3">
        {label && <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>}
        <button
          onClick={toggleTheme}
          className={`relative flex items-center transition-all duration-300 rounded-full w-12 h-6 p-1
            ${isDarkMode ? 'bg-indigo-600' : 'bg-stone-300'}`}
          aria-label="Toggle theme"
        >
          <div className={`flex items-center justify-center w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}>
             {isDarkMode ? <Moon className="w-2.5 h-2.5 text-indigo-600" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
          </div>
        </button>
      </div>
    );
  }

  if (variant === 'button' || label) {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 rounded-xl transition-all duration-300 ease-out font-medium
                   bg-white/80 hover:bg-stone-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-700
                   text-stone-700 dark:text-zinc-200 border border-stone-200 dark:border-zinc-700
                   shadow-sm hover:shadow active:scale-95 ${sizeClasses[size]}`}
      >
        {isDarkMode ? <Sun className={iconSizes[size]} /> : <Moon className={iconSizes[size]} />}
        <span>{label || (isDarkMode ? 'Light Mode' : 'Dark Mode')}</span>
      </button>
    );
  }

  // Default icon-only variant
  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center
                 bg-white hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-700
                 text-stone-600 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700
                 shadow-sm hover:shadow active:scale-95 text-base p-2`}
      aria-label="Toggle theme"
    >
        {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
    </button>
  );
};

export default ThemeToggle;

export const metadata = {
  name: 'theme-toggle',
  category: 'layout' as const,
  component: ThemeToggle,
  description: 'A toggle switch or button used to change the application theme between light and dark mode.',
  tags: ['ui', 'theme', 'darkmode', 'lightmode', 'toggle', 'switch'],
};
