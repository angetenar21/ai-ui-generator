import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Line, Legend } from 'recharts';
import { getSurfaceClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel } from '../core/types';

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
  
  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width: _width,
  height = 400,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-zinc-400">
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
    <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
      {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-zinc-400 mb-4 text-center">{description}</p>
      )}
      {(() => {
        const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
        const textColor = isDarkMode ? '#E5E7EB' : '#9CA3AF';
        const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
        const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
        const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';
        const legendColor = isDarkMode ? '#E5E7EB' : '#374151';

        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor }} />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText,
                }}
              />
              <Legend wrapperStyle={{ color: legendColor }} />
              <Bar dataKey="iqr" fill="#8b5cf6" fillOpacity={0.6} stackId="a" name="IQR (Q1-Q3)" />
              <Line dataKey="median" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Median" />
              <Line dataKey="min" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" name="Min" />
              <Line dataKey="max" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" name="Max" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      })()}
      <div className="text-xs text-zinc-400 text-center mt-2">
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
