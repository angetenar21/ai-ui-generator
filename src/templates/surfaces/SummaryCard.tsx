import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getSurfaceClasses, getToneClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ToneVariant } from '../core/types';

const safeStr = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val.label) return String(val.label);
  try { return JSON.stringify(val); } catch { return '[value]'; }
};

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

    children?: React.ReactNode;
    renderChild?: (child: any) => React.ReactNode;
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
  const safeItems = Array.isArray(items) ? items : [];

  // Only the 'accent' surface variant has a dark/vivid emerald background.
  // Tone variants (success, error, etc.) use light pastel backgrounds — they need dark text.
  // If a tone is present, it overrides the variant's background, so we must ensure text is dark.
  // UPDATE: Accent is now a "Neon Glow" bordered style, so it also needs dark text in light mode.
  const isDarkSurface = false; // !tone && variant === 'accent';

  const getChangeIcon = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return <ArrowUp className="w-3.5 h-3.5 text-success" />;
      case 'negative':
        return <ArrowDown className="w-3.5 h-3.5 text-error" />;
      case 'neutral':
        return <Minus className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />;
      default:
        return null;
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'horizontal') {
      return 'flex flex-wrap gap-4 sm:gap-6';
    }
    if (layout === 'grid') {
      if (columns === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6';
      if (columns === 3) return 'grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6';
      if (columns === 4) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6';
      return 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6';
    }
    return 'flex flex-col gap-4';
  };

  // Only apply elevation shadow for surfaces that have an actual fill (accent, glass, gradient).
  // For transparent/default/elevated, shadow on a see-through card just creates a pale halo.
  const surfaceClasses = getSurfaceClasses(variant, elevation);
  const hasFill = !tone && (variant === 'accent' || variant === 'glass' || variant === 'gradient');
  const shadowlessClasses = surfaceClasses.replace(/shadow-\[[^\]]+\]/g, '').replace(/hover:shadow-\[[^\]]+\]/g, '');
  const cardClasses = tone
    ? getToneClasses(tone, emphasis)
    : (hasFill ? surfaceClasses : shadowlessClasses);

  return (
    <div className={`${cardClasses} rounded-2xl p-6 transition-all duration-300 h-full flex flex-col`}>
      {/* Header */}
      <div className={`mb-6 pb-4 border-b ${isDarkSurface ? 'border-white/20' : 'border-white/20 dark:border-white/[0.07]'}`}>
        <h3 className={`text-lg font-display font-bold mb-1 leading-snug ${isDarkSurface ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
          {title}
        </h3>
        {description && (
          <p className={`text-sm leading-relaxed ${isDarkSurface ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {description}
          </p>
        )}
      </div>

      {/* Summary Items */}
      <div className={`${getLayoutClasses()} mt-auto`}>
        {safeItems.map((item, index) => (
          <div
            key={index}
            className={`
              ${layout === 'horizontal' ? 'flex-1 min-w-[180px]' : ''}
              ${layout === 'grid' ? 'p-4 rounded-xl bg-white/[0.08] dark:bg-white/[0.03] border border-white/15 dark:border-white/[0.05] hover:scale-[1.02] transition-transform duration-200' : 'py-3'}
              group relative
            `}
          >
            {/* Subtle left accent bar for vertical/horizontal layouts */}
            {layout !== 'grid' && (
              <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-orange-400/60 to-pink-300/20 rounded-full" />
            )}
            <div className={`flex items-start justify-between ${layout !== 'grid' ? 'pl-3' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5 ${isDarkSurface ? 'text-white/50' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  <span className="truncate block">{safeStr(item.label)}</span>
                </div>
                <div className={`font-display font-black tracking-tight leading-none mb-1 transition-colors break-words min-w-0 ${
                  isDarkSurface
                    ? 'text-white'
                    : 'text-zinc-900 dark:text-white group-hover:text-orange-500'
                  } ${
                  // Semantic sizing: If the value looks like a KPI metric (mostly numbers/symbols like $1.2M, +12%, 1,400)
                  // make it large (3xl). If it's normal text (Role, URL, Name), make it readable (base/lg).
                  /^[\d.,$€£%+\-\sKkMmBb]+$/.test(String(safeStr(item.value)))
                    ? 'text-3xl' 
                    : 'text-base sm:text-lg !font-bold leading-tight'
                }`}>
                  {safeStr(item.value)}
                </div>
                {item.subtext && (
                  <div className={`text-xs mt-1.5 ${isDarkSurface ? 'text-white/50' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    {safeStr(item.subtext)}
                  </div>
                )}
              </div>

              {item.change && (
                <div className={`
                  flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0
                  ${item.changeType === 'positive' ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : ''}
                  ${item.changeType === 'negative' ? 'bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400' : ''}
                  ${item.changeType === 'neutral' || !item.changeType ? 'bg-zinc-500/10 dark:bg-white/[0.07] text-zinc-500 dark:text-zinc-400' : ''}
                `}>
                  {getChangeIcon(item.changeType)}
                  <span>{safeStr(item.change)}</span>
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
