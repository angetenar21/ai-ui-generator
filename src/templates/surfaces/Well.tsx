import React from 'react';

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
  children?: React.ReactNode;
}

const Well: React.FC<WellProps> = ({
  content,
  size = 'medium',
  title,
  variant = 'default',
  children,
}) => {
  const sizeClasses = {
    small: 'p-4 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg',
  };

  const variantClasses = {
    default: 'bg-bg-sub border-border-main',
    info: 'bg-info/10 border-info/30',
    warning: 'bg-warning/10 border-warning/30',
    success: 'bg-success/10 border-success/30',
  };

  const variantTextClasses = {
    default: 'text-text-secondary',
    info: 'text-info',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        border rounded-lg my-2
        shadow-inner
      `}
    >
      {title && (
        <div className={`
          font-semibold mb-3 pb-2 border-b
          ${variant === 'default' ? 'text-text-primary border-border-main' : `${variantTextClasses[variant]} border-current/20`}
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

      {children && (
        <div className="space-y-2">
          {children}
        </div>
      )}

      {!content && !children && !title && (
        <div className="text-text-tertiary text-sm text-center py-2">
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
