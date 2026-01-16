import React from 'react';
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadialBarChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Series data for radial bars */
  series: Array<{
    name: string;
    value: number;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({
  title,
  description,
  series,
  width = 800,
  height = 400,
}) => {
  void (width); // Width prop available for future use
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
          <p className="text-sm">No series data for radial bar chart</p>
        </div>
      </div>
    );
  }

  // Default color palette
  const defaultColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  // Transform data for Recharts RadialBarChart
  // Each item needs a fill color
  const chartData = series.map((item, index) => ({
    name: item.name,
    value: Number(item.value) || 0,
    fill: item.color || defaultColors[index % defaultColors.length],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-text-primary mb-1">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Value: <span className="font-medium text-text-primary">{data.value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
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
      <div className="flex justify-center items-center min-h-[300px]">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsRadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="90%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
              background
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontSize: '14px',
                color: '#374151',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RechartsRadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadialBarChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'radial-bar-chart',
  category: 'charts' as const,
  component: RadialBarChart,
  description: 'Radial bar chart for visualizing data in a circular layout with concentric bars',
  tags: ['chart', 'radial', 'circular', 'progress', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    series: 'Array<{ name, value, color? }>',
    width: 'number',
    height: 'number',
  },
};
