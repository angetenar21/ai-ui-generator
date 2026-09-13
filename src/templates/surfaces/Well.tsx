import React from 'react';
import type { ComponentSpec } from '../core/types';

interface WellProps {
  /** Content to display */
  content?: string;

  /** Well size */
  size?: 'small' | 'medium' | 'large';

  /** Optional title */
  title?: string;

  /** Visual variant */
  variant?: 'default' | 'info' | 'warning' | 'success';

  /** Optional children (for nested components) */
  children?: ComponentSpec[];

  /** Function to render child component specs */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Well: React.FC<WellProps> = ({
  content,
  size = 'medium',
  title,
  variant = 'default',
  children,
  renderChild,
}) => {
  const sizeClasses = {
    small: 'p-5 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg',
  };

  const variantClasses = {
    default: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
    info: 'bg-info/10 border-info/30',
    warning: 'bg-warning/10 border-warning/30',
    success: 'bg-success/10 border-success/30',
  };

  const variantTextClasses = {
    default: 'text-zinc-600 dark:text-zinc-300',
    info: 'text-info',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl
        shadow-inner
      `}
    >
      {title && (
        <div className={`
          font-semibold mb-3 pb-2 border-b
          ${variant === 'default' ? 'text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700' : `${variantTextClasses[variant]} border-current/20`}
        `}>
          {title}
        </div>
      )}

      {content && (
        <div className={`
          leading-relaxed
          ${variantTextClasses[variant]}
        `}>
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

      {!content && (!children || children.length === 0) && !title && (
        <div className="text-zinc-600 dark:text-zinc-400 text-sm text-center py-2">
          Empty well container
        </div>
      )}
    </div>
  );
};

export default Well;

export const metadata = {
  name: 'well',
  category: 'surfaces' as const,
  component: Well,
  description: 'Inset container with shadow-inner effect for displaying recessed content',
  tags: ['well', 'container', 'inset', 'recessed', 'box', 'panel'],
  propTypes: {
    content: 'string - Text content to display',
    size: 'string - Size variant: small, medium, large (default: medium)',
    title: 'string - Optional title displayed at the top',
    variant: 'string - Visual style: default, info, warning, success (default: default)',
    children: 'ReactNode - Optional nested components',
  },
};
