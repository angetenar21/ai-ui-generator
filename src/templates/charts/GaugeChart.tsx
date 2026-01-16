import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

interface ColorStop {
  offset: number;
  color: string;
}

interface GaugeChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Current value - can be direct number or from series */
  value?: number;

  /** Series data format [{ data: [value], label?, colorStops? }] */
  series?: Array<{
    data?: number[];
    label?: string;
    colorStops?: ColorStop[];
  }>;

  /** Minimum value */
  valueMin?: number;

  /** Maximum value */
  valueMax?: number;

  /** Start angle in degrees */
  startAngle?: number;

  /** End angle in degrees */
  endAngle?: number;

  /** Inner radius percentage */
  innerRadius?: string;

  /** Outer radius percentage */
  outerRadius?: string;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Value label text */
  text?: string;

  /** Color of the gauge arc */
  color?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  description,
  value: propValue,
  series,
  valueMin = 0,
  valueMax = 100,
  startAngle = -90,
  endAngle = 90,
  innerRadius = '65%',
  outerRadius = '95%',
  width = 150,
  height = 120,
  text,
  color: propColor,
}) => {
  // Extract value from series if available, otherwise use direct prop
  let gaugeValue = propValue || 0;
  let seriesLabel = '';
  let colorStops: ColorStop[] = [];

  if (series && Array.isArray(series) && series.length > 0) {
    const firstSeries = series[0];
    if (firstSeries.data && Array.isArray(firstSeries.data) && firstSeries.data.length > 0) {
      gaugeValue = firstSeries.data[0];
    }
    seriesLabel = firstSeries.label || '';
    colorStops = firstSeries.colorStops || [];
  }

  // Determine gauge color based on colorStops or prop
  let gaugeColor = propColor || '#F97316';
  if (colorStops.length > 0) {
    // Find the appropriate color based on value and offset
    const applicableStop = colorStops
      .filter(stop => stop.offset <= gaugeValue)
      .sort((a, b) => b.offset - a.offset)[0];
    if (applicableStop) {
      gaugeColor = applicableStop.color;
    }
  }

  const displayText = text || seriesLabel || '';

  return (
    <div className="card rounded-card p-4 hover:shadow-hover transition-all duration-300 overflow-hidden">
      {(title || description) && (
        <div className="mb-2 text-center">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col justify-center items-center overflow-hidden">
        <Gauge
          value={gaugeValue}
          valueMin={valueMin}
          valueMax={valueMax}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          width={width}
          height={height}
          text={`${gaugeValue}%`}
          sx={{
            '& .MuiGauge-valueText': {
              fontSize: 18,
              fill: '#111827',
              fontWeight: 600,
            },
            '& .MuiGauge-valueArc': {
              fill: gaugeColor,
            },
            '& .MuiGauge-referenceArc': {
              fill: '#E5E7EB',
            },
          }}
        />
        {displayText && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 text-center">{displayText}</p>
        )}
      </div>
    </div>
  );
};

export default GaugeChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'gauge-chart',
  category: 'charts' as const,
  component: GaugeChart,
  description: 'Gauge chart for displaying a single value within a range, useful for KPIs and metrics',
  tags: ['chart', 'gauge', 'meter', 'kpi', 'metric', 'data-visualization'],
  propTypes: {
    title: 'string',
    value: 'number',
    valueMin: 'number',
    valueMax: 'number',
    startAngle: 'number',
    endAngle: 'number',
    innerRadius: 'string',
    outerRadius: 'string',
    width: 'number',
    height: 'number',
    text: 'string',
    color: 'string',
  },
};
