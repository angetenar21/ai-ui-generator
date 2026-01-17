import React from 'react';
import { Funnel, Tooltip, ResponsiveContainer, FunnelChart as RechartsFunnelChart, Cell, LabelList } from 'recharts';

interface FunnelChartProps {
  title?: string;
  data: Array<{ name: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  colors?: string[];
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

const FunnelChart: React.FC<FunnelChartProps> = ({ title, data, height = 400, colors = DEFAULT_COLORS }) => {
  // Add colors to data if not provided
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length],
  }));

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsFunnelChart data={coloredData}>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            itemStyle={{ color: '#f3f4f6' }}
            labelStyle={{ color: '#f3f4f6', fontWeight: 'bold' }}
          />
          <Funnel dataKey="value" isAnimationActive>
            <LabelList position="right" fill="#374151" stroke="none" dataKey="name" />
            {coloredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;

export const metadata = {
  name: 'funnel-chart',
  category: 'charts' as const,
  component: FunnelChart,
  description: 'Funnel chart for conversion funnels',
  tags: ['chart', 'funnel', 'conversion'],
};
