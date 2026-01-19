import React from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Legend,
  Tooltip,
  PolarRadiusAxis,
} from 'recharts';

interface PolarChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Angle axis configuration */
  angleAxis?: {
    data: string[];
  } | string[];

  /** Radius axis configuration */
  radiusAxis?: any;

  /** Series data for polar chart */
  series: Array<{
    name?: string;
    type?: string;
    data: number[];
    coordinateSystem?: string;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

// Color palette - semantic colors that work well in both light and dark modes
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

// Validate if a color is a valid hex color
const isValidColor = (color: string | undefined): color is string => {
  if (!color) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Get color from palette or validate provided color
const getColor = (providedColor: string | undefined, index: number): string => {
  if (isValidColor(providedColor)) {
    return providedColor;
  }
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

const PolarChart: React.FC<PolarChartProps> = ({
  title,
  description,
  angleAxis,
  series,
  width = 800,
  height = 400,
}) => {
  void (width); // Width prop available for future use

  // Validate series
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No series data for polar chart</p>
        </div>
      </div>
    );
  }

  // Normalize angleAxis to array format
  let categories: string[] = [];
  if (angleAxis) {
    if (Array.isArray(angleAxis)) {
      // Direct array format
      categories = angleAxis.filter((item): item is string => typeof item === 'string');
    } else if (angleAxis.data && Array.isArray(angleAxis.data)) {
      // Object format with data property
      categories = angleAxis.data.filter((item): item is string => typeof item === 'string');
    }
  }

  // Validate series data
  const validSeries = series.filter(
    (s) => s.data && Array.isArray(s.data) && s.data.length > 0
  );

  if (validSeries.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">Invalid series data format</p>
        </div>
      </div>
    );
  }

  // Transform data for radial bar chart
  let chartData: any[] = [];

  // Create consistent series keys
  const seriesKeys = validSeries.map((s, idx) => s.name || `Series ${idx + 1}`);

  if (categories.length > 0) {
    // Use provided categories
    chartData = categories.map((category, index) => {
      const dataPoint: any = {
        name: category,
      };

      validSeries.forEach((s, seriesIdx) => {
        const value = s.data[index];
        const numValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, value) : 0;
        dataPoint[seriesKeys[seriesIdx]] = numValue;
      });

      return dataPoint;
    });
  } else {
    // Generate categories from data length
    const dataLength = Math.max(...validSeries.map((s) => s.data.length));
    chartData = Array.from({ length: dataLength }, (_, index) => {
      const dataPoint: any = {
        name: `Category ${index + 1}`,
      };

      validSeries.forEach((s, seriesIdx) => {
        const value = s.data[index];
        const numValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, value) : 0;
        dataPoint[seriesKeys[seriesIdx]] = numValue;
      });

      return dataPoint;
    });
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">{description}</p>
      )}
      {(() => {
        const isDarkMode =
          typeof window !== 'undefined' &&
          document.documentElement.classList.contains('dark');

        // Theme colors
        const textColor = isDarkMode ? '#E5E7EB' : '#6B7280';
        const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
        const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
        const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';
        const bgFill = isDarkMode ? '#111827' : '#F9FAFB';
        const axisFill = isDarkMode ? '#6B7280' : '#9CA3AF';

        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="15%"
              outerRadius="85%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <PolarAngleAxis
                type="category"
                dataKey="name"
                tick={{
                  fill: textColor,
                  fontSize: 12,
                  fontWeight: 500,
                }}
                stroke={axisFill}
                strokeOpacity={0.5}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 'auto']}
                tick={{
                  fill: axisFill,
                  fontSize: 11,
                }}
                stroke={axisFill}
                strokeOpacity={0.3}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText,
                  fontSize: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend
                wrapperStyle={{
                  color: textColor,
                  fontSize: '12px',
                  paddingTop: '20px',
                }}
                iconType="circle"
              />
              {validSeries.map((s, index) => {
                const seriesKey = s.name || `Series ${index + 1}`;
                return (
                  <RadialBar
                    key={`radial-${index}`}
                    name={seriesKey}
                    dataKey={seriesKey}
                    fill={getColor(s.color, index)}
                    background={{
                      fill: bgFill,
                      opacity: 0.3,
                    }}
                    cornerRadius={6}
                    isAnimationActive={true}
                  />
                );
              })}
            </RadialBarChart>
          </ResponsiveContainer>
        );
      })()}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
        Polar area chart with {validSeries.length} series
      </div>
    </div>
  );
};

export default PolarChart;

export const metadata = {
  name: 'polar-chart',
  category: 'charts' as const,
  component: PolarChart,
  description: 'Polar coordinate chart. Displays data in radial bar format.',
  tags: ['chart', 'polar', 'radial', 'circular'],
  propTypes: {
    title: 'string',
    description: 'string',
    angleAxis: '{ data: string[] }',
    radiusAxis: 'any',
    series: 'Array<{ name?, type?, data: number[], coordinateSystem?, color? }>',
    width: 'number',
    height: 'number',
  },
};
