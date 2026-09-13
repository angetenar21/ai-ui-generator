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
      <div className="card border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-4 my-2 shadow-sm">
        <div className="text-zinc-600 dark:text-zinc-400 text-sm">Widget requires a title</div>
      </div>
    );
  }

  const variantClasses = {
    default: 'card border border-zinc-200/60 dark:border-zinc-700/60 shadow-md hover:shadow-lg transition-all duration-300',
    compact: 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm hover:shadow-md transition-all duration-300',
    highlighted: 'bg-gradient-to-br from-orange-50 dark:from-orange-900/20 to-orange-100 dark:to-orange-900/20 border border-orange-200/60 dark:border-orange-700/60 shadow-md hover:shadow-lg transition-all duration-300',
  };

  const variantPadding = {
    default: 'p-6',
    compact: 'p-4',
    highlighted: 'p-6',
  };

  return (
    <div className={`${variantClasses[variant]} rounded-2xl my-2`}>
      {/* Header */}
      <div className={`
        flex items-center justify-between
        ${variantPadding[variant]}
        ${content || children ? 'border-b border-zinc-200/60 dark:border-zinc-700/60' : ''}
        rounded-t-2xl
        ${isCollapsed && !footer ? 'rounded-b-2xl border-b-0' : ''}
      `}>
        <h3 className="text-zinc-900 dark:text-white font-display font-semibold text-lg flex-1 tracking-tight">
          {title}
        </h3>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
              className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors rounded hover:bg-zinc-100 dark:bg-zinc-800"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {closeable && (
              <button
                onClick={() => setIsClosed(true)}
                className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-all duration-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
              <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
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
              <div className="text-zinc-600 dark:text-zinc-400 text-sm text-center py-4">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`
              ${variant === 'compact' ? 'px-4 py-2.5' : 'px-6 py-3'}
              border-t border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/80 dark:bg-zinc-800/30
              rounded-b-2xl
            `}>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm">
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
