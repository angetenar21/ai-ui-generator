import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface MultiAxisChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;
}

const MultiAxisChart: React.FC<MultiAxisChartProps> = ({ title, data, height = 400 }) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const legendColor = isDarkMode ? '#D1D5DB' : '#374151';

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
          <Legend wrapperStyle={{ color: legendColor }} />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiAxisChart;

export const metadata = {
  name: 'multi-axis-chart',
  category: 'charts' as const,
  component: MultiAxisChart,
  description: 'Chart with multiple axes',
  tags: ['chart'],
};
