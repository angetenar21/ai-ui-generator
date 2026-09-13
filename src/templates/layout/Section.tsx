import React from 'react';
import type { ComponentSpec } from '../core/types';

interface SectionProps {
  /** Section title */
  title?: string;

  /** Section subtitle */
  subtitle?: string;

  /** Section header icon */
  icon?: string;

  /** Padding inside the section */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /** Variant style */
  variant?: 'default' | 'bordered' | 'elevated' | 'filled';

  /** Background color */
  background?: 'default' | 'surface' | 'elevated' | 'accent';

  /** Show divider after header */
  divider?: boolean;

  /** Full width section */
  fullWidth?: boolean;

  /** Vertical spacing between children */
  spacing?: 'none' | 'small' | 'medium' | 'large';

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  icon,
  padding = 'medium',
  variant = 'default',
  background = 'default',
  divider = false,
  fullWidth = true,
  spacing = 'medium',
  children,
  renderChild,
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const variantClasses = {
    default: '',
    bordered: 'border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl',
    elevated: 'shadow-lg shadow-zinc-900/5 rounded-2xl',
    filled: 'rounded-2xl',
  };

  const backgroundClasses = {
    default: '',
    surface: 'bg-white dark:bg-zinc-800',
    elevated: 'bg-zinc-50 dark:bg-zinc-800',
    accent: 'bg-orange-50 dark:bg-orange-900/10',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <section
      className={`${paddingClasses[padding]} ${variantClasses[variant]} ${backgroundClasses[background]} ${widthClass}`}
    >
      {(title || subtitle || icon) && (
        <>
          <header className={padding !== 'none' ? 'mb-6' : ''}>
            <div className="flex items-center gap-3">
              {icon && (
                <span className="text-2xl text-orange-600">{icon}</span>
              )}
              <div className="flex-1">
                {title && (
                  <h2 className="text-2xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-zinc-600 dark:text-zinc-300 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </header>
          {divider && (
            <div className="h-px w-full bg-border-primary mb-6" />
          )}
        </>
      )}

      {Array.isArray(children) && children.length > 0 && renderChild ? (
        <div className={spacing === 'none' ? '' : 'space-y-4'}>
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400">
            Section content - Add child components
          </p>
        </div>
      )}
    </section>
  );
};

export default Section;

export const metadata = {
  name: 'section',
  category: 'layout' as const,
  component: Section,
  description: 'Content section with optional header, title, subtitle, and customizable styling for organizing page content.',
  tags: ['layout', 'section', 'container', 'content'],
  propTypes: {
    title: 'string',
    subtitle: 'string',
    icon: 'string',
    padding: '"none" | "small" | "medium" | "large"',
    variant: '"default" | "bordered" | "elevated" | "filled"',
    background: '"default" | "surface" | "elevated" | "accent"',
    divider: 'boolean',
    fullWidth: 'boolean',
    spacing: '"none" | "small" | "medium" | "large"',
    children: 'ComponentSpec[]',
  },
};
