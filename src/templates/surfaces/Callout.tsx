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
      <div className="glass-dark border border-gray-700/50 rounded-lg p-4 my-2">
        <div className="text-text-tertiary text-sm">No content provided</div>
      </div>
    );
  }

  const variantConfig = {
    info: {
      bgClass: 'bg-info/10 border-info/30',
      textClass: 'text-info',
      iconClass: 'text-info',
      Icon: Info,
    },
    warning: {
      bgClass: 'bg-warning/10 border-warning/30',
      textClass: 'text-warning',
      iconClass: 'text-warning',
      Icon: AlertTriangle,
    },
    success: {
      bgClass: 'bg-success/10 border-success/30',
      textClass: 'text-success',
      iconClass: 'text-success',
      Icon: CheckCircle,
    },
    error: {
      bgClass: 'bg-error/10 border-error/30',
      textClass: 'text-error',
      iconClass: 'text-error',
      Icon: XCircle,
    },
    tip: {
      bgClass: 'bg-accent-cyan/10 border-accent-cyan/30',
      textClass: 'text-accent-cyan',
      iconClass: 'text-accent-cyan',
      Icon: Lightbulb,
    },
    note: {
      bgClass: 'bg-accent-purple/10 border-accent-purple/30',
      textClass: 'text-accent-purple',
      iconClass: 'text-accent-purple',
      Icon: AlertCircle,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={`
        ${config.bgClass}
        border rounded-lg p-4 my-2
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
          
          <div className="text-text-secondary text-sm leading-relaxed">
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
