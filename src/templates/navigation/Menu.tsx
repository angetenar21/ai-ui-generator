import React, { useState } from 'react';

interface MenuItem {
  label: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

interface MenuProps {
  items?: MenuItem[];
  menuItems?: MenuItem[];
  title?: string;
  trigger?: string;
  triggerVariant?: 'primary' | 'secondary' | 'ghost';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  closeOnSelect?: boolean;
  variant?: 'default' | 'compact' | 'bordered';
}

const Menu: React.FC<MenuProps> = ({
  items,
  menuItems,
  title,
  trigger,
  triggerVariant = 'secondary',
  position = 'bottom-left',
  closeOnSelect = true,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItemsList = items || menuItems || [];

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      if (item.onClick) item.onClick();
      if (closeOnSelect) setIsOpen(false);
    }
  };

  const handleToggle = () => setIsOpen(!isOpen);

  if (!menuItemsList || menuItemsList.length === 0) {
    return (
      <div className="card rounded-card p-6 my-4">
        <div className="text-center text-gray-400">
          <p className="text-sm">No menu items provided</p>
        </div>
      </div>
    );
  }

  const variantClasses = {
    default: 'card rounded-card p-2',
    compact: 'card rounded-card p-1',
    bordered: 'card rounded-card p-2 border-2 border-gray-700',
  };

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
  };

  const triggerVariantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300',
  };

  // Always render as dropdown menu with a button
  const buttonLabel = trigger || title || 'Menu';

  return (
    <div className="relative inline-block my-4">
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg ${triggerVariantClasses[triggerVariant]}`}
      >
        {buttonLabel}
        <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className={`absolute ${positionClasses[position]} z-50 min-w-[200px] shadow-xl`}>
            <div className={variantClasses[variant]}>
              {title && trigger && (
                <div className="px-3 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-700">
                  {title}
                </div>
              )}
              <div className="space-y-1 py-1">
                {menuItemsList.map((item, index) => {
                  if (item.divider) {
                    return <div key={index} className="border-t border-gray-700 my-1" />;
                  }

                  return (
                    <button
                      key={index}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg
                        flex items-center gap-3
                        transition-colors
                        ${item.disabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : item.variant === 'danger'
                            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white cursor-pointer'
                        }
                      `.trim().replace(/\s+/g, ' ')}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                    >
                      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                      <span className="flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;

export const metadata = {
  name: 'menu',
  category: 'navigation' as const,
  component: Menu,
  description: 'Menu component with dropdown support. Use trigger prop for dropdown menus. Supports icons, dividers, danger variants, and multiple positions.',
  tags: ['ui', 'navigation', 'interactive', 'dropdown', 'menu', 'actions'],
};
