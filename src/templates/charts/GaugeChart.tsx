import React, { useRef, useState, useEffect } from 'react';

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

  const displayText = text || seriesLabel || '';

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#F3F4F6' : '#111827';
  const labelColor = isDarkMode ? '#9CA3AF' : '#6B7280';

  // Calculate appropriate height
  const chartHeight = propHeight || Math.min(200, containerWidth * 0.6);
  const chartWidth = containerWidth;

  // Create segments from levels or colorStops
  const segments: Array<{ startValue: number; endValue: number; color: string }> = [];

  if (levels && levels.length > 0) {
    // Sort levels by value
    const sortedLevels = [...levels].sort((a, b) => a.value - b.value);

    // Create segments between each level
    for (let i = 0; i < sortedLevels.length; i++) {
      const startValue = i === 0 ? valueMin : sortedLevels[i - 1].value;
      const endValue = sortedLevels[i].value;
      segments.push({
        startValue,
        endValue,
        color: sortedLevels[i].color,
      });
    }

    // Add final segment if needed
    if (sortedLevels[sortedLevels.length - 1].value < valueMax) {
      segments.push({
        startValue: sortedLevels[sortedLevels.length - 1].value,
        endValue: valueMax,
        color: sortedLevels[sortedLevels.length - 1].color,
      });
    }
  } else if (colorStops.length > 0) {
    // Sort color stops by offset
    const sortedStops = [...colorStops].sort((a, b) => a.offset - b.offset);

    for (let i = 0; i < sortedStops.length; i++) {
      const startValue = i === 0 ? valueMin : sortedStops[i - 1].offset;
      const endValue = sortedStops[i].offset;
      segments.push({
        startValue,
        endValue,
        color: sortedStops[i].color,
      });
    }

    if (sortedStops[sortedStops.length - 1].offset < valueMax) {
      segments.push({
        startValue: sortedStops[sortedStops.length - 1].offset,
        endValue: valueMax,
        color: sortedStops[sortedStops.length - 1].color,
      });
    }
  } else {
    // Default single color segment
    segments.push({
      startValue: valueMin,
      endValue: valueMax,
      color: propColor || '#F97316',
    });
  }

  // Helper function to create arc path
  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngleDeg: number,
    endAngleDeg: number
  ) => {
    const startAngleRad = (startAngleDeg * Math.PI) / 180;
    const endAngleRad = (endAngleDeg * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startAngleRad);
    const startY = centerY + radius * Math.sin(startAngleRad);
    const endX = centerX + radius * Math.cos(endAngleRad);
    const endY = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // SVG dimensions and positioning
  const centerX = chartWidth / 2;
  const centerY = chartHeight * 0.75;
  const maxRadius = Math.min(chartWidth, chartHeight * 1.5) * 0.4;

  const outerRadiusValue = maxRadius * (parseFloat(outerRadius) / 100);
  const innerRadiusValue = maxRadius * (parseFloat(innerRadius) / 100);
  const strokeWidth = outerRadiusValue - innerRadiusValue;
  const arcRadius = (outerRadiusValue + innerRadiusValue) / 2;

  // Calculate needle angle
  const valueRange = valueMax - valueMin;
  const angleRange = endAngle - startAngle;
  const needleAngle = startAngle + ((gaugeValue - valueMin) / valueRange) * angleRange;
  const needleLength = arcRadius * 0.85;
  const needleAngleRad = (needleAngle * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Generate tick marks
  const ticks = [0, 20, 40, 60, 80, 100];
  const tickElements = ticks.map((tickValue) => {
    const tickAngle = startAngle + ((tickValue - valueMin) / valueRange) * angleRange;
    const tickAngleRad = (tickAngle * Math.PI) / 180;
    const tickRadius = outerRadiusValue + 10;
    const tickX = centerX + tickRadius * Math.cos(tickAngleRad);
    const tickY = centerY + tickRadius * Math.sin(tickAngleRad);

    return (
      <text
        key={tickValue}
        x={tickX}
        y={tickY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={labelColor}
        fontSize="12"
        fontWeight="500"
      >
        {tickValue}
      </text>
    );
  });

  return (
    <div
      ref={containerRef}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      {(title || description) && (
        <div className="mb-3 text-center">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
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

      <div className="flex flex-col justify-center items-center w-full">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Render colored segments */}
          {segments.map((segment, index) => {
            const segmentStartAngle = startAngle + ((segment.startValue - valueMin) / valueRange) * angleRange;
            const segmentEndAngle = startAngle + ((segment.endValue - valueMin) / valueRange) * angleRange;

            return (
              <path
                key={index}
                d={createArcPath(centerX, centerY, arcRadius, segmentStartAngle, segmentEndAngle)}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}

          {/* Tick marks */}
          {tickElements}

          {/* Needle */}
          <g>
            {/* Needle shadow for depth */}
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX + 2}
              y2={needleY + 2}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle */}
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle center circle */}
            <circle cx={centerX} cy={centerY} r="6" fill="#000000" />
            <circle cx={centerX} cy={centerY} r="3" fill="#FFFFFF" />
          </g>

          {/* Value text */}
          <text
            x={centerX}
            y={centerY + 35}
            textAnchor="middle"
            fill={textColor}
            fontSize="28"
            fontWeight="bold"
          >
            {gaugeValue}{text ? '' : '%'}
          </text>
        </svg>

        {displayText && (
          <p className="text-gray-500 dark:text-gray-400 text-xs text-center mt-2">
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
