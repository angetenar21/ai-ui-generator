import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  console.log('ThemeToggle current theme:', theme); // Debug log

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  const Icon = theme === 'dark' ? Moon : Sun;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
      title={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;