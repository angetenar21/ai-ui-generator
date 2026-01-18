import React, { useRef, useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

interface AreaChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** X-axis data points */
  xAxis?: Array<{
    data: (number | string | Date)[];
    label?: string;
    scaleType?: 'band' | 'linear' | 'log' | 'time';
  }>;

  /** Series data for the areas */
  series: Array<{
    data: number[];
    label?: string;
    color?: string;
    stack?: string;
    curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step';
    showMark?: boolean;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show grid lines */
  grid?: {
    vertical?: boolean;
    horizontal?: boolean;
  };

  /** Show legend */
  legend?: boolean;

  /** Margin around chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const AreaChart: React.FC<AreaChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width: propWidth,
  height: propHeight,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 500, height: propHeight ?? 320 });

  useEffect(() => {
    const updateWidth = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = propWidth || 360;

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = propWidth ? Math.min(propWidth, maxWidth) : maxWidth;
      }

      const minWidth = typeof maxWidth === 'number' ? Math.min(260, maxWidth) : 260;
      const maxWidthClamp = typeof maxWidth === 'number' ? maxWidth : 1400;
      const width = Math.max(minWidth, Math.min(nextWidth, maxWidthClamp));

      const autoHeight = Math.max(240, Math.min(420, width * 0.6));
      const legendOffset = legend ? 40 : 0;
      const height = propHeight ?? autoHeight + legendOffset;

      setChartSize({ width, height });
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [propWidth]);

  // Validation and error handling
  if (!series || series.length === 0 || !series[0].data || series[0].data.length === 0) {
    console.warn('[AreaChart] No valid series data provided:', { series });
    return (
      <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-center items-center min-h-[300px] text-text-secondary">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No data available</div>
          </div>
        </div>
      </div>
    );
  }

  // Fix xAxis format for MUI X Charts
  let processedXAxis: Array<{
    data: (number | string | Date)[];
    label?: string;
    scaleType: 'band' | 'linear' | 'log' | 'time' | 'utc' | 'point' | 'sqrt' | 'symlog';
  }>;

  if (xAxis && xAxis.length > 0) {
    processedXAxis = xAxis.map(axis => {
      const hasStringData = axis.data && axis.data.some(val => typeof val === 'string');
      const scaleType = axis.scaleType || (hasStringData ? 'point' : 'linear');
      return {
        ...axis,
        scaleType: scaleType as 'band' | 'linear' | 'log' | 'time' | 'utc' | 'point' | 'sqrt' | 'symlog'
      };
    });
  } else {
    // Create default x-axis if none provided
    const dataLength = series[0].data.length;
    processedXAxis = [{
      data: Array.from({ length: dataLength }, (_, i) => i),
      scaleType: 'linear' as const
    }];
  }

  // Transform series to include area property and handle both 'label' and 'name' fields
  const areaSeriesData = series.map((s) => ({
    ...s,
    label: s.label || (s as any).name || 'Series',
    area: true, // This makes it an area chart
  }));

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartColors = {
    axisLine: isDarkMode ? '#6B7280' : '#9CA3AF',
    axisTick: isDarkMode ? '#6B7280' : '#9CA3AF',
    tickLabel: isDarkMode ? '#E5E7EB' : '#1F2937',
    legendText: isDarkMode ? '#E5E7EB' : '#1F2937',
    gridLine: isDarkMode ? '#374151' : '#E5E7EB',
    areaOpacity: isDarkMode ? 0.35 : 0.28,
  };

  const resolvedMargin = {
    top: margin?.top ?? (legend ? 56 : 32),
    right: margin?.right ?? 20,
    bottom: margin?.bottom ?? 36,
    left: margin?.left ?? 20,
  };

  return (
    <div className="w-full h-full max-w-full bg-white dark:bg-gray-900 rounded-xl p-4 my-2 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3 px-1">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div ref={containerRef} className="w-full flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex justify-center items-center min-h-[260px]">
          {(() => {
            try {
              return (
                <LineChart
                  xAxis={processedXAxis}
                  series={areaSeriesData}
                  width={chartSize.width}
                  height={chartSize.height}
                  grid={grid}
                  margin={resolvedMargin}
                  slotProps={{
                    legend: legend
                      ? {
                        direction: 'horizontal' as const,
                        position: { vertical: 'top', horizontal: 'center' } as const,
                      }
                      : undefined,
                  }}
                  sx={{
                    '& .MuiChartsAxis-line': {
                      stroke: chartColors.axisLine,
                      strokeWidth: 1.5,
                    },
                    '& .MuiChartsAxis-tick': {
                      stroke: chartColors.axisTick,
                      strokeWidth: 1,
                    },
                    '& .MuiChartsAxis-tickLabel': {
                      fill: chartColors.tickLabel,
                      fontSize: '13px',
                      fontWeight: 500,
                    },
                    '& .MuiLineElement-root': {
                      strokeWidth: 2,
                    },
                    '& .MuiChartsLegend-root': {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                    },
                    '& .MuiChartsLegend-series': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    },
                    '& .MuiChartsLegend-series text': {
                      fill: `${chartColors.legendText} !important`,
                      fontSize: '12px',
                      fontWeight: 500,
                    },
                    '& .MuiChartsLegend-mark': {
                      rx: 2,
                      width: '12px',
                      height: '12px',
                    },
                    '& .MuiChartsGrid-line': {
                      stroke: chartColors.gridLine,
                      strokeDasharray: '4 4',
                      opacity: 0.8,
                    },
                    '& .MuiAreaElement-root': {
                      fillOpacity: chartColors.areaOpacity,
                    },
                  }}
                />
              );
            } catch (error) {
              console.error('[AreaChart] Error rendering chart:', error);
              return (
                <div className="flex justify-center items-center min-h-[300px] text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚠️</div>
                    <div>Error rendering chart</div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default AreaChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'area-chart',
  category: 'charts' as const,
  component: AreaChart,
  description: 'Area chart for visualizing cumulative data and trends over time with filled regions',
  tags: ['chart', 'area', 'trend', 'cumulative', 'stacked', 'data-visualization'],
  propTypes: {
    title: 'string',
    xAxis: 'Array<{ data, label?, scaleType? }>',
    series: 'Array<{ data, label?, color?, stack?, curve?, showMark? }>',
    width: 'number',
    height: 'number',
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
