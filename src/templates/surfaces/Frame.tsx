import React from 'react';
import type { ComponentSpec } from '../core/types';

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
  children?: ComponentSpec[];

  /** Function to render child component specs */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Frame: React.FC<FrameProps> = ({
  title,
  content,
  borderStyle = 'solid',
  borderWidth = 'normal',
  padding = 'medium',
  background = 'dark',
  children,
  renderChild,
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
    transparent: 'bg-transparent border-zinc-700/50',
    dark: 'card border border-zinc-200 dark:border-zinc-700',
    light: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
    gradient: 'bg-gradient-to-br from-bg-main to-bg-sub border-zinc-700/50',
  };

  return (
    <div
      className={`
        ${backgroundClasses[background]}
        ${borderStyleClasses[borderStyle]}
        ${borderWidthClasses[borderWidth]}
        ${paddingClasses[padding]}
        rounded-lg
        transition-all
      `}
    >
      {title && (
        <div className="text-zinc-900 dark:text-white font-semibold text-lg mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-700">
          {title}
        </div>
      )}

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

      {!content && (!children || children.length === 0) && !title && (
        <div className="text-zinc-600 dark:text-zinc-400 text-sm text-center py-4">
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
