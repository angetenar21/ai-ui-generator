import React from 'react';

interface SpacerProps {
  /** Size of the spacer */
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'custom';

  /** Custom size in pixels (when size is 'custom') */
  customSize?: number;

  /** Orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Flexible spacer (grows to fill available space) */
  flexible?: boolean;

  /** Show visual indicator (for debugging/demo) */
  showIndicator?: boolean;
}

const Spacer: React.FC<SpacerProps> = ({
  size = 'medium',
  customSize,
  orientation = 'vertical',
  flexible = false,
  showIndicator = false,
}) => {
  const sizeClasses = {
    vertical: {
      xs: 'h-1',
      small: 'h-2',
      medium: 'h-4',
      large: 'h-6',
      xl: 'h-8',
      '2xl': 'h-12',
      '3xl': 'h-16',
      custom: '',
    },
    horizontal: {
      xs: 'w-1',
      small: 'w-2',
      medium: 'w-4',
      large: 'w-6',
      xl: 'w-8',
      '2xl': 'w-12',
      '3xl': 'w-16',
      custom: '',
    },
  };

  const flexibleClass = flexible
    ? orientation === 'vertical'
      ? 'flex-1'
      : 'flex-1 w-full'
    : '';

  const orientationClass = orientation === 'vertical' ? 'w-full' : 'h-full';

  const style =
    size === 'custom' && customSize
      ? orientation === 'vertical'
        ? { height: `${customSize}px` }
        : { width: `${customSize}px` }
      : undefined;

  if (showIndicator) {
    return (
      <div
        className={`${sizeClasses[orientation][size]} ${orientationClass} ${flexibleClass} border-2 border-dashed border-border-primary rounded flex items-center justify-center`}
        style={style}
      >
        <span className="text-xs text-text-tertiary font-mono">
          {flexible
            ? 'flex'
            : size === 'custom'
            ? `${customSize}px`
            : size}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[orientation][size]} ${orientationClass} ${flexibleClass}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Spacer;

export const metadata = {
  name: 'spacer',
  category: 'layout' as const,
  component: Spacer,
  description: 'Flexible spacing component for adding vertical or horizontal space between elements, with optional visual indicators.',
  tags: ['layout', 'spacer', 'spacing', 'margin', 'padding'],
  propTypes: {
    size: '"xs" | "small" | "medium" | "large" | "xl" | "2xl" | "3xl" | "custom"',
    customSize: 'number',
    orientation: '"horizontal" | "vertical"',
    flexible: 'boolean',
    showIndicator: 'boolean',
  },
};
