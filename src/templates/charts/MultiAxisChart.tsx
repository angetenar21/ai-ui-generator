import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface MultiAxisChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;
}

const MultiAxisChart: React.FC<MultiAxisChartProps> = ({ title, data, height = 400 }) => (
  <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
    {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis tick={{ fill: '#374151' }} />
        <YAxis tick={{ fill: '#374151' }} />
        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
        <Legend wrapperStyle={{ color: '#d1d5db' }} />
        <Bar dataKey="value" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MultiAxisChart;

export const metadata = {
  name: 'multi-axis-chart',
  category: 'charts' as const,
  component: MultiAxisChart,
  description: 'Chart with multiple axes',
  tags: ['chart'],
};
