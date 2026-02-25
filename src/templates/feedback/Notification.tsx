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
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
  autoHide?: boolean;
  closable?: boolean;
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
  position = 'top-right',
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
      container: 'border border-blue-200/50 dark:border-blue-500/20 bg-white/95 dark:bg-gray-900/95',
      chip: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      text: 'text-gray-900 dark:text-white',
    },
    success: {
      icon: icon || 'check-circle',
      container: 'border border-green-200/50 dark:border-green-500/20 bg-white/95 dark:bg-gray-900/95',
      chip: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
      text: 'text-gray-900 dark:text-white',
    },
    warning: {
      icon: icon || 'alert-triangle',
      container: 'border border-amber-200/50 dark:border-amber-500/20 bg-white/95 dark:bg-gray-900/95',
      chip: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
      text: 'text-gray-900 dark:text-white',
    },
    error: {
      icon: icon || 'x-circle',
      container: 'border border-red-200/50 dark:border-red-500/20 bg-white/95 dark:bg-gray-900/95',
      chip: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
      text: 'text-gray-900 dark:text-white',
    },
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const config = typeConfig[notificationType];

  return (
    <div className={`fixed ${positionClasses[position]} z-[10000] pointer-events-none w-full sm:w-auto p-4`}>
      <div className={`backdrop-blur-xl ${config.container} rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden w-full sm:w-[380px] pointer-events-auto animate-slide-in-right`}>
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.chip} flex items-center justify-center mt-0.5`}>
              <DynamicIcon name={config.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              {title && (
                <h4 className={`text-sm font-semibold tracking-tight ${config.text} mb-1`}>{title}</h4>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{displayMessage}</p>
              {action && (
                <button
                  onClick={() => {
                    if (action.onClick) action.onClick();
                    handleClose();
                  }}
                  className="mt-3 text-sm font-medium text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
                >
                  {action.label}
                </button>
              )}
            </div>
            {closable && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
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
