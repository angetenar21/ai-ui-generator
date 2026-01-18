import React from 'react';
import { Funnel, Tooltip, ResponsiveContainer, FunnelChart as RechartsFunnelChart, Cell, LabelList } from 'recharts';

interface FunnelChartProps {
  title?: string;
  description?: string;
  data: Array<{ name: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  colors?: string[];
  legend?: boolean;
}

// Default color palette for funnel segments
const DEFAULT_COLORS = [
  '#8b5cf6', // violet
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#ec4899', // pink
];

const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  description,
  data,
  height = 420,
  colors = DEFAULT_COLORS,
  legend = true,
}) => {
  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const secondaryText = isDarkMode ? '#9CA3AF' : '#6B7280';

  // Defensive: handle empty or invalid data
  const validData = Array.isArray(data)
    ? data
      .filter((d) => typeof d?.value === 'number' && !Number.isNaN(d.value))
      .map((d) => ({ ...d, value: Math.max(d.value, 0) }))
    : [];

  if (!validData.length) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 my-1 border border-gray-200 dark:border-gray-700">
        {(title || description) && (
          <div className="mb-3 text-center">
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-center min-h-[220px] text-sm text-gray-600 dark:text-gray-300">
          No data available
        </div>
      </div>
    );
  }

  // Ensure descending values for a smooth funnel shape
  const sortedData = [...validData].sort((a, b) => b.value - a.value);

  // Add colors to data if not provided
  const coloredData = sortedData.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length],
  }));

  // Build tapered shape values to keep the funnel silhouette even when values are close.
  const maxValue = Math.max(...coloredData.map(d => d.value), 1);
  const epsilon = Math.max(maxValue * 0.01, 0.1); // minimum step-down per row
  const minBand = Math.max(maxValue * 0.02, 0.5); // avoid collapsing to a line

  const taperedData = coloredData.map((item, idx) => {
    const adjusted = Math.max(item.value - idx * epsilon, minBand);
    return {
      ...item,
      shapeValue: adjusted,
    };
  });

  // Precompute display labels that include the original value for readability
  const labeledData = taperedData.map((item) => ({
    ...item,
    label: `${item.name} — ${item.value}`,
  }));

  // Custom legend renderer for proper alignment
  const renderLegendItems = (items: typeof labeledData) => (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-4 px-2">
      {items.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }} />
          <span className="text-sm font-medium" style={{ color: textColor }}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 my-1 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3 text-center">
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

      <ResponsiveContainer width="100%" height={height} minHeight={360}>
        <RechartsFunnelChart data={labeledData} margin={{ top: 16, right: 64, bottom: 24, left: 16 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: textColor,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: secondaryText, fontWeight: 600 }}
            formatter={(_value: number, name: string, props: any) => [props?.payload?.value, props?.payload?.name || name]}
          />
          <Funnel dataKey="shapeValue" data={labeledData} isAnimationActive>
            <LabelList
              position="right"
              fill={textColor}
              stroke="none"
              dataKey="label"
              offset={8}
              style={{ fontSize: '11px', fontWeight: 600 }}
            />
            {labeledData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
      {legend && renderLegendItems(labeledData)}
    </div>
  );
};

export default FunnelChart;

export const metadata = {
  name: 'funnel-chart',
  category: 'charts' as const,
  component: FunnelChart,
  description: 'Funnel chart for conversion funnels with distinct colors per segment and centered legend',
  tags: ['chart', 'funnel', 'conversion', 'sales', 'marketing'],
  propTypes: {
    title: 'string',
    description: 'string',
    data: 'Array<{ name: string, value: number, color?: string }>',
    height: 'number',
    colors: 'string[] - Custom color palette',
    legend: 'boolean - Show legend (default: true)',
  },
};
