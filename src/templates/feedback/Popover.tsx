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
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[6px] border-x-[6px] border-x-transparent border-t-white dark:border-t-zinc-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[6px] border-x-[6px] border-x-transparent border-b-white dark:border-b-zinc-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[6px] border-y-[6px] border-y-transparent border-l-white dark:border-l-zinc-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[6px] border-y-[6px] border-y-transparent border-r-white dark:border-r-zinc-800',
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
              className="fixed inset-0 z-[9998]"
              onClick={() => setVisible(false)}
            />

            {/* Popover */}
            <div className={`absolute ${positionClasses[popoverPosition]} z-[9999]`}>
              <div
                className="relative bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-2xl shadow-xl px-4 py-3 max-w-[240px]"
                onClick={handleContentClick}
              >
                {title && (
                  <h4 className="text-xs font-display font-bold text-zinc-900 dark:text-white mb-1.5 tracking-tight">{title}</h4>
                )}
                <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-normal break-words">{popoverContent}</div>
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
