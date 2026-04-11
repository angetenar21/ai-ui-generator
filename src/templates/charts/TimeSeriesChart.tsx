import React, { useEffect, useRef, useState } from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { getSurfaceClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel } from '../core/types';

interface TimeSeriesChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Series data with time-based data points - supports multiple formats */
  series: Array<{
    name?: string;
    label?: string;
    color?: string;
    data: Array<[number | string, number]> | Array<{
      x: number | string; y: number
      children?: React.ReactNode;
      renderChild?: (child: any) => React.ReactNode;
    }> | Array<{ date: string; value: number }> | Array<{ month: string; value: number }> | number[];
  }>;

  /** X-axis configuration */
  xAxis?: {
    type?: 'time' | 'category';
    data?: (string | number | Date)[];
    label?: string;
  };

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

  /** Show area fill under the line */
  area?: boolean;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  description,
  series,
  xAxis,
  width = 800,
  height = 400,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 50, right: 30, bottom: 50, left: 60 },
  area = false,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(width);

  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    const updateWidth = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = width;

      let nextWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = Math.max(200, maxWidth); // Enforce full responsive width, ignore AI-generated fixed widths
      } else {
        nextWidth = fallbackWidth;
      }

      const minWidth = typeof maxWidth === 'number' ? Math.min(240, maxWidth) : 240;
      const maxWidthClamp = typeof maxWidth === 'number' ? maxWidth : 1800;

      setChartWidth(Math.max(minWidth, Math.min(nextWidth, maxWidthClamp)));
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [width]);

  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
        {title && (
          <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-zinc-400">
          <p className="text-sm">No series data for time series chart</p>
        </div>
      </div>
    );
  }

  // Helper to normalize different data formats
  const normalizeSeriesData = (s: typeof series[0]) => {
    const data = s.data;
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [] as string[], values: [] as number[] };
    }

    const firstItem = data[0];

    // Format: [value1, value2, ...] - plain number array
    if (typeof firstItem === 'number') {
      return {
        labels: (data as number[]).map((_, i) => `Point ${i + 1}`),
        values: data as number[],
      };
    }

    // Format: [[label/timestamp, value], ...]
    if (Array.isArray(firstItem)) {
      const pairs = data as Array<[number | string, number]>;
      return {
        labels: pairs.map(p => String(p[0])),
        values: pairs.map(p => p[1]),
      };
    }

    // Format: [{ x, y }, ...]
    if (typeof firstItem === 'object' && 'x' in firstItem && 'y' in firstItem) {
      const points = data as Array<{ x: number | string; y: number }>;
      return {
        labels: points.map(p => String(p.x)),
        values: points.map(p => p.y),
      };
    }

    // Format: [{ date, value }, ...]
    if (typeof firstItem === 'object' && 'date' in firstItem && 'value' in firstItem) {
      const points = data as Array<{ date: string; value: number }>;
      return {
        labels: points.map(p => p.date),
        values: points.map(p => p.value),
      };
    }

    // Format: [{ month, value }, ...]
    if (typeof firstItem === 'object' && 'month' in firstItem && 'value' in firstItem) {
      const points = data as Array<{ month: string; value: number }>;
      return {
        labels: points.map(p => p.month),
        values: points.map(p => p.value),
      };
    }

    // Generic Object Fallback: [{ "Monday": 90 }, { "Tuesday": 92 }]
    // Scans for the first numeric value in the object and uses its key as the label
    if (typeof firstItem === 'object' && !Array.isArray(firstItem)) {
      const isArrayOfObjects = data.every(item => typeof item === 'object' && !Array.isArray(item) && item !== null);

      if (isArrayOfObjects) {
        const labels: string[] = [];
        const values: number[] = [];

        for (const item of data as Array<Record<string, any>>) {
          const keys = Object.keys(item);
          // If perfectly single-key object:
          if (keys.length === 1) {
            labels.push(keys[0]);
            values.push(Number(item[keys[0]]) || 0);
          } else {
            // Find first numeric key
            const numericKey = keys.find(k => typeof item[k] === 'number');
            if (numericKey) {
              labels.push(numericKey); // Use the key where the number was found as the label maybe? Or find the first string for label?
              values.push(item[numericKey]);
            } else {
              // Just fallback to the first two keys if one is string and other is number
              const strKey = keys.find(k => typeof item[k] === 'string');
              const numKey = keys.find(k => typeof Number(item[k]) === 'number' && !isNaN(Number(item[k])));
              if (strKey && numKey) {
                labels.push(item[strKey]);
                values.push(Number(item[numKey]));
              }
            }
          }
        }

        if (labels.length > 0 && values.length > 0) {
          return { labels, values };
        }
      }
    }

    // Format: { "Week 1": 100, "Week 2": 200, ... } — plain object
    if (typeof firstItem !== 'object' || !Array.isArray(firstItem)) {
      // If we got here, data might be a plain object passed incorrectly.
      // Handle case where s.data itself is a plain object (not an array)
      const rawData = s.data as any;
      if (typeof rawData === 'object' && !Array.isArray(rawData)) {
        const entries = Object.entries(rawData);
        return {
          labels: entries.map(([k]) => k),
          values: entries.map(([, v]) => (typeof v === 'number' ? v : Number(v) || 0)),
        };
      }
    }

    return { labels: [] as string[], values: [] as number[] };
  };

  // Handle case where entire series[i].data is a plain object (backend sends {"Week 1": 100})
  const normalizedSeries = series.map(s => {
    const raw = (s as any).data;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const entries = Object.entries(raw);
      return {
        ...s,
        data: entries.map(([k, v]) => [k, typeof v === 'number' ? v : Number(v) || 0] as [string, number]),
      };
    }
    return s;
  });

  // Process all series to extract data
  const processedData = normalizedSeries.map(s => normalizeSeriesData(s));

  // Guard: if all series have empty values, show friendly fallback
  const hasValidData = processedData.some(d => d.values && d.values.length > 0);
  if (!hasValidData) {
    console.warn('[TimeSeriesChart] No valid data after normalization:', { series });
    return (
      <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
        {title && (
          <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
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

  // Use labels from first series or from xAxis if provided
  let xAxisLabels: (string | number | Date)[] = xAxis?.data || processedData[0]?.labels || [];

  // Check if labels look like timestamps (all numbers > 1000000000)
  const looksLikeTimestamps = xAxisLabels.length > 0 &&
    xAxisLabels.every(l => typeof l === 'number' || (!isNaN(Number(l)) && Number(l) > 1000000000));

  // Determine scale type
  let scaleType: 'time' | 'point' | 'band' = 'point';
  if (xAxis?.type === 'time' || looksLikeTimestamps) {
    scaleType = 'time';
    xAxisLabels = xAxisLabels.map(l => new Date(Number(l)));
  }

  // Transform series for MUI Charts
  const transformedSeries = normalizedSeries.map((s, idx) => ({
    data: processedData[idx].values,
    label: s.label || s.name || `Series ${idx + 1}`,
    color: s.color,
    showMark: true,
    area: area,
    connectNulls: true,
    // Force straight line segments unless a specific curve is requested
    curve: (s as any).curve || 'linear',
  }));

  // Chart colors based on theme
  const chartColors = {
    axisLine: isDarkMode ? '#9CA3AF' : '#6B7280',
    axisTick: isDarkMode ? '#9CA3AF' : '#6B7280',
    tickLabel: isDarkMode ? '#E5E7EB' : '#374151',
    legendText: isDarkMode ? '#E5E7EB' : '#374151',
    gridLine: isDarkMode ? '#374151' : '#E5E7EB',
  };

  return (
    <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
      {/* Header */}
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

      {/* Chart */}
      <div ref={containerRef} className="flex justify-center items-center min-h-[300px] w-full">
        <MuiLineChart
          xAxis={[
            {
              data: xAxisLabels,
              scaleType: scaleType,
              label: xAxis?.label,
            },
          ]}
          series={transformedSeries}
          width={chartWidth}
          height={height}
          grid={grid}
          margin={margin}
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
              stroke: 'currentColor',
              opacity: 0.2,
              strokeWidth: 1.5,
            },
            '& .MuiChartsAxis-tick': {
              stroke: 'currentColor', 
              opacity: 0.2,
              strokeWidth: 1,
            },
            '& .MuiChartsAxis-tickLabel': {
              fill: 'currentColor',
                      fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-root': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            },
            '& .MuiChartsLegend-series': {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            },
            '& .MuiChartsLegend-series text': {
              fill: `${chartColors.legendText} !important`,
                      fontFamily: 'inherit',
              fontSize: '12px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 2,
              width: '12px',
              height: '12px',
            },
            '& .MuiChartsGrid-line': {
              stroke: 'currentColor', 
              strokeDasharray: '4 4',
              opacity: 0.8,
            },
            ...(area && {
              '& .MuiAreaElement-root': {
                fillOpacity: 0.2,
              },
            }),
          }}
        />
      </div>
    </div>
  );
};

export default TimeSeriesChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'time-series-chart',
  category: 'charts' as const,
  component: TimeSeriesChart,
  description: 'Time series line chart for visualizing data over time. Supports multiple data formats: [[label, value]], [{month, value}], [{date, value}], [{x, y}], or plain number arrays.',
  tags: ['chart', 'time-series', 'line', 'temporal', 'data-visualization', 'monthly', 'trend'],
  propTypes: {
    title: 'string',
    description: 'string',
    series: 'Array<{ name?, label?, color?, data: [[label, value], ...] | [{month, value}, ...] | [{date, value}, ...] | number[] }>',
    xAxis: "{ type?: 'time' | 'category', data?: string[], label?: string }",
    width: 'number',
    height: 'number',
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
    area: 'boolean - Show area fill under the line (default: false)',
  },
};
