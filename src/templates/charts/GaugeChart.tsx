import React, { useRef, useState, useEffect } from 'react';
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
  innerRadius = '60%',
  outerRadius = '90%',
  width: propWidth,
  height: propHeight = 90,
  text,
  color: propColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 120, height: propHeight });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // For gauge charts, scale proportionally but keep compact
        const width = Math.min(Math.max(100, containerWidth - 24), 200);
        const height = Math.round(width * 0.75); // Maintain aspect ratio
        setChartSize({ width, height: Math.min(height, propHeight) });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [propWidth, propHeight]);
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

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gaugeStyles = {
    valueText: isDarkMode ? '#F3F4F6' : '#111827',
    referenceArc: isDarkMode ? '#374151' : '#E5E7EB',
  };

  return (
    <div className="w-full max-w-full bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {(title || description) && (
        <div className="mb-1 text-center">
          {title && (
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={containerRef} className="flex flex-col justify-center items-center overflow-hidden w-full">
        <Gauge
          value={gaugeValue}
          valueMin={valueMin}
          valueMax={valueMax}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          width={chartSize.width}
          height={chartSize.height}
          text={`${gaugeValue}%`}
          sx={{
            '& .MuiGauge-valueText': {
              fontSize: 14,
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
          <p className="text-gray-500 dark:text-gray-400 text-[10px] text-center truncate w-full">{displayText}</p>
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
