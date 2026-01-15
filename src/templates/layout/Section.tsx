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
    bordered: 'border border-border-primary rounded-card',
    elevated: 'shadow-lg rounded-card',
    filled: 'rounded-card',
  };

  const backgroundClasses = {
    default: '',
    surface: 'bg-bg-surface',
    elevated: 'bg-bg-elevated',
    accent: 'bg-primary-500/5',
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
                <span className="text-2xl text-primary-500">{icon}</span>
              )}
              <div className="flex-1">
                {title && (
                  <h2 className="text-2xl font-display font-bold text-text-primary">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-text-secondary mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </header>
          {divider && (
            <div className="h-px w-full bg-border-primary mb-6" />
          )}
        </>
      )}

      {children && children.length > 0 && renderChild ? (
        <div className="space-y-4">
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-tertiary">
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
    children: 'ComponentSpec[]',
  },
};
