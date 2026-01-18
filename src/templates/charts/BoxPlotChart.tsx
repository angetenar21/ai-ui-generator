import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Line, Legend } from 'recharts';

interface BoxPlotChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** X-axis categories */
  xAxis?: string[];

  /** Series data with box plot statistics */
  series: Array<{
    name: string;
    data: Array<[number, number, number, number, number]>; // [min, q1, median, q3, max]
    type?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width = 800,
  height = 400,
}) => {
  void(width); // Width prop available for future use
  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No series data for box plot</p>
        </div>
      </div>
    );
  }

  // Transform box plot data
  const categories = xAxis || series[0].data.map((_, i) => `Category ${i + 1}`);
  const firstSeries = series[0];

  const chartData = categories.map((category, index) => {
    const stats = firstSeries.data[index];
    if (!stats || !Array.isArray(stats) || stats.length < 5) {
      return {
        name: category,
        min: 0,
        q1: 0,
        median: 0,
        q3: 0,
        max: 0,
        iqr: 0,
      };
    }

    const [min, q1, median, q3, max] = stats;
    return {
      name: category,
      min: Number(min) || 0,
      q1: Number(q1) || 0,
      median: Number(median) || 0,
      q3: Number(q3) || 0,
      max: Number(max) || 0,
      iqr: (Number(q3) || 0) - (Number(q1) || 0),
    };
  });

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
          <YAxis tick={{ fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#d1d5db',
            }}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }} />
          <Bar dataKey="iqr" fill="#8b5cf6" fillOpacity={0.6} stackId="a" name="IQR (Q1-Q3)" />
          <Line dataKey="median" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Median" />
          <Line dataKey="min" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" name="Min" />
          <Line dataKey="max" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" name="Max" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-xs text-gray-400 text-center mt-2">
        Box plot showing Min, Q1, Median, Q3, Max and IQR
      </div>
    </div>
  );
};

export default BoxPlotChart;

export const metadata = {
  name: 'boxplot-chart',
  category: 'charts' as const,
  component: BoxPlotChart,
  description: 'Box plot chart for statistical distribution. Shows min, Q1, median, Q3, and max values.',
  tags: ['chart', 'boxplot', 'statistics', 'distribution'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: 'string[]',
    series: 'Array<{ name, data: [[min, q1, median, q3, max], ...] }>',
    width: 'number',
    height: 'number',
  },
};
