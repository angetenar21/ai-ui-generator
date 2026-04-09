import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb, AlertCircle } from 'lucide-react';

interface CalloutProps {
  /** Callout title */
  title?: string;

  /** Main content/message */
  content: string;

  /** Visual variant */
  variant?: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';

  /** Show icon */
  showIcon?: boolean;

  /** Make dismissible */
  dismissible?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Callout: React.FC<CalloutProps> = ({
  title,
  content,
  variant = 'info',
  showIcon = true,
  dismissible = false,
}) => {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) return null;

  if (!content) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">No content provided</div>
      </div>
    );
  }

  const variantConfig = {
    info: {
      bgClass: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      textClass: 'text-indigo-700 dark:text-indigo-300',
      iconClass: 'text-indigo-600 dark:text-indigo-400',
      Icon: Info,
    },
    warning: {
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      textClass: 'text-yellow-700 dark:text-yellow-300',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      Icon: AlertTriangle,
    },
    success: {
      bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textClass: 'text-green-700 dark:text-green-300',
      iconClass: 'text-green-600 dark:text-green-400',
      Icon: CheckCircle,
    },
    error: {
      bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      textClass: 'text-red-700 dark:text-red-300',
      iconClass: 'text-red-600 dark:text-red-400',
      Icon: XCircle,
    },
    tip: {
      bgClass: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      textClass: 'text-indigo-700 dark:text-indigo-300',
      iconClass: 'text-indigo-600 dark:text-indigo-400',
      Icon: Lightbulb,
    },
    note: {
      bgClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      textClass: 'text-purple-700 dark:text-purple-300',
      iconClass: 'text-purple-600 dark:text-purple-400',
      Icon: AlertCircle,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={`
        ${config.bgClass}
        border rounded-lg p-4
        transition-all duration-200
      `}
    >
      <div className="flex gap-3">
        {showIcon && (
          <div className={`flex-shrink-0 ${config.iconClass}`}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <div className={`font-semibold text-sm mb-1 ${config.textClass}`}>
              {title}
            </div>
          )}

          <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {content}
          </div>
        </div>

        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className={`
              flex-shrink-0 ${config.textClass} hover:opacity-70
              transition-opacity
            `}
            aria-label="Dismiss"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Callout;

export const metadata = {
  name: 'callout',
  category: 'surfaces' as const,
  component: Callout,
  description: 'Attention-grabbing callout box for important information, warnings, tips, and notes',
  tags: ['callout', 'alert', 'info', 'notice', 'banner', 'message'],
  propTypes: {
    content: 'string (required) - Main content/message to display',
    title: 'string - Optional title for the callout',
    variant: 'string - Visual style: info, warning, success, error, tip, note (default: info)',
    showIcon: 'boolean - Show variant icon (default: true)',
    dismissible: 'boolean - Allow user to dismiss the callout (default: false)',
  },
};
