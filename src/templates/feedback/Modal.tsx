import React, { useState, useEffect } from 'react';

interface ModalProps {
  title?: string;
  content?: string;
  message?: string;
  description?: string;
  open?: boolean;
  isOpen?: boolean;
  visible?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closable?: boolean;
  onClose?: () => void;
  footer?: string;
  actions?: Array<{ label: string; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' }>;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  message,
  description,
  open = true,
  isOpen,
  visible,
  size = 'medium',
  showCloseButton = true,
  closable = true,
  onClose,
  footer,
  actions,
}) => {
  const [isVisible, setIsVisible] = useState(open || isOpen || visible || false);
  const displayContent = content || message || description || 'Modal content';

  useEffect(() => {
    const shouldShow = open || isOpen || visible;
    setIsVisible(shouldShow !== undefined ? shouldShow : true);
  }, [open, isOpen, visible]);

  const handleClose = () => {
    if (closable && onClose) {
      onClose();
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullscreen: 'max-w-full w-full h-full m-0',
  };

  return (
    <div className="relative flex items-center justify-center p-4 min-h-[400px]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl"
        onClick={closable ? handleClose : undefined}
      />

      {/* Modal */}
      <div className={`relative ${sizeClasses[size]} w-full glass-dark border border-gray-300 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-10`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            )}
            {showCloseButton && closable && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 text-gray-700 dark:text-gray-300">
          {displayContent}
        </div>

        {/* Footer */}
        {(footer || actions) && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            {footer && <div className="text-gray-400 flex-1">{footer}</div>}
            {actions && actions.map((action, index) => {
              const variantClasses = {
                primary: 'bg-blue-600 hover:bg-blue-700 text-white',
                secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
                danger: 'bg-red-600 hover:bg-red-700 text-white',
              };
              return (
                <button
                  key={index}
                  onClick={action.onClick || handleClose}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${variantClasses[action.variant || 'secondary']}`}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

export const metadata = {
  name: 'modal',
  category: 'feedback' as const,
  component: Modal,
  description: 'Modal dialog component with customizable size, header, content, and actions. Includes backdrop and close functionality.',
  tags: ['ui', 'feedback', 'dialog', 'overlay', 'popup'],
};
