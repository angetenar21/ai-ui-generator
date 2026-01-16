import React from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';

interface TimeSeriesChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Series data with time-based data points */
  series: Array<{
    name?: string;
    color?: string;
    data: Array<[number, number]>; // [timestamp, value] pairs
  }>;

  /** X-axis configuration */
  xAxis?: {
    type: 'time';
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
}) => {
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

  // Transform [[timestamp, value]] format to MUI X-Charts format
  // Extract all unique timestamps and sort them
  const allTimestamps = new Set<number>();
  series.forEach(s => {
    if (Array.isArray(s.data)) {
      s.data.forEach(point => {
        if (Array.isArray(point) && point.length >= 2) {
          allTimestamps.add(point[0]);
        }
      });
    }
  });

  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  // Convert timestamps to Date objects for proper time axis
  const xAxisData = sortedTimestamps.map(ts => new Date(ts));

  // Transform each series data to match timestamps
  const transformedSeries = series.map(s => {
    // Create a map of timestamp -> value for quick lookup
    const dataMap = new Map<number, number>();
    if (Array.isArray(s.data)) {
      s.data.forEach(point => {
        if (Array.isArray(point) && point.length >= 2) {
          dataMap.set(point[0], point[1]);
        }
      });
    }

    // Create data array aligned with sorted timestamps
    const alignedData = sortedTimestamps.map(ts => dataMap.get(ts) ?? null);

    return {
      data: alignedData,
      label: s.name || 'Series',
      color: s.color,
      showMark: true,
      connectNulls: true, // Connect points even if some are null
    };
  });

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
      <div className="flex justify-center items-center min-h-[300px]">
        <MuiLineChart
          xAxis={[
            {
              data: xAxisData,
              scaleType: 'time',
              label: xAxis?.type === 'time' ? 'Time' : undefined,
            },
          ]}
          series={transformedSeries}
          width={width}
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
            },
            '& .MuiChartsGrid-line': {
              stroke: '#E5E7EB',
              strokeDasharray: '4 4',
              opacity: 0.8,
            },
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
  description: 'Time series line chart for visualizing data over time with multiple series support',
  tags: ['chart', 'time-series', 'line', 'temporal', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    series: 'Array<{ name?, color?, data: [[timestamp, value], ...] }>',
    xAxis: "{ type: 'time' }",
    width: 'number',
    height: 'number',
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
