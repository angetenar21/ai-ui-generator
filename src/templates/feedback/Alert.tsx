import React from 'react';
import DynamicIcon from '../core/Icon';

interface AlertProps {
  message?: string;
  title?: string;
  description?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  icon?: string;
  closable?: boolean;
  onClose?: () => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  message,
  title,
  description,
  severity = 'info',
  variant = 'filled',
  icon,
  closable = false,
  onClose,
}) => {
  const content = message || description || 'Alert message';

  const severityConfig = {
    info: {
      icon: 'info',
      bg: 'bg-blue-50/80 dark:bg-blue-900/20',
      border: 'border-blue-200/50 dark:border-blue-500/30',
      text: 'text-blue-800 dark:text-blue-300',
      filled: 'bg-blue-600 dark:bg-blue-500 text-white',
    },
    success: {
      icon: 'check-circle',
      bg: 'bg-green-50/80 dark:bg-green-900/20',
      border: 'border-green-200/50 dark:border-green-500/30',
      text: 'text-green-800 dark:text-green-300',
      filled: 'bg-green-600 dark:bg-green-500 text-white',
    },
    warning: {
      icon: 'alert-triangle',
      bg: 'bg-teal-50/80 dark:bg-teal-900/20',
      border: 'border-teal-200/50 dark:border-teal-500/30',
      text: 'text-teal-800 dark:text-teal-300',
      filled: 'bg-teal-500 dark:bg-teal-500 text-white',
    },
    error: {
      icon: 'x-circle',
      bg: 'bg-red-50/80 dark:bg-red-900/20',
      border: 'border-red-200/50 dark:border-red-500/30',
      text: 'text-red-800 dark:text-red-300',
      filled: 'bg-red-600 dark:bg-red-500 text-white',
    },
  };

  const config = severityConfig[severity];
  const displayIcon = icon || config.icon;

  const variantClasses = {
    filled: `${config.filled} border border-transparent shadow-sm`,
    outlined: `${config.bg} border-2 ${config.border} ${config.text} shadow-sm backdrop-blur-sm`,
    standard: `${config.bg} border ${config.border} ${config.text} backdrop-blur-sm`,
  };

  return (
    <div className={`rounded-xl p-4 my-4 flex items-start gap-4 ${variantClasses[variant]} animate-fade-in transition-all duration-200`}>
      {displayIcon && (
        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5 ${variant === 'filled' ? 'text-white' : config.text}`}>
          <DynamicIcon name={displayIcon} size={20} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold tracking-tight mb-1">{title}</div>
        )}
        <div className={`text-sm ${variant === 'filled' ? 'text-white/90' : 'opacity-90'} leading-relaxed`}>{content}</div>
      </div>

      {closable && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 -mt-1 -mr-1 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${variant === 'filled' ? 'text-white/80 hover:text-white' : 'opacity-70 hover:opacity-100'}`}
          aria-label="Close alert"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
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
