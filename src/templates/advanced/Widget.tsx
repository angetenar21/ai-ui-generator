import React from 'react';
import { MoreVertical, Maximize2, Minimize2, X } from 'lucide-react';

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
  children?: React.ReactNode;
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
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isClosed, setIsClosed] = React.useState(false);

  if (isClosed) return null;

  if (!title) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-lg p-4 my-2">
        <div className="text-text-tertiary text-sm">Widget requires a title</div>
      </div>
    );
  }

  const variantClasses = {
    default: 'glass-dark border-gray-700/50',
    compact: 'bg-bg-sub border-border-main',
    highlighted: 'bg-gradient-to-br from-primary-500/10 to-accent-cyan/10 border-primary-500/30',
  };

  const variantPadding = {
    default: 'p-6',
    compact: 'p-4',
    highlighted: 'p-6',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-lg my-2 overflow-hidden`}>
      {/* Header */}
      <div className={`
        flex items-center justify-between
        ${variantPadding[variant]}
        ${content || children ? 'border-b border-border-main' : ''}
      `}>
        <h3 className="text-text-primary font-semibold text-lg flex-1">
          {title}
        </h3>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-text-tertiary hover:text-text-primary transition-colors rounded hover:bg-bg-sub"
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
              className="p-1 text-text-tertiary hover:text-text-primary transition-colors rounded hover:bg-bg-sub"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {closeable && (
              <button
                onClick={() => setIsClosed(true)}
                className="p-1 text-text-tertiary hover:text-error transition-colors rounded hover:bg-bg-sub"
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
              <div className="text-text-secondary leading-relaxed">
                {content}
              </div>
            )}

            {children && (
              <div className="space-y-2">
                {children}
              </div>
            )}

            {!content && !children && (
              <div className="text-text-tertiary text-sm text-center py-4">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`
              ${variant === 'compact' ? 'px-4 py-2' : 'px-6 py-3'}
              border-t border-border-main bg-bg-sub/30
            `}>
              <div className="text-text-tertiary text-sm">
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
