import React from 'react';
import { getSurfaceClasses } from '@/theme/designTokens';
import { getTextColorForBackground, getSecondaryTextColorForBackground } from '../core/colorUtils';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel } from '../core/types';

interface BulletChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Target value to achieve */
  target?: number;

  /** Current actual value */
  value: number;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Qualitative ranges for context (e.g., poor, satisfactory, good) */
  ranges?: Array<{
    value: number;
    color?: string;
    label?: string;
  }>;

  /** Comparative measure (e.g., previous period) */
  comparative?: number;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Unit label (e.g., "%", "K", "M") */
  unit?: string;

  /** Card background color */
  cardBackgroundColor?: string;

  /** Surface variant for visual hierarchy */
  variant?: SurfaceVariant;

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Visual emphasis level */
  emphasis?: EmphasisLevel;

  /** Show value labels */
  showLabels?: boolean;
}

const BulletChart: React.FC<BulletChartProps> = ({
  title,
  description,
  target,
  value,
  min = 0,
  max = 100,
  ranges = [],
  comparative,
  width,
  height = 100,
  unit = '',
  cardBackgroundColor,
  variant = 'default',
  elevation = 'raised',
  emphasis: _emphasis = 'medium',
  showLabels = true,
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.max(min, Math.min(max, value || 0));
  const clampedTarget = target !== undefined && target !== null ? Math.max(min, Math.min(max, target)) : undefined;
  const clampedComparative = comparative !== undefined && comparative !== null ? Math.max(min, Math.min(max, comparative)) : undefined;

  // Calculate percentages for positioning
  const valuePercent = max > min ? ((clampedValue - min) / (max - min)) * 100 : 0;
  const targetPercent = clampedTarget !== undefined && max > min ? ((clampedTarget - min) / (max - min)) * 100 : undefined;
  const comparativePercent = clampedComparative !== undefined && max > min ? ((clampedComparative - min) / (max - min)) * 100 : undefined;

  // Default ranges if none provided
  const defaultRanges = ranges.length > 0 ? ranges : [
    { value: max * 0.6, color: '#EF4444', label: 'Poor' },
    { value: max * 0.8, color: '#F59E0B', label: 'Satisfactory' },
    { value: max, color: '#22C55E', label: 'Good' },
  ];

  // Sort ranges by value
  const sortedRanges = [...defaultRanges].sort((a, b) => a.value - b.value);

  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Get surface classes
  const surfaceClasses = getSurfaceClasses(variant, elevation);
  const bgColor = cardBackgroundColor || (isDarkMode ? '#1F2937' : '#FFFFFF');
  const textColor = getTextColorForBackground(bgColor);
  const secondaryTextColor = getSecondaryTextColorForBackground(bgColor);

  // Main value bar color
  const valueColor = isDarkMode ? '#3B82F6' : '#2563EB';

  return (
    <div className={`${surfaceClasses} p-6 rounded-xl`} style={{ width: width || '100%', minWidth: '400px' }}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: secondaryTextColor }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Bullet Chart */}
      <div style={{ minHeight: `${height + 40}px` }} className="flex flex-col justify-center">
        {/* Value display */}
        {showLabels && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" style={{ color: textColor }}>
                {clampedValue.toLocaleString()}{unit}
              </span>
              {clampedTarget && (
                <span className="text-base font-medium" style={{ color: secondaryTextColor }}>
                  Target: {clampedTarget.toLocaleString()}{unit}
                </span>
              )}
            </div>
            {clampedComparative && (
              <div className="text-sm" style={{ color: secondaryTextColor }}>
                Previous: {clampedComparative.toLocaleString()}{unit}
              </div>
            )}
          </div>
        )}

        {/* Chart visualization */}
        <div className="relative" style={{ height: '70px' }}>
          {/* Qualitative ranges background */}
          <div className="absolute inset-0 flex rounded-lg overflow-hidden">
            {sortedRanges.map((range, index) => {
              const prevValue = index > 0 ? sortedRanges[index - 1].value : min;
              const rangeStart = ((prevValue - min) / (max - min)) * 100;
              const rangeWidth = ((range.value - prevValue) / (max - min)) * 100;

              return (
                <div
                  key={index}
                  className="h-full opacity-25"
                  style={{
                    width: `${rangeWidth}%`,
                    backgroundColor: range.color || '#6B7280',
                    marginLeft: index === 0 ? `${rangeStart}%` : '0',
                  }}
                  title={range.label}
                />
              );
            })}
          </div>

          {/* Main value bar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-10 rounded-lg transition-all duration-300"
            style={{
              width: `${valuePercent}%`,
              backgroundColor: valueColor,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
            }}
          />

          {/* Comparative marker */}
          {comparativePercent !== undefined && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-16 rounded-sm"
              style={{
                left: `${comparativePercent}%`,
                width: '3px',
                backgroundColor: '#F59E0B',
                boxShadow: '0 0 8px rgba(245, 158, 11, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
              title={`Previous: ${clampedComparative}${unit}`}
            />
          )}

          {/* Target marker */}
          {targetPercent !== undefined && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-full rounded-sm"
              style={{
                left: `${targetPercent}%`,
                width: '3px',
                backgroundColor: isDarkMode ? '#F3F4F6' : '#1F2937',
                boxShadow: isDarkMode
                  ? '0 0 8px rgba(243, 244, 246, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)'
                  : '0 0 8px rgba(31, 41, 55, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
              title={`Target: ${clampedTarget}${unit}`}
            />
          )}
        </div>

        {/* Scale labels */}
        {showLabels && (
          <div className="flex justify-between mt-4 text-sm font-medium" style={{ color: secondaryTextColor }}>
            <span>{min.toLocaleString()}{unit}</span>
            <span>{Math.round((max - min) / 2 + min).toLocaleString()}{unit}</span>
            <span>{max.toLocaleString()}{unit}</span>
          </div>
        )}

        {/* Legend */}
        {showLabels && (
          <div className="flex flex-wrap gap-6 mt-5 text-sm" style={{ color: secondaryTextColor }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded" style={{ backgroundColor: valueColor }} />
              <span className="font-medium">Actual</span>
            </div>
            {clampedTarget !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: isDarkMode ? '#F3F4F6' : '#1F2937' }} />
                <span className="font-medium">Target</span>
              </div>
            )}
            {clampedComparative !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: '#F59E0B' }} />
                <span className="font-medium">Previous</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletChart;

export const metadata = {
  name: 'bullet-chart',
  category: 'charts' as const,
  component: BulletChart,
  description: 'Bullet chart for displaying performance metrics against targets and ranges',
  tags: ['chart', 'bullet', 'kpi', 'performance', 'target', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    target: 'number',
    value: 'number',
    min: 'number',
    max: 'number',
    ranges: 'Array<{ value: number, color?: string, label?: string }>',
    comparative: 'number',
    width: 'number',
    height: 'number',
    unit: 'string',
    cardBackgroundColor: 'string',
    variant: 'SurfaceVariant',
    elevation: 'ElevationLevel',
    emphasis: 'EmphasisLevel',
    showLabels: 'boolean',
  },
};
