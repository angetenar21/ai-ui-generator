import React, { useState, useEffect } from 'react';
import DummyAppBackground from '../../components/DummyAppBackground';

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

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullscreen: 'max-w-[95vw] w-full max-h-[95vh]',
  };

  return (
    <div className="relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden min-h-[500px]">
      {/* Dummy UI Background for Context - ALWAYS PRESENT */}
      <DummyAppBackground />

      {/* Optional Trigger Button inside the preview sandbox */}
      {!isVisible && triggerText && (
        <div className="absolute inset-0 flex items-center justify-center z-[10]">
          <button
            onClick={() => setIsVisible(true)}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg font-medium transition-transform active:scale-95 border border-orange-500"
          >
            {triggerText}
          </button>
        </div>
      )}

      {isVisible && (
        <>
          {/* Backdrop - Absolute positioning for proper overlay within preview */}
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-out"
            onClick={closable ? handleClose : undefined}
          />

          {/* Modal Container */}
          <div className={`absolute inset-0 flex items-center justify-center ${size === 'fullscreen' ? 'p-2' : 'p-4'} z-[9999] pointer-events-none`}>
            {/* Modal */}
            <div className={`relative ${sizeClasses[size]} w-full pointer-events-auto bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700/50 ${size === 'fullscreen' ? 'rounded-xl' : 'rounded-3xl'} shadow-2xl dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[460px] transition-all duration-300 ease-out`}>
              {/* Header */}
              {(title || description || showCloseButton) && (
                <div className="flex-shrink-0 p-6 border-b border-zinc-100 dark:border-zinc-800/60 bg-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      {title && (
                        <h3 className="text-xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h3>
                      )}
                      {description && (
                        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
                      )}
                    </div>
                    {showCloseButton && closable && (
                      <button
                        onClick={handleClose}
                        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all duration-300 ease-out rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 flex-shrink-0"
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
              <div className="flex-1 overflow-y-auto px-6 py-5 text-zinc-700 dark:text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
                {content && typeof content === 'string' && <p className="leading-relaxed">{content}</p>}
                {children}
              </div>

              {/* Footer */}
              {(footer || actions) && (
                <div className="flex-shrink-0 flex items-center justify-end gap-3 p-6 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/20">
                  {footer && <div className="text-zinc-500 dark:text-zinc-400 flex-1 text-sm font-medium">{footer}</div>}
                  {actions && actions.map((action, index) => {
                    const variantClasses = {
                      primary: 'bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm hover:shadow active:scale-95',
                      secondary: 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/70 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm active:scale-95',
                      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow active:scale-95',
                    };
                    return (
                      <button
                        key={index}
                        onClick={action.onClick || handleClose}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out ${variantClasses[action.variant || 'secondary']}`}
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
