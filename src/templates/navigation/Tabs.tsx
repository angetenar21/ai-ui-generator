import React, { useState } from 'react';
import { RenderNode } from '../core/renderer';

interface Tab {
  label: string;
  value?: string;
  content?: string | any; // Allow ComponentSpec
  disabled?: boolean;
}

interface TabsProps {
  tabs?: Tab[];
  items?: Tab[];
  defaultTab?: string | number;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  items,
  defaultTab,
  variant = 'default',
  orientation = 'horizontal',
  children,
  renderChild,
}) => {
  const tabItems = tabs || items || [];

  const initialIndex = (() => {
    if (typeof defaultTab === 'number') return defaultTab;
    if (typeof defaultTab === 'string') {
      // Try numeric string first (e.g. defaultTab='0')
      const numericIndex = parseInt(defaultTab, 10);
      if (!isNaN(numericIndex) && numericIndex < tabItems.length) return numericIndex;
      // Try matching by value or label
      const found = tabItems.findIndex(t => t.value === defaultTab || t.label === defaultTab);
      if (found >= 0) return found;
    }
    return 0;
  })();

  // Hook must be declared unconditionally — before any early return
  const [activeTab, setActiveTab] = useState(Math.max(0, initialIndex));

  if (!tabItems || tabItems.length === 0) {
    return (
      <div className="card rounded-card p-6 my-4">
        <div className="text-center text-zinc-400">
          <p className="text-sm">No tabs provided</p>
        </div>
      </div>
    );
  }

  const variantClasses = {
    default: {
      container: 'border-b border-zinc-200 dark:border-zinc-700',
      tab: 'px-4 py-2.5 border-b-2 transition-colors font-medium text-sm',
      active: 'border-orange-500 text-orange-600 dark:text-orange-400',
      inactive: 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 hover:border-zinc-300',
    },
    pills: {
      container: 'bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-1',
      tab: 'px-4 py-2 rounded-lg transition-all font-medium text-sm',
      active: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm',
      inactive: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300',
    },
    underline: {
      container: 'gap-4',
      tab: 'px-2 py-2.5 border-b-2 transition-colors font-medium text-sm',
      active: 'border-orange-500 text-orange-600 dark:text-orange-400',
      inactive: 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300',
    },
  };

  const classes = variantClasses[variant] || variantClasses['default'];
  const isVertical = orientation === 'vertical';

  // Support both content in tab item AND content in children array (by index)
  const activeContent = tabItems[activeTab]?.content || (Array.isArray(children) ? children[activeTab] : null);

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

        {activeContent && (
          <div className={`${isVertical ? 'flex-1' : ''} mt-4 text-zinc-700 dark:text-zinc-300`}>
            {typeof activeContent === 'string'
              ? activeContent
              : renderChild
                ? renderChild(activeContent)
                : (activeContent && typeof activeContent === 'object' && !('$$typeof' in activeContent)
                  ? <RenderNode spec={activeContent} />
                  : activeContent)}
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
