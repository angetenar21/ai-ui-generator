import React, { useRef, useState, useEffect } from 'react';
import { Gauge } from '@mui/x-charts/Gauge';
import { getSurfaceClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel } from '../core/types';

interface ColorLevel {
  value: number;
  color: string;
}

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

  /** Color levels for threshold-based coloring */
  levels?: ColorLevel[];

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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  description,
  value: propValue,
  series,
  levels,
  valueMin = 0,
  valueMax = 100,
  startAngle = -90,
  endAngle = 90,
  innerRadius = '60%',
  outerRadius = '90%',
  width: propWidth,
  height: propHeight = 200,
  text,
  color: propColor,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(propWidth || 300);

  // Update container width on resize
  useEffect(() => {
    if (!propWidth) {
      const updateWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setContainerWidth(Math.max(200, Math.min(width - 48, 400)));
        }
      };

      updateWidth();
      const resizeObserver = new ResizeObserver(updateWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    } else {
      setContainerWidth(propWidth);
    }
  }, [propWidth]);

  // Extract value from series if available, otherwise use direct prop
  let gaugeValue = propValue ?? 0;
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

  // Ensure value is a valid number
  if (typeof gaugeValue !== 'number' || isNaN(gaugeValue)) {
    gaugeValue = 0;
  }

  // Clamp value within min/max range
  gaugeValue = Math.max(valueMin, Math.min(valueMax, gaugeValue));

  // Determine gauge color based on levels, colorStops, or prop
  let gaugeColor = propColor || '#10B981';

  // Check levels first (new format)
  if (levels && levels.length > 0) {
    const sortedLevels = [...levels].sort((a, b) => a.value - b.value);
    for (let i = sortedLevels.length - 1; i >= 0; i--) {
      if (gaugeValue >= sortedLevels[i].value) {
        gaugeColor = sortedLevels[i].color;
        break;
      }
    }
  }
  // Then check colorStops (series format)
  else if (colorStops.length > 0) {
    const applicableStop = colorStops
      .filter(stop => stop.offset <= gaugeValue)
      .sort((a, b) => b.offset - a.offset)[0];
    if (applicableStop) {
      gaugeColor = applicableStop.color;
    }
  }

  const displayText = text || seriesLabel || '';

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gaugeStyles = {
    valueText: isDarkMode ? '#F3F4F6' : '#111827',
    referenceArc: isDarkMode ? '#374151' : '#E5E7EB',
  };

  // Calculate appropriate height - default max to 400px or propHeight
  const chartHeight = propHeight || Math.min(400, containerWidth * 0.8);
  const chartWidth = containerWidth;

  return (
    <div
      ref={containerRef}
      className={`w-full ${getSurfaceClasses(variant, elevation)} rounded-xl p-4 transition-all duration-300`}
    >
      {(title || description) && (
        <div className="mb-3 text-center">
          {title && (
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col justify-center items-center w-full">
        <Gauge
          value={gaugeValue}
          valueMin={valueMin}
          valueMax={valueMax}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          width={chartWidth}
          height={chartHeight}
          text={({ value }) => `${value}${text ? '' : '%'}`}
          sx={{
            '& .MuiGauge-valueText': {
              fontSize: 18,
              fill: gaugeStyles.valueText,
              fontWeight: 600,
            },
            '& .MuiGauge-valueArc': {
              fill: gaugeColor,
            },
            '& .MuiGauge-referenceArc': {
              fill: gaugeStyles.referenceArc,
            },
          }}
        />
        {displayText && (
          <p className="text-zinc-500 dark:text-zinc-400 text-xs text-center mt-2">
            {displayText}
          </p>
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
    description: 'string',
    value: 'number',
    series: 'Array<{ data?: number[], label?: string, colorStops?: ColorStop[] }>',
    levels: 'Array<{ value: number, color: string }>',
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
