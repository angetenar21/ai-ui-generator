import React, { useRef, useState, useEffect } from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

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
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  title,
  description,
  data,
  width = 120,
  height = 60,
  color,
  area = true,
  showTooltip = true,
  metric,
  value,
  trend,
  trendPositive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Set default color based on dark mode if not provided
  const chartColor = color || (isDarkMode ? '#60A5FA' : '#3B82F6');
  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
  const trendColor = trendPositive
    ? (isDarkMode ? '#10B981' : '#059669')
    : (isDarkMode ? '#EF4444' : '#DC2626');

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, rect.width - 16),
          height,
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [width, height]);

  // Validate data
  const validData = Array.isArray(data)
    ? data.filter(d => typeof d === 'number' && !Number.isNaN(d))
    : [];

  if (!validData || validData.length === 0) {
    return (
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 inline-flex flex-col items-center justify-center min-w-[180px]"
      >
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h4>
        )}
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          No data available
        </div>
      </div>
    );
  }

  const minValue = Math.min(...validData);
  const maxValue = Math.max(...validData);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 inline-block"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-3">
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {title}
          </h4>
        )}

        {/* Value and Trend Row */}
        <div className="flex items-baseline gap-2">
          {value && (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
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
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        {metric && !title && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {metric}
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="flex justify-center items-center">
        {(() => {
          try {
            return (
              <SparkLineChart
                data={validData}
                width={Math.max(100, dimensions.width - 24)}
                height={dimensions.height}
                color={chartColor}
                area={area}
                showTooltip={showTooltip}
                plotType="line"
                margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
                sx={{
                  '& .MuiSparkLineChart-root': {
                    fontFamily: 'inherit',
                  },
                  '& .MuiLineElement-root': {
                    strokeWidth: 1.5,
                    stroke: chartColor,
                  },
                  '& .MuiAreaElement-root': {
                    fillOpacity: area ? 0.25 : 0,
                    fill: chartColor,
                  },
                  '& .MuiTooltip-root': {
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: textColor,
                  },
                }}
              />
            );
          } catch (error) {
            console.warn('[SparklineChart] Render error:', error);
            return (
              <div className="w-full h-[60px] flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Unable to render</span>
              </div>
            );
          }
        })()}
      </div>

      {/* Footer Stats (optional) */}
      {(minValue !== undefined || maxValue !== undefined) && (
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Low: {minValue.toFixed(1)}</span>
          <span>High: {maxValue.toFixed(1)}</span>
        </div>
      )}
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
