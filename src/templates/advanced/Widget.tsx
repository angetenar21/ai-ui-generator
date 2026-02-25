import React from 'react';
import { MoreVertical, Maximize2, Minimize2, X } from 'lucide-react';
import type { ComponentSpec } from '../core/types';

interface WidgetProps {
  /** Widget title */
  title: string;

  /** Widget content */
  content?: string;

  /** Widget type/variant */
  variant?: 'default' | 'compact' | 'highlighted';

  /** Footer content */
  footer?: string;

  /** Show header actions */
  showActions?: boolean;

  /** Allow collapse/expand */
  collapsible?: boolean;

  /** Default collapsed state */
  defaultCollapsed?: boolean;

  /** Show close button */
  closeable?: boolean;

  /** Optional children (for nested components) */
  children?: ComponentSpec[];

  /** Function to render child component specs */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  content,
  variant = 'default',
  footer,
  showActions = true,
  collapsible = false,
  defaultCollapsed = false,
  closeable = false,
  children,
  renderChild,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isClosed, setIsClosed] = React.useState(false);

  if (isClosed) return null;

  if (!title) {
    return (
      <div className="card border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-2">
        <div className="text-gray-600 dark:text-gray-400 text-sm">Widget requires a title</div>
      </div>
    );
  }

  const variantClasses = {
    default: 'card border border-gray-200 dark:border-gray-700',
    compact: 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    highlighted: 'bg-gradient-to-br from-orange-100 dark:from-orange-900/20 to-teal-100 dark:to-teal-900/20 border border-orange-300 dark:border-orange-700',
  };

  const variantPadding = {
    default: 'p-6',
    compact: 'p-4',
    highlighted: 'p-6',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-lg my-2`}>
      {/* Header */}
      <div className={`
        flex items-center justify-between
        ${variantPadding[variant]}
        ${content || children ? 'border-b border-gray-200 dark:border-gray-700' : ''}
        rounded-t-lg
        ${isCollapsed && !footer ? 'rounded-b-lg border-b-0' : ''}
      `}>
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg flex-1">
          {title}
        </h3>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors rounded hover:bg-gray-100 dark:bg-gray-800"
                title={isCollapsed ? 'Expand' : 'Collapse'}
              >
                {isCollapsed ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors rounded hover:bg-gray-100 dark:bg-gray-800"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {closeable && (
              <button
                onClick={() => setIsClosed(true)}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-gray-100 dark:bg-gray-800"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          <div className={variantPadding[variant]}>
            {content && (
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                {content}
              </div>
            )}

            {Array.isArray(children) && children.length > 0 && renderChild && (
              <div className="space-y-2 mt-2">
                {children.map((child, index) => (
                  <div key={index}>{renderChild(child)}</div>
                ))}
              </div>
            )}

            {!content && (!children || children.length === 0) && (
              <div className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`
              ${variant === 'compact' ? 'px-4 py-2' : 'px-6 py-3'}
              border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/30
              rounded-b-lg
            `}>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {footer}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Widget;

export const metadata = {
  name: 'widget',
  category: 'advanced' as const,
  component: Widget,
  description: 'Versatile widget container with header, content, footer, and interactive controls',
  tags: ['widget', 'container', 'panel', 'card', 'module', 'component'],
  propTypes: {
    title: 'string (required) - Widget title',
    content: 'string - Main content text',
    variant: 'string - Visual style: default, compact, highlighted (default: default)',
    footer: 'string - Optional footer content',
    showActions: 'boolean - Show header action buttons (default: true)',
    collapsible: 'boolean - Allow collapse/expand (default: false)',
    defaultCollapsed: 'boolean - Start collapsed (default: false)',
    closeable: 'boolean - Show close button (default: false)',
    children: 'ReactNode - Optional nested components',
  },
};
