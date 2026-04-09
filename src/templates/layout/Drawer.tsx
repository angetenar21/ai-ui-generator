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

  /** Text for a button that opens the drawer */
  triggerText?: string;

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
  triggerText,
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
    left: isOpen ? 'tranzinc-x-0' : '-tranzinc-x-full',
    right: isOpen ? 'tranzinc-x-0' : 'tranzinc-x-full',
    top: isOpen ? 'tranzinc-y-0' : '-tranzinc-y-full',
    bottom: isOpen ? 'tranzinc-y-0' : 'tranzinc-y-full',
  };

  const variantClasses = {
    default: 'bg-zinc-50 dark:bg-zinc-700 border-indigo-600',
    elevated: 'bg-zinc-50 dark:bg-zinc-700 shadow-2xl',
    overlay: 'bg-zinc-50 dark:bg-zinc-700/95 backdrop-blur-sm',
  };

  const borderClasses = {
    left: 'border-r',
    right: 'border-l',
    top: 'border-b',
    bottom: 'border-t',
  };

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      {triggerText && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium border border-transparent shadow-[0_2px_4px_rgba(234,88,12,0.15)]"
        >
          {triggerText}
        </button>
      )}

      {/* Default Fallback Toggle Button */}
      {!triggerText && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors border border-zinc-300 dark:border-zinc-600 shadow-sm"
        >
          {isOpen ? 'Close' : 'Open'} {position} Drawer
        </button>
      )}

      {/* Backdrop */}
      {backdrop && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed ${positionClasses[position]} ${sizeClasses[position][size]} ${variantClasses[variant]} ${borderClasses[position]} ${transformClasses[position]} transition-transform duration-300 z-[9999] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors p-1"
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
          {Array.isArray(children) && children.length > 0 && renderChild ? (
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={index}>{renderChild(child)}</div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
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
