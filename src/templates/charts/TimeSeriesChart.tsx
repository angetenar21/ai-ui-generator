import React, { useEffect, useRef, useState } from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';

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
    data: Array<[number | string, number]> | Array<{ x: number | string; y: number }> | Array<{ date: string; value: number }> | Array<{ month: string; value: number }> | number[];
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

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = Math.min(fallbackWidth, maxWidth);
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
      <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
        {title && (
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-gray-400">
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

    return { labels: [] as string[], values: [] as number[] };
  };

  // Process all series to extract data
  const processedData = series.map(s => normalizeSeriesData(s));

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
  const transformedSeries = series.map((s, idx) => ({
    data: processedData[idx].values,
    label: s.label || s.name || `Series ${idx + 1}`,
    color: s.color,
    showMark: true,
    area: area,
    connectNulls: true,
  }));

  // Chart colors based on theme
  const chartColors = {
    axisLine: isDarkMode ? '#6B7280' : '#6B7280',
    axisTick: isDarkMode ? '#6B7280' : '#6B7280',
    tickLabel: isDarkMode ? '#D1D5DB' : '#374151',
    legendText: isDarkMode ? '#D1D5DB' : '#374151',
    gridLine: isDarkMode ? '#374151' : '#E5E7EB',
  };

  return (
    <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
      {/* Header */}
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
