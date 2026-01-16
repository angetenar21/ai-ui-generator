import React, { useRef, useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface DonutChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Series data for donut slices */
  data: Array<{
    id: string | number;
    value: number;
    label?: string;
    color?: string;
  }>;

  /** Inner radius percentage (creates the donut hole) */
  innerRadius?: number;

  /** Outer radius */
  outerRadius?: number;

  /** Padding angle between slices */
  paddingAngle?: number;

  /** Corner radius for slices */
  cornerRadius?: number;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Show center label */
  centerLabel?: string;

  /** Margin around chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  description,
  data,
  innerRadius = 40,
  outerRadius = 70,
  paddingAngle = 2,
  cornerRadius = 3,
  width: propWidth,
  height: propHeight = 200,
  legend = true,
  centerLabel,
  margin = { top: 5, right: 5, bottom: 40, left: 5 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 220, height: propHeight });

  useEffect(() => {
    const updateSize = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = propWidth || 260;

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = propWidth ? Math.min(propWidth, maxWidth) : maxWidth;
      }

      const minWidth = typeof maxWidth === 'number' ? Math.min(180, maxWidth) : 180;
      const maxWidthClamp = typeof maxWidth === 'number' ? maxWidth : 640;

      const resolvedWidth = Math.max(minWidth, Math.min(nextWidth, maxWidthClamp));
      const resolvedHeight = propHeight ? Math.max(propHeight, resolvedWidth) : resolvedWidth;

      setChartSize({ width: resolvedWidth, height: resolvedHeight });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [propWidth, propHeight]);

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const legendTextColor = isDarkMode ? '#D1D5DB' : '#374151';

  return (
    <div className="w-full max-w-full overflow-hidden">
      {(title || description) && (
        <div className="mb-2 px-1">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={containerRef} className="w-full flex justify-center items-center relative overflow-hidden">
        <PieChart
          series={[
            {
              data,
              innerRadius,
              outerRadius,
              paddingAngle,
              cornerRadius,
            },
          ]}
          width={chartSize.width}
          height={chartSize.height}
          margin={margin}
          slotProps={{
            legend: legend
              ? {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: { top: 5 },
                  itemMarkWidth: 8,
                  itemMarkHeight: 8,
                  markGap: 4,
                  itemGap: 8,
                }
              : undefined,
          }}
          sx={{
            maxWidth: '100%',
            '& .MuiChartsLegend-series text': {
              fill: `${legendTextColor} !important`,
              fontSize: '10px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 2,
            },
          }}
        />
        {centerLabel && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{centerLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'donut-chart',
  category: 'charts' as const,
  component: DonutChart,
  description: 'Donut chart (pie chart with center hole) for displaying proportional data with optional center label',
  tags: ['chart', 'donut', 'pie', 'proportion', 'percentage', 'data-visualization'],
  propTypes: {
    title: 'string',
    data: 'Array<{ id, value, label?, color? }>',
    innerRadius: 'number',
    outerRadius: 'number',
    paddingAngle: 'number',
    cornerRadius: 'number',
    width: 'number',
    height: 'number',
    legend: 'boolean',
    centerLabel: 'string',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
