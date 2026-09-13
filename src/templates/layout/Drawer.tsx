import React, { useState } from 'react';
import type { ComponentSpec } from '../core/types';
import DummyAppBackground from '../../components/DummyAppBackground';

interface DrawerProps {
  title?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  defaultOpen?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
  variant?: 'default' | 'elevated' | 'overlay';
  backdrop?: boolean;
  triggerText?: string;
  children?: ComponentSpec[];
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
    left: { small: 'w-64', medium: 'w-80', large: 'w-96', full: 'w-full' },
    right: { small: 'w-64', medium: 'w-80', large: 'w-96', full: 'w-full' },
    top: { small: 'h-48', medium: 'h-64', large: 'h-96', full: 'h-full' },
    bottom: { small: 'h-48', medium: 'h-64', large: 'h-96', full: 'h-full' },
  };

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const roundedClasses = {
    left: 'rounded-r-2xl',
    right: 'rounded-l-2xl',
    top: 'rounded-b-2xl',
    bottom: 'rounded-t-2xl',
  };

  const transformClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-700/50',
    elevated: 'bg-white dark:bg-zinc-900 shadow-2xl',
    overlay: 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg',
  };

  const borderClasses = {
    left: 'border-r',
    right: 'border-l',
    top: 'border-b',
    bottom: 'border-t',
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800 min-h-[500px]">
      
      {/* Dummy UI overlay for Drawer preview context - ALWAYS PRESENT */}
      <DummyAppBackground />

      {/* Trigger Button - Centered inside Dummy UI */}
      {!isOpen && triggerText && (
        <div className="absolute inset-0 flex items-center justify-center z-[10]">
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium border border-orange-500 shadow-lg active:scale-95"
          >
            {triggerText}
          </button>
        </div>
      )}

      {/* Default Fallback Toggle Button */}
      {!isOpen && !triggerText && (
        <div className="absolute inset-0 flex items-center justify-center z-[10]">
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all border border-zinc-300 dark:border-zinc-600 shadow-lg active:scale-95"
          >
            Open {position} Drawer
          </button>
        </div>
      )}

      {/* Backdrop */}
      {backdrop && isOpen && (
        <div
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-out rounded-2xl"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`absolute ${positionClasses[position]} ${sizeClasses[position][size]} ${variantClasses[variant]} ${borderClasses[position]} ${roundedClasses[position]} ${transformClasses[position]} shadow-2xl transition-transform duration-300 ease-out z-[9999] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200/60 dark:border-zinc-700/50">
          <h2 className="text-lg font-display font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 ease-out rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2"
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
