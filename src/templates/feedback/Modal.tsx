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
  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  description,
  open,
  isOpen,
  visible,
  size = 'medium',
  showCloseButton = true,
  closable = true,
  onClose,
  footer,
  actions,
  children,
}) => {
  // Default to true for generated components (they're being rendered intentionally)
  const defaultOpen = open ?? isOpen ?? visible ?? true;
  const [isVisible, setIsVisible] = useState(Boolean(defaultOpen));

  useEffect(() => {
    const shouldShow = open ?? isOpen ?? visible ?? true;
    setIsVisible(Boolean(shouldShow));
    console.log('[Modal] Visibility:', shouldShow, { open, isOpen, visible, children });
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
    fullscreen: 'max-w-[95vw] w-full max-h-[95vh]',
  };

  return (
    <>
      {/* Backdrop - Fixed positioning for proper overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closable ? handleClose : undefined}
      />

      {/* Modal Container */}
      <div className={`fixed inset-0 flex items-center justify-center ${size === 'fullscreen' ? 'p-2' : 'p-4'} z-50`}>
        {/* Modal */}
        <div className={`relative ${sizeClasses[size]} w-full card border border-gray-300 dark:border-gray-700 ${size === 'fullscreen' ? 'rounded-lg' : 'rounded-2xl'} shadow-2xl flex flex-col overflow-hidden`}>
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  {title && (
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">{title}</h3>
                  )}
                  {description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  )}
                </div>
                {showCloseButton && closable && (
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1 flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4 text-gray-700 dark:text-gray-300">
            {content && typeof content === 'string' && <p>{content}</p>}
            {children}
          </div>

          {/* Footer */}
          {(footer || actions) && (
            <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {footer && <div className="text-gray-600 dark:text-gray-400 flex-1 text-sm">{footer}</div>}
              {actions && actions.map((action, index) => {
                const variantClasses = {
                  primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-md',
                  secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
                  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
                };
                return (
                  <button
                    key={index}
                    onClick={action.onClick || handleClose}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${variantClasses[action.variant || 'secondary']}`}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
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
