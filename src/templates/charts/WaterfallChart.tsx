import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface WaterfallChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** X-axis categories */
  xAxis?: {
    data: string[];
  };

  /** Series data with waterfall values */
  series: Array<{
    name?: string;
    data: (number | { value: number; isTotal?: boolean })[];
    type?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width = 800,
  height = 400,
}) => {
  void (width); // Width prop available for future use
  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No series data for waterfall chart</p>
        </div>
      </div>
    );
  }

  const firstSeries = series[0];

  // Validate that we have data
  if (!firstSeries || !firstSeries.data || firstSeries.data.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No data values in series</p>
        </div>
      </div>
    );
  }

  // Generate categories from xAxis or auto-generate based on data length
  let categories = xAxis?.data || [];
  if (categories.length === 0) {
    // Auto-generate category names if not provided
    categories = firstSeries.data.map((_, index) => {
      const labels = ['Start', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'];
      return labels[index] || `Category ${index + 1}`;
    });
  }

  // Ensure categories and data have matching lengths
  const dataLength = Math.min(categories.length, firstSeries.data.length);
  categories = categories.slice(0, dataLength);
  const seriesData = firstSeries.data.slice(0, dataLength);

  // Calculate cumulative values for waterfall
  let cumulative = 0;
  const chartData = categories.map((category, index) => {
    const item = seriesData[index];

    let value: number;
    let isTotal = false;

    if (typeof item === 'object' && item !== null && 'value' in item) {
      value = Number(item.value) || 0;
      isTotal = item.isTotal || false;
    } else {
      value = Number(item) || 0;
    }

    const start = cumulative;
    cumulative += value;
    const end = cumulative;

    return {
      name: category,
      value,
      start,
      end,
      isTotal,
      positive: value >= 0,
      displayValue: Math.abs(value),
      absoluteStart: isTotal ? 0 : start,
      absoluteEnd: end,
    };
  });

  // Custom shape renderer for waterfall bars
  const WaterfallBar = (props: any) => {
    const { x, y, width, height, payload } = props;

    if (!payload) return null;

    const fill = payload.isTotal
      ? '#3b82f6'
      : payload.positive
        ? '#10b981'
        : '#ef4444';

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke="#1f2937"
          strokeWidth={1}
          opacity={0.9}
        />
        <text
          x={x + width / 2}
          y={y - 5}
          fill="#9ca3af"
          textAnchor="middle"
          fontSize={11}
          fontWeight="500"
        >
          {payload.end.toFixed(1)}
        </text>
      </g>
    );
  };

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">No data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData} margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#d1d5db',
                }}
                formatter={(_value: any, _name: string, props: any) => {
                  const { payload } = props;
                  return [
                    `${payload.positive ? '+' : ''}${payload.value.toFixed(2)}`,
                    payload.isTotal ? 'Total' : 'Change',
                  ];
                }}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend wrapperStyle={{ color: '#d1d5db', paddingTop: '10px' }} />
              <Bar
                dataKey="displayValue"
                fill="#8b5cf6"
                name="Value"
                shape={<WaterfallBar />}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span>Increase</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span>Decrease</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span>Total</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WaterfallChart;

export const metadata = {
  name: 'waterfall-chart',
  category: 'charts' as const,
  component: WaterfallChart,
  description: 'Waterfall chart for cumulative impact visualization. Shows increases, decreases, and totals.',
  tags: ['chart', 'waterfall', 'cumulative', 'financial'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: '{ data: string[] }',
    series: 'Array<{ data: (number | { value, isTotal? })[] }>',
    width: 'number',
    height: 'number',
  },
};
