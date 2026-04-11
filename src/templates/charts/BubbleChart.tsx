import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getSurfaceClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel } from '../core/types';

interface BubbleChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Series data with bubble points */
  series: Array<{
    label?: string;
    name?: string;
    data: Array<[number, number, number] | { value: [number, number, number]; name?: string; color?: string 
  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}>;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  title,
  description,
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
        {title && (
          <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-zinc-400">
          <p className="text-sm">No series data for bubble chart</p>
        </div>
      </div>
    );
  }

  // Transform data from various formats to { x, y, z, name, color }
  const transformedData = series.flatMap(s => {
    if (!Array.isArray(s.data)) return [];

    const seriesLabel = s.label || s.name || '';
    const seriesColor = s.color || '#8b5cf6';

    return s.data.map((point, index) => {
      let x, y, z;
      let pointName = '';
      let pointColor = seriesColor;

      // Handle both array format [x, y, z] and object format { value: [x, y, z], ... }
      if (Array.isArray(point)) {
        [x, y, z] = point;
      } else if (point && typeof point === 'object' && 'value' in point) {
        [x, y, z] = point.value || [0, 0, 0];
        pointName = point.name || '';
        pointColor = point.color || seriesColor;
      } else {
        return null;
      }

      return {
        x: Number(x) || 0,
        y: Number(y) || 0,
        z: Number(z) || 0,
        name: pointName || seriesLabel || `Point ${index + 1}`,
        color: pointColor,
      };
    }).filter(p => p !== null);
  });

  if (transformedData.length === 0) {
    return (
      <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
        {title && (
          <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-zinc-400">
          <p className="text-sm">No data points for bubble chart</p>
        </div>
      </div>
    );
  }

  // Custom tooltip
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const axisColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const legendColor = isDarkMode ? '#E5E7EB' : '#374151';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-transparent dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg">
          {data.name && (
            <p className="font-semibold text-zinc-900 dark:text-white mb-1">{data.name}</p>
          )}
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            X: <span className="font-medium text-zinc-900 dark:text-white">{data.x.toFixed(2)}</span>
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Y: <span className="font-medium text-zinc-900 dark:text-white">{data.y.toFixed(2)}</span>
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Size: <span className="font-medium text-zinc-900 dark:text-white">{data.z.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
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
      <div className="flex justify-center items-center min-h-[300px]">
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.8} />
            <XAxis
              dataKey="x"
              type="number"
              tick={{ fill: textColor, fontSize: 13, fontWeight: 500 }}
              stroke={axisColor}
              strokeWidth={1.5}
            />
            <YAxis
              dataKey="y"
              type="number"
              tick={{ fill: textColor, fontSize: 13, fontWeight: 500 }}
              stroke={axisColor}
              strokeWidth={1.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: legendColor, fontSize: '14px' }} />
            <Scatter name="Data Points" data={transformedData}>
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} r={Math.max(5, entry.z * 2)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BubbleChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'bubble-chart',
  category: 'charts' as const,
  component: BubbleChart,
  description: 'Bubble chart for visualizing three-dimensional data with x, y, and size dimensions',
  tags: ['chart', 'bubble', 'scatter', '3d', 'correlation', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    series: 'Array<{ data: [{ value: [x, y, z], name?, color? }] }>',
    width: 'number',
    height: 'number',
  },
};
