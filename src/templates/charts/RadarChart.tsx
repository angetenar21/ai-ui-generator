import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarChartPropsOld {
  /** Chart title */
  title?: string;

  /** Data for radar chart (Recharts format) */
  data: Array<{
    subject: string;
    [key: string]: string | number;
  }>;

  /** Data keys to plot */
  dataKeys: Array<{
    key: string;
    name?: string;
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Show grid */
  showGrid?: boolean;
}

interface RadarChartPropsNew {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Axes definitions with names and domains */
  axes: Array<{
    name: string;
    domain?: [number, number];
  }>;

  /** Series data with values for each axis */
  series: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Show grid */
  showGrid?: boolean;
}

interface RadarChartPropsIndicator {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Indicator definitions (alternative to axes) */
  indicator: Array<{
    name: string;
    max: number;
    min?: number;
  }>;

  /** Series data with values or objects */
  series: Array<{
    name: string;
    value: number[];
    color?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Show grid */
  showGrid?: boolean;
}

type RadarChartProps = RadarChartPropsOld | RadarChartPropsNew | RadarChartPropsIndicator;

const RadarChart: React.FC<RadarChartProps> = (props) => {
  const {
    title,
    height = 400,
    legend = true,
    showGrid = true,
  } = props;

  // Transform new format (axes + series) to Recharts format (data + dataKeys)
  let data: Array<{ subject: string; [key: string]: string | number }>;
  let dataKeys: Array<{ key: string; name?: string; color?: string }>;
  let description: string | undefined;

  // Check which format is being used
  if ('indicator' in props && 'series' in props) {
    // Indicator format: indicator + series with value arrays
    const { indicator, series } = props;
    description = 'description' in props ? props.description : undefined;

    // Validate indicator format
    if (!indicator || !Array.isArray(indicator) || indicator.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No indicators defined for radar chart</p>
          </div>
        </div>
      );
    }

    if (!series || !Array.isArray(series) || series.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No series data for radar chart</p>
          </div>
        </div>
      );
    }

    // Transform indicator + series to Recharts format
    data = indicator.map((ind, indIndex) => {
      const dataPoint: { subject: string; [key: string]: string | number } = {
        subject: ind.name,
      };

      // Add each series value for this indicator
      series.forEach((s) => {
        const value = s.value ? s.value[indIndex] : (s as any).data?.[indIndex];
        dataPoint[s.name] = value || 0;
      });

      return dataPoint;
    });

    // Create dataKeys from series
    dataKeys = series.map((s) => ({
      key: s.name,
      name: s.name,
      color: s.color,
    }));
  } else if ('axes' in props && 'series' in props) {
    // New format: axes + series
    const { axes, series } = props;
    description = 'description' in props ? props.description : undefined;

    // Validate new format
    if (!axes || !Array.isArray(axes) || axes.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No axes defined for radar chart</p>
          </div>
        </div>
      );
    }

    if (!series || !Array.isArray(series) || series.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No series data for radar chart</p>
          </div>
        </div>
      );
    }

    // Transform axes + series to Recharts format
    data = axes.map((axis, axisIndex) => {
      const dataPoint: { subject: string; [key: string]: string | number } = {
        subject: axis.name,
      };

      // Add each series value for this axis
      series.forEach((s) => {
        dataPoint[s.name] = s.data[axisIndex] || 0;
      });

      return dataPoint;
    });

    // Create dataKeys from series
    dataKeys = series.map((s) => ({
      key: s.name,
      name: s.name,
      color: s.color,
    }));
  } else if ('data' in props && 'dataKeys' in props) {
    // Old format: data + dataKeys
    data = props.data;
    dataKeys = props.dataKeys;

    // Validate old format
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No data available for radar chart</p>
          </div>
        </div>
      );
    }

    if (!dataKeys || !Array.isArray(dataKeys) || dataKeys.length === 0) {
      return (
        <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">No data keys specified for radar chart</p>
          </div>
        </div>
      );
    }
  } else {
    // Invalid format
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
        <div className="text-center text-gray-400">
          <p className="text-sm">Invalid radar chart configuration</p>
          <p className="text-xs mt-2">Expected either (data + dataKeys), (axes + series), or (indicator + series)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
      {title && (
        <h3 className="text-xl font-display font-semibold text-text-primary mb-4 text-center">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">
          {description}
        </p>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          {showGrid && <PolarGrid stroke="#374151" />}
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#374151', fontSize: 13 }}
            stroke="#9ca3af"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'auto']}
            tick={{ fill: '#374151', fontSize: 10 }}
            stroke="#9ca3af"
          />

          {dataKeys.map((dk, index) => (
            <Radar
              key={dk.key}
              name={dk.name || dk.key}
              dataKey={dk.key}
              stroke={dk.color || `hsl(${(index * 360) / dataKeys.length}, 70%, 60%)`}
              fill={dk.color || `hsl(${(index * 360) / dataKeys.length}, 70%, 60%)`}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}

          {legend && (
            <Legend
              wrapperStyle={{ color: '#d1d5db', fontSize: '14px' }}
              iconType="circle"
            />
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#d1d5db',
            }}
            labelStyle={{ color: '#111827' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'radar-chart',
  category: 'charts' as const,
  component: RadarChart,
  description: 'Radar chart for comparing multiple variables across different categories. Supports three formats: (1) indicator + series, (2) axes + series, or (3) data + dataKeys',
  tags: ['chart', 'radar', 'spider', 'multivariate', 'comparison', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    // Indicator format (ECharts-style)
    indicator: 'Array<{ name: string, max: number, min?: number }>',
    // Axes format
    axes: 'Array<{ name: string, domain?: [number, number] }>',
    // Series (used with indicator or axes)
    series: 'Array<{ name: string, value?: number[], data?: number[], color?: string }>',
    // Old format (still supported)
    data: 'Array<{ subject: string, [key: string]: string | number }>',
    dataKeys: 'Array<{ key, name?, color? }>',
    // Common properties
    width: 'number',
    height: 'number',
    legend: 'boolean',
    showGrid: 'boolean',
  },
};
