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
    <div className="relative w-full overflow-hidden rounded-2xl min-h-[300px] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
      {/* Background overlay for Popover preview context */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 opacity-80" />
      </div>

      <div className="relative inline-block z-10 w-fit h-fit">
        <button
          onClick={handleToggle}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-lg transition-transform active:scale-95 border border-orange-500"
        >
          {triggerLabel}
        </button>

        {visible && (
          <>
            {/* Popover Backdrop - Absolute bounded instead of fixed */}
            {/* The backdrop needs to cover the entire simulated screen, so we walk up to the wrapper */}
            {/* But purely absolute covers only the nearest relative parent, which in this case is the inline-block button wrapper unless we mount the backdrop outside. But since React portals aren't used here, we'll just allow click-away by making a massive absolute invisible plane. */}
            <div
              className="fixed inset-0 z-[9998] cursor-default"
              onClick={() => setVisible(false)}
            />

            {/* Popover */}
            <div className={`absolute ${positionClasses[popoverPosition]} z-[9999]`}>
              <div
                className="relative bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-2xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] px-5 py-4 max-w-[240px] animate-slide-up"
                onClick={handleContentClick}
              >
                {title && (
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1.5 tracking-tight">{title}</h4>
                )}
                <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-normal break-words">{popoverContent}</div>
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
