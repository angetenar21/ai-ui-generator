import React from 'react';

const safeStr = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val.label) return String(val.label);
  try { return JSON.stringify(val); } catch { return '[value]'; }
};

type TimelineOrientation = 'vertical' | 'horizontal';
type TimelineAlign = 'left' | 'right' | 'alternate';
type ItemStatus = 'completed' | 'active' | 'pending' | 'error';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: string;
  status?: ItemStatus;
  content?: React.ReactNode;
}

interface TimelineProps {
  title?: string;
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  align?: TimelineAlign;
  showConnector?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({
  title,
  items,
  orientation = 'vertical',
  align = 'left',
  showConnector = true,
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  const statusStyles: Record<ItemStatus, { bg: string; border: string; text: string }> = {
    completed: {
      bg: 'bg-green-600',
      border: 'border-green-500',
      text: 'text-green-400',
    },
    active: {
      bg: 'bg-blue-600',
      border: 'border-blue-500',
      text: 'text-blue-400',
    },
    pending: {
      bg: 'bg-gray-600',
      border: 'border-gray-500',
      text: 'text-gray-400',
    },
    error: {
      bg: 'bg-red-600',
      border: 'border-red-500',
      text: 'text-red-400',
    },
  };

  const getItemAlign = (index: number): 'left' | 'right' => {
    if (align === 'alternate') {
      return index % 2 === 0 ? 'left' : 'right';
    }
    return align as 'left' | 'right';
  };

  // Safe status getter with fallback
  const getStatusStyles = (status?: ItemStatus) => {
    const validStatus = status && statusStyles[status] ? status : 'pending';
    return statusStyles[validStatus];
  };

  if (orientation === 'horizontal') {
    return (
      <div className="card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 my-4 overflow-x-auto">
        {title && (
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
            {title}
          </h3>
        )}
        <div className="flex items-start gap-0 min-w-max pb-4">
          {safeItems.map((item, index) => {
            const styles = getStatusStyles(item.status);

            return (
              <div key={item.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full
                      ${styles.bg}
                      flex items-center justify-center
                      text-gray-900 dark:text-white font-semibold
                      border-4 border-gray-900
                      shadow-lg
                    `}
                  >
                    {item.icon || index + 1}
                  </div>
                  <div className="mt-4 max-w-[200px]">
                    <div className="text-white font-medium text-sm mb-1">
                      {safeStr(item.title)}
                    </div>
                    {item.timestamp && (
                      <div className="text-xs text-gray-400 mb-1">
                        {safeStr(item.timestamp)}
                      </div>
                    )}
                    {item.description && (
                      <div className="text-xs text-gray-300 line-clamp-2">
                        {safeStr(item.description)}
                      </div>
                    )}
                    {item.content && (
                      <div className="mt-2">{item.content}</div>
                    )}
                  </div>
                </div>
                {showConnector && index < safeItems.length - 1 && (
                  <div className={`h-0.5 w-16 ${styles.bg} mx-2 mt-[-80px]`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className="card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 my-4">
      {title && (
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
      )}
      <div className="relative">
        {safeItems.map((item, index) => {
          const styles = getStatusStyles(item.status);
          const itemAlign = getItemAlign(index);
          const isLast = index === safeItems.length - 1;

          return (
            <div key={item.id} className="relative pb-8">
              {showConnector && !isLast && (
                <div
                  className={`
                    absolute top-10 ${align === 'alternate' ? 'left-1/2 -translate-x-1/2' : 'left-5'}
                    w-0.5 h-full ${styles.bg} opacity-30
                  `}
                />
              )}

              <div
                className={`
                  flex items-start gap-4
                  ${align === 'alternate' ? (itemAlign === 'right' ? 'flex-row-reverse' : '') : ''}
                `}
              >
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full
                    ${styles.bg}
                    flex items-center justify-center
                    text-gray-900 dark:text-white font-semibold text-sm
                    border-4 border-gray-900
                    shadow-lg
                    z-10
                    ${align === 'alternate' ? 'absolute left-1/2 -translate-x-1/2' : ''}
                  `}
                >
                  {item.icon || index + 1}
                </div>

                <div
                  className={`
                    flex-1 ${align === 'alternate' ? (itemAlign === 'right' ? 'text-right pl-8' : 'text-left pr-8 ml-14') : 'ml-0'}
                  `}
                >
                  <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors">
                    {item.timestamp && (
                      <div className={`text-xs ${styles.text} mb-2`}>
                        {safeStr(item.timestamp)}
                      </div>
                    )}
                    <div className="text-gray-900 dark:text-white font-semibold text-base mb-2">
                      {safeStr(item.title)}
                    </div>
                    {item.description && (
                      <div className="text-gray-600 dark:text-gray-300 text-sm">
                        {safeStr(item.description)}
                      </div>
                    )}
                    {item.content && (
                      <div className="mt-3 pt-3 border-t border-gray-700/50">
                        {item.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

export const metadata = {
  name: 'timeline',
  category: 'data-display' as const,
  component: Timeline,
  description: 'Vertical and horizontal timeline with status indicators',
  tags: ['timeline', 'chronological', 'history', 'steps', 'progress'],
  propTypes: {
    title: 'string',
    items: 'TimelineItem[]',
    orientation: "'vertical' | 'horizontal'",
    align: "'left' | 'right' | 'alternate'",
    showConnector: 'boolean',
  },
};
