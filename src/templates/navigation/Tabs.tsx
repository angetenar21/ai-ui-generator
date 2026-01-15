import React, { useState } from 'react';

interface Tab {
  label: string;
  value?: string;
  content?: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs?: Tab[];
  items?: Tab[];
  defaultTab?: string | number;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  items,
  defaultTab,
  variant = 'default',
  orientation = 'horizontal',
}) => {
  const tabItems = tabs || items || [];

  if (!tabItems || tabItems.length === 0) {
    return (
      <div className="card rounded-card p-6 my-4">
        <div className="text-center text-gray-400">
          <p className="text-sm">No tabs provided</p>
        </div>
      </div>
    );
  }

  const initialIndex = typeof defaultTab === 'number'
    ? defaultTab
    : tabItems.findIndex(t => t.value === defaultTab || t.label === defaultTab);

  const [activeTab, setActiveTab] = useState(Math.max(0, initialIndex));

  const variantClasses = {
    default: {
      container: 'border-b border-gray-700',
      tab: 'px-4 py-2 border-b-2 transition-colors',
      active: 'border-blue-500 text-blue-400',
      inactive: 'border-transparent text-gray-400 hover:text-gray-300',
    },
    pills: {
      container: 'bg-gray-800/50 rounded-lg p-1',
      tab: 'px-4 py-2 rounded-md transition-colors',
      active: 'bg-blue-600 text-white',
      inactive: 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50',
    },
    underline: {
      container: 'gap-4',
      tab: 'px-2 py-2 border-b-2 transition-colors',
      active: 'border-blue-500 text-blue-400',
      inactive: 'border-transparent text-gray-400 hover:text-gray-300',
    },
  };

  const classes = variantClasses[variant];
  const isVertical = orientation === 'vertical';

  return (
    <div className="card rounded-card p-6 my-4">
      <div className={`flex ${isVertical ? 'flex-row gap-6' : 'flex-col'}`}>
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} ${classes.container}`}>
          {tabItems.map((tab, index) => (
            <button
              key={index}
              className={`
                ${classes.tab}
                ${activeTab === index ? classes.active : classes.inactive}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `.trim().replace(/\s+/g, ' ')}
              onClick={() => !tab.disabled && setActiveTab(index)}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabItems[activeTab]?.content && (
          <div className={`${isVertical ? 'flex-1' : ''} mt-4 text-gray-300`}>
            {tabItems[activeTab].content}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;

export const metadata = {
  name: 'tabs',
  category: 'navigation' as const,
  component: Tabs,
  description: 'Tabbed navigation component with multiple variants and orientation support',
  tags: ['ui', 'navigation', 'interactive'],
};
