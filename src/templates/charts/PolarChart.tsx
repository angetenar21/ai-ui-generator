import React from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Legend,
  Tooltip,
} from 'recharts';

interface PolarChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Angle axis configuration */
  angleAxis?: {
    data: string[];
  };

  /** Radius axis configuration */
  radiusAxis?: any;

  /** Series data for polar chart */
  series: Array<{
    name?: string;
    type?: string;
    data: number[];
    coordinateSystem?: string;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

const PolarChart: React.FC<PolarChartProps> = ({
  title,
  description,
  angleAxis,
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
          <p className="text-sm">No series data for polar chart</p>
        </div>
      </div>
    );
  }

  const categories = angleAxis?.data || [];

  // Transform data for radial bar chart
  const chartData = categories.map((category, index) => {
    const dataPoint: any = {
      name: category,
    };

    series.forEach((s) => {
      const value = s.data[index];
      dataPoint[s.name || 'value'] = typeof value === 'number' ? value : 0;
    });

    return dataPoint;
  });

  // If no categories, create data from first series
  if (categories.length === 0 && series.length > 0) {
    const firstSeries = series[0];
    chartData.length = 0;
    firstSeries.data.forEach((value, index) => {
      chartData.push({
        name: `Item ${index + 1}`,
        [firstSeries.name || 'value']: typeof value === 'number' ? value : 0,
      });
    });
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="90%"
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#d1d5db',
            }}
          />
          <Legend
            wrapperStyle={{ color: '#d1d5db' }}
            iconType="circle"
          />
          {series.map((s, index) => (
            <RadialBar
              key={s.name || index}
              dataKey={s.name || 'value'}
              fill={s.color || `hsl(${(index * 360) / series.length}, 70%, 60%)`}
              background={{ fill: '#1f2937' }}
              cornerRadius={10}
            />
          ))}
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-xs text-gray-400 text-center mt-2">
        Polar chart displayed as radial bars
      </div>
    </div>
  );
};

export default PolarChart;

export const metadata = {
  name: 'polar-chart',
  category: 'charts' as const,
  component: PolarChart,
  description: 'Polar coordinate chart. Displays data in radial bar format.',
  tags: ['chart', 'polar', 'radial', 'circular'],
  propTypes: {
    title: 'string',
    description: 'string',
    angleAxis: '{ data: string[] }',
    radiusAxis: 'any',
    series: 'Array<{ name?, type?, data: number[], coordinateSystem?, color? }>',
    width: 'number',
    height: 'number',
  },
};
