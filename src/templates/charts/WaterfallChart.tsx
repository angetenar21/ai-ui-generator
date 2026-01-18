import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Cell } from 'recharts';

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

  // Dark mode detection
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';

  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">No series data for waterfall chart</p>
        </div>
      </div>
    );
  }

  const firstSeries = series[0];

  // Validate that we have data
  if (!firstSeries || !firstSeries.data || firstSeries.data.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-gray-600 dark:text-gray-400">
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
      if (index === 0) return 'Start';
      if (index === firstSeries.data.length - 1) return 'Total';
      return `Step ${index}`;
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

    // Parse the data item
    if (typeof item === 'object' && item !== null && 'value' in item) {
      value = Number(item.value) || 0;
      isTotal = item.isTotal || false;
    } else {
      value = Number(item) || 0;
    }

    // Determine if this is the last item and should be treated as total
    const isLast = index === categories.length - 1;
    if (isLast && !isTotal) {
      isTotal = true;
    }

    const previousCumulative = cumulative;

    // For total bars, show the full cumulative value
    if (isTotal) {
      return {
        name: category,
        value,
        start: 0,
        end: cumulative,
        displayValue: cumulative,
        actualChange: value,
        isTotal: true,
        positive: cumulative >= 0,
        // For stacked bar chart
        invisible: 0,
        visible: cumulative,
      };
    }

    // For regular bars, show the change from previous
    cumulative += value;

    return {
      name: category,
      value,
      start: previousCumulative,
      end: cumulative,
      displayValue: Math.abs(value),
      actualChange: value,
      isTotal: false,
      positive: value >= 0,
      // For stacked bar chart
      invisible: Math.min(previousCumulative, cumulative),
      visible: Math.abs(value),
    };
  });

  // Custom bar shape for waterfall effect
  const WaterfallBar = (props: any) => {
    const { x, y, width, height, fill, payload } = props;

    if (!payload || height === 0) return null;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={isDarkMode ? '#1F2937' : '#FFFFFF'}
        strokeWidth={2}
        opacity={0.9}
        rx={2}
      />
    );
  };

  // Custom label to show values above bars
  const renderLabel = (props: any) => {
    const { x, y, width, payload } = props;
    if (!payload) return null;

    const value = payload.isTotal ? payload.displayValue : payload.actualChange;
    const displayText = payload.isTotal
      ? value.toFixed(0)
      : (value >= 0 ? '+' : '') + value.toFixed(0);

    return (
      <text
        x={x + width / 2}
        y={payload.positive || payload.isTotal ? y - 5 : y + 15}
        fill={textColor}
        textAnchor="middle"
        fontSize={11}
        fontWeight="600"
      >
        {displayText}
      </text>
    );
  };

  // Calculate Y-axis domain
  const allValues = chartData.flatMap(d => [d.start, d.end]);
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 0);
  const padding = (maxValue - minValue) * 0.1;
  const yDomain = [
    Math.floor(minValue - padding),
    Math.ceil(maxValue + padding)
  ];

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">{description}</p>
      )}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          <p className="text-sm">No data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, bottom: 20, left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                domain={yDomain}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText,
                }}
                formatter={(_value: any, _name: string, props: any) => {
                  const { payload } = props;
                  if (!payload) return ['', ''];

                  return [
                    payload.isTotal
                      ? `Total: ${payload.displayValue.toFixed(2)}`
                      : `${payload.positive ? 'Increase' : 'Decrease'}: ${payload.positive ? '+' : ''}${payload.actualChange.toFixed(2)}`,
                    payload.isTotal ? '' : `Running Total: ${payload.end.toFixed(2)}`
                  ];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />

              {/* Invisible bars to create the waterfall offset */}
              <Bar
                dataKey="invisible"
                stackId="stack"
                fill="transparent"
                isAnimationActive={false}
              />

              {/* Visible bars with colors based on type */}
              <Bar
                dataKey="visible"
                stackId="stack"
                shape={<WaterfallBar />}
                label={renderLabel}
                isAnimationActive={true}
                animationDuration={800}
              >
                {chartData.map((entry, index) => {
                  const fill = entry.isTotal
                    ? '#3B82F6' // Blue for totals
                    : entry.positive
                    ? '#10B981' // Green for increases
                    : '#EF4444'; // Red for decreases

                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Increase</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Decrease</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Total</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Starting Value:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {chartData[0]?.start.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Final Value:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.end.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Net Change:</span>
              <span className={`font-semibold ${
                (chartData[chartData.length - 1]?.end || 0) >= (chartData[0]?.start || 0)
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {((chartData[chartData.length - 1]?.end || 0) - (chartData[0]?.start || 0)).toFixed(2)}
              </span>
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
  description: 'Waterfall chart for cumulative impact visualization. Shows increases, decreases, and totals with proper stacking and positioning.',
  tags: ['chart', 'waterfall', 'cumulative', 'financial', 'variance'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: '{ data: string[] } - Category labels',
    series: 'Array<{ data: (number | { value: number, isTotal?: boolean })[] }> - Values for each category',
    width: 'number',
    height: 'number',
  },
  exampleUsage: `
    <WaterfallChart
      title="Quarterly Revenue Analysis"
      series={[{
        data: [
          100,    // Starting value
          20,     // Q1 increase
          -15,    // Q2 decrease
          30,     // Q3 increase
          -10,    // Q4 decrease
          { value: 125, isTotal: true }  // Final total
        ]
      }]}
      xAxis={{ data: ['Start', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'] }}
    />
  `,
};
