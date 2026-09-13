import React, { useState } from 'react';
import type { ComponentSpec } from '../core/types';

interface AccordionItem {
  /** Title of the accordion item */
  title: string;

  /** Content or children of the accordion item */
  content?: string;

  /** Whether this item is initially expanded */
  defaultExpanded?: boolean;

  /** Icon to display (optional) */
  icon?: string;

  /** Children components */
  children?: ComponentSpec[];
}

interface AccordionProps {
  /** Accordion items */
  items?: AccordionItem[];

  /** Allow multiple items to be expanded at once */
  multiple?: boolean;

  /** Variant style */
  variant?: 'default' | 'bordered' | 'elevated';

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  items = [],
  multiple = false,
  variant = 'default',
  size = 'medium',
  renderChild,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set(
      (Array.isArray(items) ? items : [])
        .map((item, index) => (item.defaultExpanded ? index : -1))
        .filter((index) => index !== -1)
    )
  );

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!multiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  const variantClasses = {
    default: 'bg-zinc-50 dark:bg-zinc-700',
    bordered: 'bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600',
    elevated: 'bg-zinc-50 dark:bg-zinc-700 shadow-md',
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Accordion - Add items to display</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${sizeClasses[size]}`}>
      {safeItems.map((item, index) => {
        const isExpanded = expandedItems.has(index);

        return (
          <div
            key={index}
            className={`${variantClasses[variant]} rounded-card overflow-hidden transition-all`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <span className="text-zinc-600 dark:text-zinc-400 text-xl">{item.icon}</span>
                )}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-zinc-600 dark:text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''
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
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-600 overflow-visible">
                {item.content && (
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                    {item.content}
                  </p>
                )}
                {Array.isArray(item.children) && item.children.length > 0 && renderChild && (
                  <div className="space-y-3 mt-3 overflow-visible">
                    {item.children.map((child, childIndex) => (
                      <div key={childIndex}>{renderChild(child)}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

export const metadata = {
  name: 'accordion',
  category: 'layout' as const,
  component: Accordion,
  description: 'Expandable accordion component with customizable items, icons, and support for single or multiple expanded sections.',
  tags: ['layout', 'accordion', 'expandable', 'collapsible'],
  propTypes: {
    items: 'AccordionItem[]',
    multiple: 'boolean',
    variant: '"default" | "bordered" | "elevated"',
    size: '"small" | "medium" | "large"',
  },
};
