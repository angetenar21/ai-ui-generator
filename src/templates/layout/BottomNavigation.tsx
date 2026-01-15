import React, { useState } from 'react';

interface NavigationItem {
  /** Label for the nav item */
  label: string;

  /** Icon for the nav item */
  icon?: string;

  /** Value identifier */
  value: string;

  /** Badge count */
  badge?: number;
}

interface BottomNavigationProps {
  /** Navigation items */
  items?: NavigationItem[];

  /** Default selected value */
  defaultValue?: string;

  /** Show labels */
  showLabels?: boolean;

  /** Variant style */
  variant?: 'default' | 'elevated';

  /** Color when active */
  activeColor?: 'primary' | 'accent' | 'secondary';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = [],
  defaultValue,
  showLabels = true,
  variant = 'default',
  activeColor = 'primary',
}) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || items[0]?.value
  );

  const variantClasses = {
    default: 'bg-bg-surface border-t border-border-primary',
    elevated: 'bg-bg-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]',
  };

  const activeColorClasses = {
    primary: 'text-primary-500',
    accent: 'text-accent-from',
    secondary: 'text-text-primary',
  };

  if (items.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-text-tertiary">
          Bottom Navigation - Add items to display
        </p>
      </div>
    );
  }

  return (
    <nav
      className={`${variantClasses[variant]} fixed bottom-0 left-0 right-0 z-40 h-16`}
    >
      <div className="flex items-center justify-around h-full max-w-screen-xl mx-auto px-4">
        {items.map((item) => {
          const isActive = selectedValue === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setSelectedValue(item.value)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors ${
                isActive
                  ? activeColorClasses[activeColor]
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <div className="relative">
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              {showLabels && (
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

export const metadata = {
  name: 'bottom-navigation',
  category: 'layout' as const,
  component: BottomNavigation,
  description: 'Bottom navigation bar for mobile-friendly navigation with icons and optional labels.',
  tags: ['layout', 'navigation', 'bottom-nav', 'mobile', 'footer'],
  propTypes: {
    items: 'NavigationItem[]',
    defaultValue: 'string',
    showLabels: 'boolean',
    variant: '"default" | "elevated"',
    activeColor: '"primary" | "accent" | "secondary"',
  },
};
