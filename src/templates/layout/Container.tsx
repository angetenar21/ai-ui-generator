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
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const centerClass = center ? 'mx-auto' : '';
  const backgroundClass = background ? 'bg-bg-surface' : '';
  const borderClass = border ? 'border border-border-primary rounded-card' : '';
  const shadowClass = shadow ? 'shadow-lg' : '';

  return (
    <div
      className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${centerClass} ${backgroundClass} ${borderClass} ${shadowClass} w-full`}
    >
      {children && children.length > 0 && renderChild ? (
        <div className="space-y-4">
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-tertiary">
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
    children: 'ComponentSpec[]',
  },
};
