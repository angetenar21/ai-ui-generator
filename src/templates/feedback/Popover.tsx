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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[6px] border-x-[6px] border-x-transparent border-t-gray-900 dark:border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[6px] border-x-[6px] border-x-transparent border-b-gray-900 dark:border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[6px] border-y-[6px] border-y-transparent border-l-gray-900 dark:border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[6px] border-y-[6px] border-y-transparent border-r-gray-900 dark:border-r-gray-800',
  };

  return (
    <div className="card rounded-card p-6 my-4">
      <div className="relative inline-block">
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
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
            <div className={`absolute ${positionClasses[popoverPosition]} z-50`}>
              <div
                className="relative bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 rounded-md shadow-lg px-3 py-2 max-w-[200px]"
                onClick={handleContentClick}
              >
                {title && (
                  <h4 className="text-xs font-semibold text-white mb-1">{title}</h4>
                )}
                <div className="text-xs text-gray-100 dark:text-gray-300 leading-snug whitespace-normal break-words">{popoverContent}</div>
                {arrow && (
                  <div className={`absolute ${arrowClasses[popoverPosition]} w-0 h-0`} />
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
