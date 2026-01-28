import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
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
  width: _width,
  height = 400,
}) => {

  // Validate series
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6">
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
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">Invalid series data format</p>
        </div>
      </div>
    );
  }

  // Transform data for polar area chart (radar chart)
  let chartData: any[] = [];

  // Create consistent series keys
  const seriesKeys = validSeries.map((s, idx) => s.name || `Series ${idx + 1}`);

  if (categories.length > 0) {
    // Use provided categories
    chartData = categories.map((category, index) => {
      const dataPoint: any = {
        subject: category, // Radar chart uses 'subject' for category names
      };

      validSeries.forEach((s, seriesIdx) => {
        const value = s.data[index];
        // Ensure we have a valid number, default to 0 if NaN or undefined
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
        subject: `Category ${index + 1}`,
      };

      validSeries.forEach((s, seriesIdx) => {
        const value = s.data[index];
        const numValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, value) : 0;
        dataPoint[seriesKeys[seriesIdx]] = numValue;
      });

      return dataPoint;
    });
  }

  // Calculate max value for domain
  const allValues: number[] = [];
  chartData.forEach((point) => {
    seriesKeys.forEach((key) => {
      const val = point[key];
      if (typeof val === 'number' && !isNaN(val)) {
        allValues.push(val);
      }
    });
  });
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
  const domainMax = Math.ceil(maxValue * 1.1); // Add 10% padding

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6">
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
        const gridStroke = isDarkMode ? '#374151' : '#E5E7EB';
        const textColor = isDarkMode ? '#D1D5DB' : '#6B7280';
        const axisStroke = isDarkMode ? '#6B7280' : '#9CA3AF';
        const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
        const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
        const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';

        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="75%"
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            >
              <PolarGrid stroke={gridStroke} strokeWidth={1} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: textColor,
                  fontSize: 13,
                  fontWeight: 500,
                }}
                stroke={axisStroke}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, domainMax]}
                tick={{
                  fill: textColor,
                  fontSize: 11,
                }}
                stroke={axisStroke}
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
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '16px',
                }}
                formatter={(value) => (
                  <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>
                    {value}
                  </span>
                )}
                iconType="circle"
              />
              {validSeries.map((s, index) => {
                const seriesKey = seriesKeys[index];
                const fillColor = getColor(s.color, index);

                return (
                  <Radar
                    key={`radar-${index}`}
                    name={seriesKey}
                    dataKey={seriesKey}
                    stroke={fillColor}
                    fill={fillColor}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                );
              })}
            </RadarChart>
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
