import React, { useRef, useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import type { SurfaceVariant, ElevationLevel } from '../core/types';
import { useAppStore } from '@/store/appStore';

interface SparklineChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Data points */
  data: number[];

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Line color */
  color?: string;

  /** Show area under the line */
  area?: boolean;

  /** Show tooltip */
  showTooltip?: boolean;

  /** Curve type */
  curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step';

  /** Metric label (e.g., "Revenue") */
  metric?: string;

  /** Current value display */
  value?: string | number;

  /** Trend indicator (e.g., "+12%" or "-5%") */
  trend?: string;

  /** Trend is positive (green) or negative (red) */
  trendPositive?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  title,
  description,
  data,
  width = 400,
  height = 250,
  color,
  area = true,
  metric,
  value,
  trend,
  trendPositive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(width);

  // Detect dark mode
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Set default color based on dark mode if not provided
  const chartColor = color || (isDarkMode ? '#60A5FA' : '#3B82F6');
  const trendColor = trendPositive
    ? (isDarkMode ? '#10B981' : '#059669')
    : (isDarkMode ? '#EF4444' : '#DC2626');

  // Responsive sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const measuredWidth = rect.width - 32; // Account for padding
        setChartWidth(Math.max(250, measuredWidth));
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [width]);

  // Validate data
  const validData = Array.isArray(data)
    ? data.filter(d => typeof d === 'number' && !Number.isNaN(d))
    : [];

  if (!validData || validData.length === 0) {
    return (
      <div
        ref={containerRef}
        className="w-full bg-transparent dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px]"
      >
        {title && (
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h4>
        )}
        <div className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
          No data available
        </div>
      </div>
    );
  }

  const minValue = Math.min(...validData);
  const maxValue = Math.max(...validData);
  const xAxisData = Array.from({ length: validData.length }, (_, i) => i + 1);

  // Calculate proper Y-axis bounds with padding
  const yAxisMax = Math.ceil(maxValue * 1.1);
  const yAxisMin = Math.max(0, Math.floor(minValue * 0.9));

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-none dark:hover:shadow-lg transition-all duration-200"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        {title && (
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
            {title}
          </h4>
        )}

        {/* Value and Trend Row */}
        <div className="flex items-baseline gap-2">
          {value && (
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              {value}
            </span>
          )}
          {trend && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: trendColor, backgroundColor: trendPositive ? (isDarkMode ? '#064E3B' : '#ECFDF5') : (isDarkMode ? '#7F1D1D' : '#FEF2F2') }}>
              {trend}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}

        {metric && !title && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {metric}
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        {(() => {
          try {
            const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

            return (
              <LineChart
                xAxis={[{
                  data: xAxisData,
                  scaleType: 'linear' as const,
                }]}
                series={[{
                  data: validData,
                  label: metric || title || 'Value',
                  color: chartColor,
                  area: area,
                  curve: 'linear' as const,
                  showMark: false,
                }]}
                width={chartWidth}
                height={height}
                margin={{ top: 20, right: 20, bottom: 30, left: 60 }}
                yAxis={[{
                  min: yAxisMin,
                  max: yAxisMax,
                }]}
                sx={{
                  '& .MuiChartsAxis-line': {
                    stroke: isDark ? '#9CA3AF' : '#D1D5DB',
                    strokeWidth: 1,
                  },
                  '& .MuiChartsAxis-tick': {
                    stroke: isDark ? '#9CA3AF' : '#D1D5DB',
                    strokeWidth: 1,
                  },
                  '& .MuiChartsAxis-tickLabel': {
                    fill: isDark ? '#E5E7EB' : '#6B7280',
                      fontFamily: 'inherit',
                    fontSize: '11px',
                    fontWeight: 500,
                  },
                  '& .MuiChartsGrid-line': {
                    stroke: isDark ? '#374151' : '#E5E7EB',
                    opacity: 0.5,
                  },
                  '& .MuiAreaElement-root': {
                    fillOpacity: area ? 0.2 : 0,
                    fill: chartColor,
                  },
                  '& .MuiLineElement-root': {
                    strokeWidth: 2,
                    stroke: chartColor,
                  },
                }}
              />
            );
          } catch (error) {
            console.warn('[SparklineChart] Render error:', error);
            return (
              <div className="w-full h-[250px] flex items-center justify-center">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Unable to render chart</span>
              </div>
            );
          }
        })()}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-center">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Min</p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{minValue.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Max</p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{maxValue.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Avg</p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{(validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default SparklineChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'sparkline-chart',
  category: 'charts' as const,
  component: SparklineChart,
  description: 'Compact sparkline chart for displaying trends in small spaces with value, trend indicators, and stats',
  tags: ['chart', 'sparkline', 'mini', 'trend', 'compact', 'data-visualization', 'metric'],
  propTypes: {
    title: 'string - Chart title/metric name',
    description: 'string - Optional description text',
    data: 'number[] - Data points for the sparkline',
    width: 'number - Chart width (default: 120)',
    height: 'number - Chart height (default: 60)',
    color: 'string - Line color (auto dark/light aware if not provided)',
    area: 'boolean - Show area under line (default: true)',
    showTooltip: 'boolean - Show tooltip on hover (default: true)',
    curve: "'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step' - Curve type",
    metric: 'string - Metric label',
    value: 'string | number - Current value to display',
    trend: 'string - Trend text (e.g., "+12%")',
    trendPositive: 'boolean - Whether trend is positive (default: true)',
  },
};
