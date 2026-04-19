import React, { useState, useEffect } from 'react';
import DynamicIcon from '../core/Icon';

interface NotificationProps {
  title?: string;
  message?: string;
  text?: string;
  content?: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  severity?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  duration?: number;
  autoHide?: boolean;
  closable?: boolean;
  priority?: 'low' | 'normal' | 'high';
  audience?: string;
  onClose?: () => void;
  action?: {
    label: string; onClick?: () => void
    children?: React.ReactNode;
    renderChild?: (child: any) => React.ReactNode;
  };
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  text,
  content,
  description,
  type,
  severity,
  icon,
  duration = 0,
  autoHide = false,
  closable = true,
  onClose,
  action,
}) => {
  const [visible, setVisible] = useState(true);
  const displayMessage = message || text || content || description || 'Notification message';
  const notificationType = type || severity || 'info';

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const typeConfig = {
    info: {
      icon: icon || 'info',
      container: 'border border-orange-200/60 dark:border-orange-500/30 bg-orange-50/80 dark:bg-orange-900/20',
      chip: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
      badge: 'bg-orange-600 text-white',
      text: 'text-zinc-900 dark:text-white',
      label: 'INFO',
    },
    success: {
      icon: icon || 'check-circle',
      container: 'border border-green-200/60 dark:border-green-500/30 bg-green-50/80 dark:bg-green-900/20',
      chip: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
      badge: 'bg-green-600 text-white',
      text: 'text-zinc-900 dark:text-white',
      label: 'SUCCESS',
    },
    warning: {
      icon: icon || 'alert-triangle',
      container: 'border border-amber-200/60 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-900/20',
      chip: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-500 text-white',
      text: 'text-zinc-900 dark:text-white',
      label: 'WARNING',
    },
    error: {
      icon: icon || 'x-circle',
      container: 'border border-red-200/60 dark:border-red-500/30 bg-red-50/80 dark:bg-red-900/20',
      chip: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
      badge: 'bg-red-600 text-white',
      text: 'text-zinc-900 dark:text-white',
      label: 'ERROR',
    },
  };

  const config = typeConfig[notificationType] || typeConfig['info'];

  // Always render inline for preview-safe display
  // (fixed positioning escapes the preview iframe/container, causing off-screen renders)
  return (
    <div className="w-full my-2">
      <div
        className={`backdrop-blur-sm ${config.container} rounded-2xl shadow-xl overflow-hidden w-full transition-all duration-300 ease-out`}
        style={{ animation: 'slideDown 0.3s ease-out' }}
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full ${config.badge}`} />

        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.chip} flex items-center justify-center mt-0.5`}>
              <DynamicIcon name={config.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                {title && (
                  <h4 className={`text-sm font-semibold tracking-tight ${config.text}`}>{title}</h4>
                )}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${config.badge} uppercase tracking-wider`}>{config.label}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{displayMessage}</p>
              {action && (
                <button
                  onClick={() => {
                    if (action.onClick) action.onClick();
                    handleClose();
                  }}
                  className="mt-3 text-sm font-medium text-zinc-900 dark:text-white hover:opacity-80 transition-opacity underline underline-offset-2"
                >
                  {action.label}
                </button>
              )}
            </div>
            {closable && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all duration-300 ease-out p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;

export const metadata = {
  name: 'notification',
  category: 'feedback' as const,
  component: Notification,
  description: 'Notification alert component for displaying rich notifications with title, message, icon, and optional actions.',
  tags: ['ui', 'feedback', 'notification', 'alert', 'message', 'toast'],
};
