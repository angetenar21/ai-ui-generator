import React, { useState } from 'react';
import type { ComponentSpec } from '../core/types';

interface DrawerProps {
  /** Title of the drawer */
  title?: string;

  /** Position of the drawer */
  position?: 'left' | 'right' | 'top' | 'bottom';

  /** Default open state */
  defaultOpen?: boolean;

  /** Width (for left/right) or height (for top/bottom) */
  size?: 'small' | 'medium' | 'large' | 'full';

  /** Variant style */
  variant?: 'default' | 'elevated' | 'overlay';

  /** Show backdrop */
  backdrop?: boolean;

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  title = 'Drawer',
  position = 'left',
  defaultOpen = false,
  size = 'medium',
  variant = 'default',
  backdrop = true,
  children,
  renderChild,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const sizeClasses = {
    left: {
      small: 'w-64',
      medium: 'w-80',
      large: 'w-96',
      full: 'w-full',
    },
    right: {
      small: 'w-64',
      medium: 'w-80',
      large: 'w-96',
      full: 'w-full',
    },
    top: {
      small: 'h-48',
      medium: 'h-64',
      large: 'h-96',
      full: 'h-full',
    },
    bottom: {
      small: 'h-48',
      medium: 'h-64',
      large: 'h-96',
      full: 'h-full',
    },
  };

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const transformClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  const variantClasses = {
    default: 'bg-bg-surface border-border-primary',
    elevated: 'bg-bg-surface shadow-2xl',
    overlay: 'bg-bg-surface/95 backdrop-blur-sm',
  };

  const borderClasses = {
    left: 'border-r',
    right: 'border-l',
    top: 'border-b',
    bottom: 'border-t',
  };

  return (
    <div className="relative">
      {/* Toggle Button for Demo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        {isOpen ? 'Close' : 'Open'} {position} Drawer
      </button>

      {/* Backdrop */}
      {backdrop && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed ${positionClasses[position]} ${sizeClasses[position][size]} ${variantClasses[variant]} ${borderClasses[position]} ${transformClasses[position]} transition-transform duration-300 z-50 overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {children && children.length > 0 && renderChild ? (
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={index}>{renderChild(child)}</div>
              ))}
            </div>
          ) : (
            <p className="text-text-tertiary text-center py-8">
              Drawer content - Add child components
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Drawer;

export const metadata = {
  name: 'drawer',
  category: 'layout' as const,
  component: Drawer,
  description: 'Side drawer/panel that slides in from any edge, with customizable size and optional backdrop.',
  tags: ['layout', 'navigation', 'drawer', 'panel', 'sidebar'],
  propTypes: {
    title: 'string',
    position: '"left" | "right" | "top" | "bottom"',
    defaultOpen: 'boolean',
    size: '"small" | "medium" | "large" | "full"',
    variant: '"default" | "elevated" | "overlay"',
    backdrop: 'boolean',
    children: 'ComponentSpec[]',
  },
};
