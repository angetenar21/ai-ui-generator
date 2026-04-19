import React, { useRef, useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import type { SurfaceVariant, ElevationLevel } from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses } from '@/theme/designTokens';
import { getChartTheme, buildChartSx } from '../core/colorUtils';

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

  /** Stack areas (default: true for area charts) */
  stack?: boolean;

  /** Gradient opacity for area fills: [startOpacity, endOpacity] */
  gradientOpacity?: [number, number];

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

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  /** Object-array format: [{month: "Jan", revenue: 42000, expenses: 38000}, ...] */
  data?: Record<string, string | number>[];
  xKey?: string;
  seriesKeys?: string[];
}

const AreaChart: React.FC<AreaChartProps> = ({
  title,
  description,
  xAxis: xAxisProp,
  series: seriesProp,
  data: rawData,
  xKey,
  seriesKeys,
  width: propWidth,
  height: propHeight,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin,
  stack = true,
  gradientOpacity = [0.8, 0.2],
  variant = 'transparent',
  elevation = 'raised',
}) => {
  // Object-array → MUI format transformer
  let xAxis = xAxisProp;
  let series = seriesProp;
  if (rawData && Array.isArray(rawData) && rawData.length > 0 && xKey) {
    const categories = rawData.map(row => String(row[xKey] ?? ''));
    const numericKeys = seriesKeys
      ? seriesKeys
      : Object.keys(rawData[0]).filter(k => k !== xKey && typeof rawData[0][k] === 'number');
    xAxis = [{ data: categories, scaleType: 'band' as const }];
    series = numericKeys.map(key => ({
      label: key,
      data: rawData.map(row => (typeof row[key] === 'number' ? (row[key] as number) : 0)),
    }));
  }

  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const ct = getChartTheme(isDarkMode);
  const areaOpacity = isDarkMode ? 0.35 : 0.28;

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 500, height: propHeight ?? 320 });

  useEffect(() => {
    const updateWidth = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = propWidth || 360;

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = Math.max(200, maxWidth); // Enforce full responsive width, ignore AI-generated fixed widths
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
  // Ensure we have at least one numeric value that isn't 0
  const hasValidData = series && series.length > 0 && series.some(s =>
    s.data && s.data.length > 0 && s.data.some((val: any) => val !== 0 && val !== null)
  );

  if (!hasValidData) {
    console.warn('[AreaChart] No valid series data provided:', { series });
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-center items-center min-h-[300px] text-zinc-600 dark:text-zinc-300">
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

  // Transform series to include area property, default to smooth curves, and handle stacking
  const areaSeriesData = series.map((s) => ({
    ...s,
    label: s.label || (s as any).name || 'Series',
    area: true, // This makes it an area chart
    curve: s.curve || 'natural', // Default to smooth Bézier curves instead of linear
    stack: stack ? 'total' : undefined, // Stack all areas when enabled
    showMark: s.showMark !== false, // Show marks by default
  }));

  // Calculate Y-axis bounds for proper scaling with stacked data
  let maxStackedValue = 0;
  if (stack && series.length > 0) {
    const dataLength = series[0].data.length;
    for (let i = 0; i < dataLength; i++) {
      const sum = series.reduce((acc, s) => acc + (s.data[i] || 0), 0);
      maxStackedValue = Math.max(maxStackedValue, sum);
    }
  } else {
    maxStackedValue = Math.max(...series.flatMap(s => s.data || []));
  }
  const yAxisMax = Math.ceil(maxStackedValue * 1.1); // Add 10% padding at top



  const resolvedMargin = {
    top: margin?.top ?? (legend ? 60 : 40),
    right: margin?.right ?? 24,
    bottom: margin?.bottom ?? 40,
    left: margin?.left ?? 60,
  };

  return (
    <div className="w-full h-full max-w-full min-w-0 bg-transparent dark:bg-transparent rounded-xl p-4 shadow-none border border-white/25 dark:border-white/[0.07] overflow-x-auto flex flex-col">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3 px-1">
          {title && (
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
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
                  yAxis={[{ min: 0, max: yAxisMax }]}
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
                  sx={buildChartSx(ct, 0, {
                    '& .MuiLineElement-root': { strokeWidth: 2 },
                    '& .MuiAreaElement-root': { fillOpacity: areaOpacity, opacity: 1 },
                    '& .MuiAreaElement-root[data-series-id="0"]': { fillOpacity: gradientOpacity[0] },
                    '& .MuiAreaElement-root[data-series-id="1"]': { fillOpacity: Math.max(gradientOpacity[0] - 0.12, gradientOpacity[1]) },
                    '& .MuiAreaElement-root[data-series-id="2"]': { fillOpacity: Math.max(gradientOpacity[0] - 0.24, gradientOpacity[1]) },
                    '& .MuiAreaElement-root[data-series-id="3"]': { fillOpacity: Math.max(gradientOpacity[0] - 0.36, gradientOpacity[1]) },
                    '& .MuiAreaElement-root[data-series-id="4"]': { fillOpacity: Math.max(gradientOpacity[0] - 0.48, gradientOpacity[1]) },
                  })}
                />
              );
            } catch (error) {
              console.error('[AreaChart] Error rendering chart:', error);
              return (
                <div className="flex justify-center items-center min-h-[300px] text-zinc-500 dark:text-zinc-400">
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
