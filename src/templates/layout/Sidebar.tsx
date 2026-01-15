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
    small: isCollapsed ? 'w-16' : 'w-48',
    medium: isCollapsed ? 'w-16' : 'w-64',
    large: isCollapsed ? 'w-16' : 'w-80',
  };

  const variantClasses = {
    default: 'bg-bg-surface',
    elevated: 'bg-bg-surface shadow-lg',
    bordered: 'bg-bg-surface border-r border-border-primary',
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
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            item.active
              ? 'bg-primary-500/10 text-primary-500'
              : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
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
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
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
      className={`${positionClasses[position]} ${widthClasses[width]} ${variantClasses[variant]} transition-all duration-300 overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            {logo && <span className="text-2xl">{logo}</span>}
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          </div>
        )}
        {logo && isCollapsed && <span className="text-2xl mx-auto">{logo}</span>}
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
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

      <nav className="p-3 space-y-1">
        {items.map((item, index) => renderNavItem(item, index))}
      </nav>

      {children && children.length > 0 && renderChild && !isCollapsed && (
        <div className="p-4 border-t border-border-primary">
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
