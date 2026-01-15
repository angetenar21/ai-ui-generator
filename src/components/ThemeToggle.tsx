import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  console.log('ThemeToggle current theme:', theme); // Debug log

  const themes = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 card-sub rounded-lg">
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${theme === key 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }
          `}
          title={`Switch to ${label} theme`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;