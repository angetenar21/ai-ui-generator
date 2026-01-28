import React from 'react';

interface BreadcrumbItem {
  /** Label for the breadcrumb */
  label: string;

  /** URL/path for the breadcrumb */
  href?: string;

  /** Icon for the breadcrumb */
  icon?: string;
}

interface BreadcrumbsProps {
  /** Array of breadcrumb items */
  items?: BreadcrumbItem[];

  /** Separator between breadcrumbs */
  separator?: 'slash' | 'chevron' | 'arrow' | 'dot';

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Maximum items to show before collapsing */
  maxItems?: number;

  /** Show home icon */
  showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  separator = 'chevron',
  size = 'medium',
  maxItems,
  showHome = false,
}) => {
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const separators = {
    slash: '/',
    chevron: '›',
    arrow: '→',
    dot: '•',
  };

  if (items.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Breadcrumbs - Add items to display</p>
      </div>
    );
  }

  let displayItems = [...items];

  // Handle max items with collapse
  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, { label: '...', href: undefined }, ...lastItems];
  }

  // Add home item if requested
  if (showHome && !items.some((item) => item.icon === '🏠')) {
    displayItems = [{ label: 'Home', icon: '🏠', href: '/' }, ...displayItems];
  }

  return (
    <nav aria-label="Breadcrumb" className={`${sizeClasses[size]}`}>
      <ol className="flex items-center flex-wrap gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCollapsed = item.label === '...';

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast && !isCollapsed ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className={`flex items-center gap-1.5 ${isLast
                      ? 'text-gray-900 dark:text-white font-medium'
                      : isCollapsed
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <span className="text-gray-600 dark:text-gray-400" aria-hidden="true">
                  {separators[separator]}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

export const metadata = {
  name: 'breadcrumbs',
  category: 'layout' as const,
  component: Breadcrumbs,
  description: 'Navigation breadcrumb trail showing the current location within a hierarchy, with customizable separators and collapse options.',
  tags: ['navigation', 'breadcrumbs', 'layout', 'hierarchy'],
  propTypes: {
    items: 'BreadcrumbItem[]',
    separator: '"slash" | "chevron" | "arrow" | "dot"',
    size: '"small" | "medium" | "large"',
    maxItems: 'number',
    showHome: 'boolean',
  },
};
