import React from 'react';
import type { ComponentSpec } from '../core/types';

interface PaperProps {
  /** Content to display */
  content?: string;

  /** Elevation level (affects shadow depth) */
  elevation?: 0 | 1 | 2 | 3 | 4;

  /** Padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /** Border radius */
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';

  /** Background variant */
  variant?: 'default' | 'outlined' | 'filled';

  /** Optional children (for nested components) */
  children?: ComponentSpec[];

  /** Function to render child component specs */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Paper: React.FC<PaperProps> = ({
  content,
  elevation = 1,
  padding = 'medium',
  rounded = 'medium',
  variant = 'default',
  children,
  renderChild,
}) => {
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)]',
    2: 'shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.08)]',
    3: 'shadow-lg',
    4: 'shadow-xl',
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  };

  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-2xl',
    large: 'rounded-2xl',
    full: 'rounded-full',
  };

  const variantClasses = {
    default: 'card border border-zinc-200/60 dark:border-zinc-700/60',
    outlined: 'bg-transparent border-2 border-zinc-300/80 dark:border-zinc-600',
    filled: 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${elevationClasses[elevation]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
       
        transition-all duration-300 ease-out
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_24px_64px_rgba(0,0,0,0.12)]
      `}
    >
      {content && (
        <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {content}
        </div>
      )}

      {children && children.length > 0 && renderChild && (
        <div className="space-y-2">
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      )}

      {!content && (!children || children.length === 0) && (
        <div className="text-zinc-600 dark:text-zinc-400 text-sm text-center py-8">
          Empty paper surface
        </div>
      )}
    </div>
  );
};

export default Paper;

export const metadata = {
  name: 'paper',
  category: 'surfaces' as const,
  component: Paper,
  description: 'Material Design-inspired elevated surface with customizable shadow, padding, and styling',
  tags: ['paper', 'surface', 'card', 'container', 'elevation', 'material'],
  propTypes: {
    content: 'string - Text content to display',
    elevation: 'number - Shadow depth: 0, 1, 2, 3, 4 (default: 1)',
    padding: 'string - Padding size: none, small, medium, large (default: medium)',
    rounded: 'string - Border radius: none, small, medium, large, full (default: medium)',
    variant: 'string - Visual style: default, outlined, filled (default: default)',
    children: 'ReactNode - Optional nested components',
  },
};
