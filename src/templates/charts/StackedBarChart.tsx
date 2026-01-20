import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface StackedBarChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;
  xAxis?: Array<{ dataKey?: string; label?: string }>;
  series?: Array<{ dataKey: string; name?: string; color?: string; stackId?: string }>;
  layout?: 'horizontal' | 'vertical';
}

// Color palette for stacked bars
const COLOR_PALETTE = [
  '#F97316', // Orange
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#D946EF', // Fuchsia
];

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  title,
  description,
  data,
  height = 400,
  xAxis,
  series,
  layout = 'vertical'
}) => {
  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#111827';

  // Auto-detect series from data if not provided
  let detectedSeries = series;
  if (!detectedSeries && data && data.length > 0) {
    const firstItem = data[0];
    const keys = Object.keys(firstItem).filter(key =>
      key !== 'name' &&
      key !== 'label' &&
      key !== 'category' &&
      key !== 'date' &&
      key !== 'time' &&
      typeof firstItem[key] === 'number'
    );
    detectedSeries = keys.map(key => ({
      dataKey: key,
      name: key,
      stackId: '1'
    }));
  }

  // Get x-axis key
  const xAxisKey = xAxis?.[0]?.dataKey || 'name';

  // Validate data
  if (!data || data.length === 0 || !detectedSeries || detectedSeries.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-6">
        {title && (
          <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
          No data available for stacked bar chart
        </div>
      </div>
    );
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-6">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          layout={layout}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
          <XAxis
            dataKey={layout === 'vertical' ? xAxisKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis
            dataKey={layout === 'horizontal' ? xAxisKey : undefined}
            type={layout === 'horizontal' ? 'category' : 'number'}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              color: tooltipText
            }}
            labelStyle={{ color: tooltipText, fontWeight: 600 }}
            itemStyle={{ color: tooltipText }}
            cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingBottom: '12px',
            }}
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>{value}</span>
            )}
            iconSize={12}
            iconType="rect"
          />
          {detectedSeries.map((s, index) => {
            const color = s.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
            return (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stackId={s.stackId || '1'}
                fill={color}
                radius={[4, 4, 0, 0]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;

export const metadata = {
  name: 'stacked-bar-chart-v2',
  category: 'charts' as const,
  component: StackedBarChart,
  description: 'Stacked bar variant',
  tags: ['chart'],
};
