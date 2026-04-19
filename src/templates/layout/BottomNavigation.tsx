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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = [],
  defaultValue,
  showLabels = true,
  variant = 'default',
  activeColor = 'primary',
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || safeItems[0]?.value
  );

  const variantClasses = {
    default: 'backdrop-blur-lg bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-200/60 dark:border-zinc-700/50',
    elevated: 'backdrop-blur-lg bg-white/80 dark:bg-zinc-900/80 shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.08)]',
  };

  const activeColorClasses = {
    primary: 'text-orange-500',
    accent: 'text-accent-from',
    secondary: 'text-zinc-900 dark:text-white',
  };

  if (safeItems.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          Bottom Navigation - Add items to display
        </p>
      </div>
    );
  }

  return (
    <nav
      className={`${variantClasses[variant]} relative w-full rounded-2xl z-40 h-16 border`}
    >
      <div className="flex items-center justify-around h-full max-w-screen-xl mx-auto px-4">
        {safeItems.map((item) => {
          const isActive = selectedValue === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setSelectedValue(item.value)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all duration-300 ease-out ${isActive
                  ? activeColorClasses[activeColor]
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
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
                  className={`text-[10px] font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-60'
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
