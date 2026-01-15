import React from 'react';

interface FrameProps {
  /** Frame title */
  title?: string;

  /** Content to display inside the frame */
  content?: string;

  /** Border style */
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

  /** Border width */
  borderWidth?: 'thin' | 'normal' | 'thick';

  /** Padding size */
  padding?: 'small' | 'medium' | 'large';

  /** Background variant */
  background?: 'transparent' | 'dark' | 'light' | 'gradient';

  /** Optional children (for nested components) */
  children?: React.ReactNode;
}

const Frame: React.FC<FrameProps> = ({
  title,
  content,
  borderStyle = 'solid',
  borderWidth = 'normal',
  padding = 'medium',
  background = 'dark',
  children,
}) => {
  const borderStyleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
    none: 'border-none',
  };

  const borderWidthClasses = {
    thin: 'border',
    normal: 'border-2',
    thick: 'border-4',
  };

  const paddingClasses = {
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  };

  const backgroundClasses = {
    transparent: 'bg-transparent border-gray-700/50',
    dark: 'glass-dark border-gray-700/50',
    light: 'bg-bg-sub border-border-main',
    gradient: 'bg-gradient-to-br from-bg-main to-bg-sub border-gray-700/50',
  };

  return (
    <div
      className={`
        ${backgroundClasses[background]}
        ${borderStyleClasses[borderStyle]}
        ${borderWidthClasses[borderWidth]}
        ${paddingClasses[padding]}
        rounded-lg my-2
        transition-all
      `}
    >
      {title && (
        <div className="text-text-primary font-semibold text-lg mb-4 pb-3 border-b border-border-main">
          {title}
        </div>
      )}

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

      {!content && !children && !title && (
        <div className="text-text-tertiary text-sm text-center py-4">
          Empty frame container
        </div>
      )}
    </div>
  );
};

export default Frame;

export const metadata = {
  name: 'frame',
  category: 'surfaces' as const,
  component: Frame,
  description: 'Customizable frame container with various border styles, padding, and background options',
  tags: ['frame', 'container', 'border', 'box', 'wrapper', 'panel'],
  propTypes: {
    title: 'string - Optional title displayed at the top of the frame',
    content: 'string - Text content to display inside the frame',
    borderStyle: 'string - Border style: solid, dashed, dotted, double, none (default: solid)',
    borderWidth: 'string - Border width: thin, normal, thick (default: normal)',
    padding: 'string - Padding size: small, medium, large (default: medium)',
    background: 'string - Background variant: transparent, dark, light, gradient (default: dark)',
    children: 'ReactNode - Optional nested components',
  },
};
