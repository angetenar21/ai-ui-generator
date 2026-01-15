import React, { useState, useEffect } from 'react';

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
  action?: { label: string; onClick?: () => void };
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
    info: { icon: icon || 'ℹ️', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/50' },
    success: { icon: icon || '✓', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
    warning: { icon: icon || '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
    error: { icon: icon || '✕', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' },
  };

  const positionClasses = {
    'top-left': 'justify-start',
    'top-right': 'justify-end',
    'bottom-left': 'justify-start',
    'bottom-right': 'justify-end',
  };

  const config = typeConfig[notificationType];

  return (
    <div className={`relative flex ${positionClasses[position]} w-full mb-4`}>
      <div className={`glass-dark border border-gray-300 dark:border-${config.border.replace('border-', '')} rounded-xl shadow-lg overflow-hidden max-w-md`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
              <span className="text-xl">{config.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-sm font-semibold ${config.color} mb-1`}>{title}</h4>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300">{displayMessage}</p>
              {action && (
                <button
                  onClick={() => {
                    if (action.onClick) action.onClick();
                    handleClose();
                  }}
                  className={`mt-2 text-xs font-semibold ${config.color} hover:underline`}
                >
                  {action.label}
                </button>
              )}
            </div>
            {closable && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
