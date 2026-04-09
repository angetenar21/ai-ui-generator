import React, { useState } from 'react';
import type { ComponentSpec } from '../core/types';

interface NavItem {
  /** Label for the nav item */
  label: string;

  /** Icon for the nav item */
  icon?: string;

  /** URL/path */
  href?: string;

  /** Active state */
  active?: boolean;

  /** Badge count */
  badge?: number;

  /** Nested items */
  children?: NavItem[];
}

interface SidebarProps {
  /** Title of the sidebar */
  title?: string;

  /** Logo/icon */
  logo?: string;

  /** Navigation items */
  items?: NavItem[];

  /** Width */
  width?: 'small' | 'medium' | 'large';

  /** Collapsible sidebar */
  collapsible?: boolean;

  /** Default collapsed state */
  defaultCollapsed?: boolean;

  /** Variant style */
  variant?: 'default' | 'elevated' | 'bordered';

  /** Position */
  position?: 'fixed' | 'sticky' | 'static';

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  title = 'Navigation',
  logo,
  items = [],
  width = 'medium',
  collapsible = false,
  defaultCollapsed = false,
  variant = 'default',
  position = 'static',
  children,
  renderChild,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const widthClasses = {
    small: isCollapsed ? 'w-16' : 'w-56',
    medium: isCollapsed ? 'w-16' : 'w-64',
    large: isCollapsed ? 'w-16' : 'w-72',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800',
    elevated: 'bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-xl',
    bordered: 'bg-white dark:bg-zinc-900 border-r-2 border-indigo-600',
  };

  const positionClasses = {
    fixed: 'fixed left-0 top-0 bottom-0 z-40',
    sticky: 'sticky top-0 h-screen',
    static: 'relative',
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderNavItem = (item: NavItem, index: number, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(index);

    return (
      <div key={index}>
        <button
          onClick={() => hasChildren && toggleExpanded(index)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${item.active
            ? 'bg-indigo-600 text-white shadow-sm font-medium'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
            } ${depth > 0 ? 'pl-8' : ''}`}
        >
          {item.icon && (
            <span className={isCollapsed ? 'text-xl' : 'text-lg'}>
              {item.icon}
            </span>
          )}
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </>
          )}
        </button>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child, childIndex) =>
              renderNavItem(child, index * 1000 + childIndex, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`${positionClasses[position]} ${widthClasses[width]} ${variantClasses[variant]} transition-all duration-300 overflow-y-auto min-h-screen flex-shrink-0`}
    >
      <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            {logo && <span className="text-2xl">{logo}</span>}
            <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white">{title}</h2>
          </div>
        )}
        {logo && isCollapsed && <span className="text-2xl mx-auto">{logo}</span>}
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors p-1"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      <nav className="p-4 space-y-1">
        {items.map((item, index) => renderNavItem(item, index))}
      </nav>

      {Array.isArray(children) && children.length > 0 && renderChild && !isCollapsed && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={index}>{renderChild(child)}</div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

export const metadata = {
  name: 'sidebar',
  category: 'layout' as const,
  component: Sidebar,
  description: 'Sidebar navigation with nested items, badges, icons, and collapsible functionality.',
  tags: ['layout', 'navigation', 'sidebar', 'menu', 'nav'],
  propTypes: {
    title: 'string',
    logo: 'string',
    items: 'NavItem[]',
    width: '"small" | "medium" | "large"',
    collapsible: 'boolean',
    defaultCollapsed: 'boolean',
    variant: '"default" | "elevated" | "bordered"',
    position: '"fixed" | "sticky" | "static"',
    children: 'ComponentSpec[]',
  },
};
