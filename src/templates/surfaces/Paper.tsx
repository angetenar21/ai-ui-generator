import React from 'react';

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
  children?: React.ReactNode;
}

const Paper: React.FC<PaperProps> = ({
  content,
  elevation = 1,
  padding = 'medium',
  rounded = 'medium',
  variant = 'default',
  children,
}) => {
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow-md',
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
    medium: 'rounded-lg',
    large: 'rounded-xl',
    full: 'rounded-full',
  };

  const variantClasses = {
    default: 'glass-dark border-0',
    outlined: 'bg-transparent border-2 border-gray-600/50',
    filled: 'bg-bg-sub border border-border-main',
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${elevationClasses[elevation]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        my-1
        transition-all duration-200
        hover:shadow-2xl
      `}
    >
      {content && (
        <div className="text-text-secondary leading-relaxed">
          {content}
        </div>
      )}

      {children && (
        <div className="space-y-2">
          {children}
        </div>
      )}

      {!content && !children && (
        <div className="text-text-tertiary text-sm text-center py-8">
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
