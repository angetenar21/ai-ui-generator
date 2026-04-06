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
  triggerText?: string;
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
  triggerText,
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

  if (!isVisible && !triggerText) {
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
      {/* Optional Trigger Button */}
      {triggerText && (
        <button
          onClick={() => setIsVisible(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors border border-transparent"
        >
          {triggerText}
        </button>
      )}

      {isVisible && (
        <>
          {/* Backdrop - Fixed positioning for proper overlay */}
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm z-[9998] transition-opacity duration-200"
            onClick={closable ? handleClose : undefined}
          />

          {/* Modal Container */}
          <div className={`fixed inset-0 flex items-center justify-center ${size === 'fullscreen' ? 'p-2' : 'p-4'} z-[9999] pointer-events-none`}>
            {/* Modal */}
            <div className={`relative ${sizeClasses[size]} w-full pointer-events-auto bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/50 ${size === 'fullscreen' ? 'rounded-xl' : 'rounded-2xl'} shadow-2xl dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-200`}>
              {/* Header */}
              {(title || description || showCloseButton) && (
                <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100 dark:border-gray-800/60 bg-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      {title && (
                        <h3 className="text-xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
                      )}
                      {description && (
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
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
              <div className="flex-1 overflow-y-auto px-6 py-5 text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                {content && typeof content === 'string' && <p className="leading-relaxed">{content}</p>}
                {children}
              </div>

              {/* Footer */}
              {(footer || actions) && (
                <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-800/20">
                  {footer && <div className="text-gray-500 dark:text-gray-400 flex-1 text-sm font-medium">{footer}</div>}
                  {actions && actions.map((action, index) => {
                    const variantClasses = {
                      primary: 'bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm hover:shadow active:scale-95',
                      secondary: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 shadow-sm active:scale-95',
                      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow active:scale-95',
                    };
                    return (
                      <button
                        key={index}
                        onClick={action.onClick || handleClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${variantClasses[action.variant || 'secondary']}`}
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
      )}
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
