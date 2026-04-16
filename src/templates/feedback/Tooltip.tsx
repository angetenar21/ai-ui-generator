import React, { useState } from 'react';

interface TooltipProps {
  text?: string;
  content?: string;
  message?: string;
  label?: string;
  buttonText?: string;
  triggerText?: string;
  children?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error';
  arrow?: boolean;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  content,
  message,
  label,
  buttonText,
  triggerText,
  children,
  position,
  placement,
  variant = 'dark',
  arrow = true,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const [delayTimeout, setDelayTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Tooltip text: prioritize text prop, fallback to content, message, or children
  const tooltipText = text || content || message || children || 'Tooltip text';

  // Button/trigger text: prioritize label (most common), fallback to buttonText, triggerText, or default
  const displayLabel = label || buttonText || triggerText || 'Hover me';

  const tooltipPosition = position || placement || 'top';

  const handleMouseEnter = () => {
    if (delay > 0) {
      const timeout = setTimeout(() => setVisible(true), delay);
      setDelayTimeout(timeout);
    } else {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (delayTimeout) {
      clearTimeout(delayTimeout);
      setDelayTimeout(null);
    }
    setVisible(false);
  };

  const variantClasses = {
    dark: 'bg-zinc-900 dark:bg-zinc-900 text-white border-zinc-800 dark:border-zinc-800',
    light: 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700',
    info: 'bg-orange-600 dark:bg-orange-600 text-white border-orange-700 dark:border-orange-700',
    success: 'bg-green-600 dark:bg-green-600 text-white border-green-700 dark:border-green-700',
    warning: 'bg-orange-600 dark:bg-orange-600 text-white border-orange-700 dark:border-orange-700',
    error: 'bg-red-600 dark:bg-red-600 text-white border-red-700 dark:border-red-700',
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent',
  };

  const arrowColorClasses = {
    dark: 'border-t-zinc-900 border-b-zinc-900 border-l-zinc-900 border-r-zinc-900',
    light: 'border-t-white border-b-white border-l-white border-r-white',
    info: 'border-t-orange-600 border-b-orange-600 border-l-orange-600 border-r-orange-600',
    success: 'border-t-green-600 border-b-green-600 border-l-green-600 border-r-green-600',
    warning: 'border-t-yellow-600 border-b-yellow-600 border-l-yellow-600 border-r-yellow-600',
    error: 'border-t-red-600 border-b-red-600 border-l-red-600 border-r-red-600',
  };

  return (
    <div className="inline-flex items-center justify-center my-4">
      <div className="relative inline-block">
        <button
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl cursor-pointer transition-all duration-300 ease-out font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {displayLabel}
        </button>

        {visible && (
          <div className={`absolute ${positionClasses[tooltipPosition]} z-[9999] whitespace-nowrap pointer-events-none`}>
            <div className={`px-3.5 py-2 text-sm rounded-lg border shadow-lg ${variantClasses[variant]}`}>
              {tooltipText}
              {arrow && (
                <div className={`absolute ${arrowClasses[tooltipPosition]} ${arrowColorClasses[variant]}`} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tooltip;

export const metadata = {
  name: 'tooltip',
  category: 'feedback' as const,
  component: Tooltip,
  description: 'Tooltip component that displays contextual information on hover. Attach to any element via label prop. Supports multiple positions, variants, and optional arrows.',
  tags: ['ui', 'feedback', 'tooltip', 'hint', 'popover', 'help'],
};
