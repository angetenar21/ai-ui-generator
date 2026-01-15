import React from 'react';
import { Funnel, Tooltip, ResponsiveContainer, FunnelChart as RechartsFunnelChart } from 'recharts';

interface FunnelChartProps {
  title?: string;
  data: Array<{ name: string; value: number }>;
  width?: number;
  height?: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ title, data, height = 400 }) => (
  <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
    {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <RechartsFunnelChart data={data}>
        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
        <Funnel dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" />
      </RechartsFunnelChart>
    </ResponsiveContainer>
  </div>
);

export default FunnelChart;

export const metadata = {
  name: 'funnel-chart',
  category: 'charts' as const,
  component: FunnelChart,
  description: 'Funnel chart for conversion funnels',
  tags: ['chart', 'funnel', 'conversion'],
};
