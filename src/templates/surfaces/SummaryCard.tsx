import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getSurfaceClasses, getToneClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ToneVariant } from '../core/types';

interface SummaryCardProps {
  /** Card title */
  title: string;

  /** Optional description */
  description?: string;

  /** Summary items */
  items: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    subtext?: string;
  }>;

  /** Layout orientation */
  layout?: 'vertical' | 'horizontal' | 'grid';

  /** Number of columns for grid layout */
  columns?: 2 | 3 | 4;

  /** Surface variant for visual hierarchy */
  variant?: SurfaceVariant;

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Visual emphasis level */
  emphasis?: EmphasisLevel;

  /** Semantic tone */
  tone?: ToneVariant;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  description,
  items,
  layout = 'vertical',
  columns = 3,
  variant = 'default',
  elevation = 'raised',
  emphasis = 'medium',
  tone,
}) => {
  const getChangeIcon = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return <ArrowUp className="w-3.5 h-3.5 text-success" />;
      case 'negative':
        return <ArrowDown className="w-3.5 h-3.5 text-error" />;
      case 'neutral':
        return <Minus className="w-3.5 h-3.5 text-text-tertiary" />;
      default:
        return null;
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'horizontal') {
      return 'flex flex-wrap gap-6';
    }
    if (layout === 'grid') {
      return `grid grid-cols-${columns} gap-6`;
    }
    return 'flex flex-col gap-4';
  };

  // Build classes using design tokens
  const surfaceClasses = tone
    ? getToneClasses(tone, emphasis)
    : getSurfaceClasses(variant, elevation);

  return (
    <div className={`${surfaceClasses} rounded-xl p-6 my-1 transition-all duration-300`}>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </div>

      {/* Summary Items */}
      <div className={getLayoutClasses()}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              ${layout === 'horizontal' ? 'flex-1 min-w-[200px]' : ''}
              ${layout === 'grid' ? '' : 'py-3'}
              group
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-2">
                  {item.label}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                  {item.value}
                </div>
                {item.subtext && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.subtext}
                  </div>
                )}
              </div>

              {item.change && (
                <div className={`
                  flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                  ${item.changeType === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : ''}
                  ${item.changeType === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
                  ${item.changeType === 'neutral' ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : ''}
                `}>
                  {getChangeIcon(item.changeType)}
                  <span>{item.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;

// Component metadata for auto-registration
export const metadata = {
  name: 'summary-card',
  category: 'surfaces' as const,
  component: SummaryCard,
  description: 'Card component for displaying multiple summary metrics in various layouts. Supports visual variants, elevation, emphasis, and semantic tones.',
  tags: ['card', 'summary', 'metrics', 'kpi', 'dashboard'],
  propTypes: {
    title: 'string (required)',
    description: 'string',
    items: 'Array<{ label, value, change?, changeType?, subtext? }> (required)',
    layout: '"vertical" | "horizontal" | "grid"',
    columns: '2 | 3 | 4',
    variant: 'SurfaceVariant - Visual style: default | gradient | accent | glass | elevated | subtle (default: default)',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    emphasis: 'EmphasisLevel - Visual emphasis: low | medium | high (default: medium)',
    tone: 'ToneVariant - Semantic tone: neutral | primary | accent | success | warning | error | info',
  },
  examples: [
    {
      name: 'Service health summary',
      props: {
        title: 'Service Health Overview',
        description: 'Last 24 hours',
        layout: 'grid',
        columns: 3,
        items: [
          {
            label: 'Total Requests',
            value: '1.2M',
            change: '+15%',
            changeType: 'positive',
            subtext: 'vs. yesterday',
          },
          {
            label: 'Avg Response Time',
            value: '45ms',
            change: '-8ms',
            changeType: 'positive',
            subtext: '18% faster',
          },
          {
            label: 'Error Rate',
            value: '0.02%',
            change: '+0.01%',
            changeType: 'negative',
            subtext: '24 errors',
          },
        ],
      },
    },
  ],
};
