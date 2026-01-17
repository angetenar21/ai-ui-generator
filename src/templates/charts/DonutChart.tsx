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
  height: propHeight = 300,
  legend = true,
  centerLabel,
  margin = { top: 10, right: 10, bottom: legend ? 80 : 10, left: 10 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 400, height: propHeight });

  useEffect(() => {
    const updateSize = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;

      if (measuredWidth > 0) {
        // Use 90% of container width for better fit
        const availableWidth = measuredWidth - 32; // Account for padding
        const chartWidth = propWidth || Math.min(availableWidth, 500);
        // Add extra height for legend space
        const baseHeight = Math.min(chartWidth * 0.85, 400);
        const chartHeight = propHeight || (legend ? baseHeight + 60 : baseHeight);

        setChartSize({
          width: Math.max(250, chartWidth),
          height: Math.max(250, chartHeight)
        });
      }
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
    <div className="w-full h-full flex flex-col">
      {(title || description) && (
        <div className="mb-3 px-4 text-center">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={containerRef} className="flex-1 flex justify-center items-center w-full px-4 relative min-h-[300px]">
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
                  direction: 'horizontal' as const,
                  position: { vertical: 'bottom', horizontal: 'center' } as const,
                }
              : undefined,
          }}
          sx={{
            maxWidth: '100%',
            '& .MuiChartsLegend-root': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '16px',
            },
            '& .MuiChartsLegend-series': {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            },
            '& .MuiChartsLegend-series text': {
              fill: `${legendTextColor} !important`,
              fontSize: '12px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 2,
              width: '12px',
              height: '12px',
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
