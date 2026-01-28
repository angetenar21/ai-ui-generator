import React from 'react';

interface AlertProps {
  message?: string;
  title?: string;
  description?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  icon?: string;
  closable?: boolean;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  title,
  description,
  severity = 'info',
  variant = 'standard',
  icon,
  closable = false,
  onClose,
}) => {
  const content = message || description || 'Alert message';

  const severityConfig = {
    info: {
      icon: 'ℹ️',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-300',
      filled: 'bg-blue-600 dark:bg-blue-600 text-white',
    },
    success: {
      icon: '✓',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-300 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
      filled: 'bg-green-600 dark:bg-green-600 text-white',
    },
    warning: {
      icon: '⚠️',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-300',
      filled: 'bg-amber-600 dark:bg-amber-600 text-white',
    },
    error: {
      icon: '✕',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-800 dark:text-red-300',
      filled: 'bg-red-600 dark:bg-red-600 text-white',
    },
  };

  const config = severityConfig[severity];
  const displayIcon = icon || config.icon;

  const variantClasses = {
    filled: `${config.filled} border-0`,
    outlined: `${config.bg} border-2 ${config.border} ${config.text}`,
    standard: `${config.bg} border ${config.border} ${config.text}`,
  };

  return (
    <div className={`rounded-lg p-4 my-4 flex items-start gap-3 ${variantClasses[variant]}`}>
      {displayIcon && (
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <span className="text-lg">{displayIcon}</span>
        </div>
      )}

      <div className="flex-1">
        {title && (
          <div className="font-semibold mb-1">{title}</div>
        )}
        <div>{content}</div>
      </div>

      {closable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;

export const metadata = {
  name: 'alert',
  category: 'feedback' as const,
  component: Alert,
  description: 'Alert message component with multiple severity levels and variants',
  tags: ['ui', 'feedback', 'notification'],
};
