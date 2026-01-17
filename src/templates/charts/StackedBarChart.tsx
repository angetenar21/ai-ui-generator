import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface StackedBarChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ title, description, data, height = 400 }) => (
  <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-6 my-4">
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
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.8} />
        <XAxis tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }} />
        <YAxis tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          labelStyle={{ color: '#111827', fontWeight: 600 }}
          itemStyle={{ color: '#374151' }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          wrapperStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '8px',
          }}
          formatter={(value) => (
            <span style={{ color: '#374151', fontSize: '12px', fontWeight: 500 }}>{value}</span>
          )}
          iconSize={10}
        />
        <Bar dataKey="value" fill="#F97316" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default StackedBarChart;

export const metadata = {
  name: 'stacked-bar-chart-v2',
  category: 'charts' as const,
  component: StackedBarChart,
  description: 'Stacked bar variant',
  tags: ['chart'],
};
