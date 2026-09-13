import React from 'react';
import type { ComponentSpec } from '../core/types';

interface ActionButton {
  /** Label for the action */
  label: string;

  /** Icon for the action */
  icon?: string;

  /** Click handler */
  onClick?: () => void;
}

interface AppBarProps {
  /** Title text */
  title?: string;

  /** Subtitle text */
  subtitle?: string;

  /** Logo/icon */
  logo?: string;

  /** Action buttons */
  actions?: ActionButton[];

  /** Position */
  position?: 'static' | 'fixed' | 'sticky';

  /** Variant style */
  variant?: 'default' | 'elevated' | 'transparent';

  /** Size */
  size?: 'small' | 'medium' | 'large';

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const AppBar: React.FC<AppBarProps> = ({
  title = 'Application',
  subtitle,
  logo,
  actions = [],
  position = 'static',
  variant = 'default',
  size = 'medium',
  children,
  renderChild,
}) => {
  const positionClasses = {
    static: 'relative w-full rounded-2xl',
    fixed: 'relative w-full rounded-2xl z-50 overflow-hidden',
    sticky: 'relative w-full rounded-2xl z-40 overflow-hidden',
  };

  const variantClasses = {
    default: 'backdrop-blur-lg bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/60 dark:border-zinc-700/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
    elevated: 'backdrop-blur-lg bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5',
    transparent: 'bg-transparent',
  };

  const sizeClasses = {
    small: 'h-12 px-4',
    medium: 'h-16 px-6',
    large: 'h-20 px-8',
  };

  return (
    <header
      className={`${positionClasses[position]} ${variantClasses[variant]} ${sizeClasses[size]} flex items-center justify-between`}
    >
      <div className="flex items-center gap-4">
        {logo && <span className="text-2xl">{logo}</span>}
        <div>
          <h1 className="text-zinc-900 dark:text-white font-display font-bold text-lg tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      {Array.isArray(children) && children.length > 0 && renderChild ? (
        <div className="flex items-center gap-3">
          {children.map((child, index) => (
            <div key={index}>{renderChild(child)}</div>
          ))}
        </div>
      ) : actions.length > 0 ? (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-out text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 font-medium"
            >
              {action.icon && <span>{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
};

export default AppBar;

export const metadata = {
  name: 'appbar',
  category: 'layout' as const,
  component: AppBar,
  description: 'Top application bar with title, subtitle, logo, and customizable action buttons.',
  tags: ['layout', 'navigation', 'appbar', 'header', 'toolbar'],
  propTypes: {
    title: 'string',
    subtitle: 'string',
    logo: 'string',
    actions: 'ActionButton[]',
    position: '"static" | "fixed" | "sticky"',
    variant: '"default" | "elevated" | "transparent"',
    size: '"small" | "medium" | "large"',
    children: 'ComponentSpec[]',
  },
};
