import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface HistogramChartPropsOld {
  /** Chart title */
  title?: string;

  /** Data in simple Recharts format */
  data: Array<{ name: string; value: number;[key: string]: any }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

interface HistogramChartPropsNew {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Series data with histogram bins */
  series: Array<{
    name: string;
    data: Array<[string, number]>; // [label, value] pairs
    type?: string;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

type HistogramChartProps = HistogramChartPropsOld | HistogramChartPropsNew;

const HistogramChart: React.FC<HistogramChartProps> = (props) => {
  const { title, height = 400 } = props;

  let chartData: Array<{ name: string;[key: string]: any }>;
  let description: string | undefined;
  let seriesKeys: Array<{ key: string; name: string; color?: string }> = [];

  // Check which format is being used
  if ('series' in props && props.series) {
    // New format: series with [label, value] pairs
    const { series } = props;
    description = 'description' in props ? props.description : undefined;

    // Validate
    if (!series || !Array.isArray(series) || series.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
          <div className="text-center text-gray-400">
            <p className="text-sm">No series data for histogram</p>
          </div>
        </div>
      );
    }

    // Transform series data to Recharts format
    // Collect all unique labels first
    const labelSet = new Set<string>();
    series.forEach((s) => {
      if (s.data && Array.isArray(s.data)) {
        s.data.forEach((point) => {
          if (Array.isArray(point) && point.length >= 2) {
            labelSet.add(String(point[0]));
          }
        });
      }
    });

    const labels = Array.from(labelSet);

    // Create data points with all series values
    chartData = labels.map((label) => {
      const dataPoint: { name: string;[key: string]: any } = { name: label };

      series.forEach((s) => {
        const point = s.data?.find((p) => Array.isArray(p) && String(p[0]) === label);
        dataPoint[s.name] = point && Array.isArray(point) ? Number(point[1]) || 0 : 0;
      });

      return dataPoint;
    });

    // Create series keys for rendering
    seriesKeys = series.map((s) => ({
      key: s.name,
      name: s.name,
      color: s.color,
    }));
  } else if ('data' in props && props.data) {
    // Old format: simple data array
    chartData = props.data;

    // Validate
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
          <div className="text-center text-gray-400">
            <p className="text-sm">No data available for histogram</p>
          </div>
        </div>
      );
    }

    seriesKeys = [{ key: 'value', name: 'Value', color: '#8b5cf6' }];
  } else {
    // Invalid format
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">Invalid histogram configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          barCategoryGap={0}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af' }}
            label={{ value: 'Bins', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
          />
          <YAxis
            tick={{ fill: '#9ca3af' }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#d1d5db',
            }}
            labelStyle={{ color: '#d1d5db' }}
            formatter={(value: any) => [`Frequency: ${value}`, '']}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }} />
          {seriesKeys.map((sk, index) => (
            <Bar
              key={sk.key}
              dataKey={sk.key}
              name={sk.name}
              fill={sk.color || `hsl(${(index * 360) / seriesKeys.length}, 70%, 60%)`}
              stroke="#374151"
              strokeWidth={1}
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistogramChart;

export const metadata = {
  name: 'histogram-chart',
  category: 'charts' as const,
  component: HistogramChart,
  description: 'Histogram for distribution visualization. Supports series format with [label, value] pairs.',
  tags: ['chart', 'histogram', 'distribution', 'bar'],
  propTypes: {
    title: 'string',
    description: 'string',
    // New format
    series: 'Array<{ name, data: [[label, value], ...], type?, color? }>',
    // Old format
    data: 'Array<{ name, value, ... }>',
    width: 'number',
    height: 'number',
  },
};
