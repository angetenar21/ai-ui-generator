import React from 'react';
import type { ComponentSpec } from '../core/types';

interface ContainerProps {
  /** Maximum width of the container */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

  /** Padding inside the container */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /** Center the container horizontally */
  center?: boolean;

  /** Add background */
  background?: boolean;

  /** Add border */
  border?: boolean;

  /** Add shadow */
  shadow?: boolean;

  /** Vertical spacing between children */
  spacing?: 'none' | 'small' | 'medium' | 'large';

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  padding = 'medium',
  center = true,
  background = false,
  border = false,
  shadow = false,
  spacing = 'medium',
  children,
  renderChild,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'px-4 py-4 sm:px-6',
    medium: 'px-6 py-6 sm:px-8',
    large: 'px-8 py-8 sm:px-10',
  };

  const centerClass = center ? 'mx-auto' : '';
  const backgroundClass = background ? 'bg-white dark:bg-zinc-900' : '';
  const borderClass = border ? 'border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl' : '';
  const shadowClass = shadow ? 'shadow-lg shadow-zinc-900/5' : '';

  return (
    <div
      className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${centerClass} ${backgroundClass} ${borderClass} ${shadowClass} w-full overflow-visible`}
    >
      {Array.isArray(children) && children.length > 0 && renderChild ? (
        <div className={spacing === 'none' ? '' : 'space-y-4'}>
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400">
            Container (max-width: {maxWidth}) - Add child components
          </p>
        </div>
      )}
    </div>
  );
};

export default Container;

export const metadata = {
  name: 'container',
  category: 'layout' as const,
  component: Container,
  description: 'Centered container with configurable max-width, padding, and optional background/border/shadow styling.',
  tags: ['layout', 'container', 'wrapper', 'responsive'],
  propTypes: {
    maxWidth: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"',
    padding: '"none" | "small" | "medium" | "large"',
    center: 'boolean',
    background: 'boolean',
    border: 'boolean',
    shadow: 'boolean',
    spacing: '"none" | "small" | "medium" | "large"',
    children: 'ComponentSpec[]',
  },
};
