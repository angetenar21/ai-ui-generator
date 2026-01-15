import React, { useState } from 'react';

interface PopoverProps {
  content?: string;
  text?: string;
  message?: string;
  title?: string;
  trigger?: string;
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
  closeOnClick?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
  content,
  text,
  message,
  title,
  trigger = 'Click me',
  label,
  position,
  placement,
  arrow = true,
  closeOnClick = false,
}) => {
  const [visible, setVisible] = useState(false);

  const popoverContent = content || text || message || 'Popover content';
  const triggerLabel = label || trigger;
  const popoverPosition = position || placement || 'top';

  const handleToggle = () => {
    setVisible(!visible);
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      setVisible(false);
    }
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent border-r-gray-800',
  };

  return (
    <div className="card rounded-card p-6 my-4">
      <div className="relative inline-block">
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {triggerLabel}
        </button>

        {visible && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setVisible(false)}
            />

            {/* Popover */}
            <div className={`absolute ${positionClasses[popoverPosition]} z-50 w-64`}>
              <div
                className="glass-dark border border-gray-300 dark:border-gray-700/50 rounded-lg shadow-xl p-4"
                onClick={handleContentClick}
              >
                {title && (
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
                )}
                <div className="text-sm text-gray-700 dark:text-gray-300">{popoverContent}</div>
                {arrow && (
                  <div className={`absolute ${arrowClasses[popoverPosition]}`} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Popover;

export const metadata = {
  name: 'popover',
  category: 'feedback' as const,
  component: Popover,
  description: 'Popover component for displaying rich contextual content on click. Attach to any element via label/trigger prop. Supports titles, positioning, and arrows.',
  tags: ['ui', 'feedback', 'popover', 'menu', 'dropdown', 'overlay', 'help'],
};
