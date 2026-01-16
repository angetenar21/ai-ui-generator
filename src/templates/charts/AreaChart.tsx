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
  height = 280,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 40, right: 20, bottom: 40, left: 50 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(propWidth || 500);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setChartWidth(Math.max(300, containerWidth - 16));
      }
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

  // Debug logging
  console.log('[AreaChart] Rendering with data:', {
    title,
    xAxis: processedXAxis,
    series: areaSeriesData,
    chartWidth,
    height
  });

  return (
    <div className="w-full max-w-full bg-white dark:bg-gray-800 rounded-xl p-4 my-2 overflow-hidden">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div ref={containerRef} className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex justify-center items-center min-h-[200px]">
        {(() => {
          try {
            return (
              <LineChart
                xAxis={processedXAxis}
                series={areaSeriesData}
                width={chartWidth}
                height={height}
                grid={grid}
                margin={margin}
                slotProps={{
                  legend: legend
                    ? {
                      position: { vertical: 'top', horizontal: 'center' },
                    }
                    : undefined,
                }}
                sx={{
                  '& .MuiChartsAxis-line': {
                    stroke: '#6B7280',
                    strokeWidth: 1.5,
                  },
                  '& .MuiChartsAxis-tick': {
                    stroke: '#6B7280',
                    strokeWidth: 1,
                  },
                  '& .MuiChartsAxis-tickLabel': {
                    fill: '#374151',
                    fontSize: '13px',
                    fontWeight: 500,
                  },
                  '& .MuiChartsLegend-series text': {
                    fill: '#374151 !important',
                    fontSize: '14px',
                    fontWeight: 500,
                  },
                  '& .MuiChartsGrid-line': {
                    stroke: '#E5E7EB',
                    strokeDasharray: '4 4',
                    opacity: 0.8,
                  },
                  '& .MuiAreaElement-root': {
                    fillOpacity: 0.3,
                  },
                }}
              />
            );
          } catch (error) {
            console.error('[AreaChart] Error rendering chart:', error);
            return (
              <div className="flex justify-center items-center min-h-[300px] text-text-secondary">
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
