import React, { useRef, useState, useEffect } from 'react';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';

interface PieChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Series data for pie slices */
  series: Array<{
    data: Array<{
      id: string | number;
      value: number;
      label?: string;
      color?: string;
    }>;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    cornerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    cx?: number;
    cy?: number;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Margin around chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  series,
  width: propWidth,
  height: propHeight = 300,
  legend = true,
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

      <div ref={containerRef} className="flex-1 flex justify-center items-center w-full px-4 min-h-[300px]">
        <MuiPieChart
          series={series}
          width={chartSize.width}
          height={chartSize.height}
          margin={margin}
          slotProps={{
            legend: legend
              ? {
                position: { vertical: 'bottom', horizontal: 'center' },
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
      </div>
    </div>
  );
};

export default PieChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'pie-chart',
  category: 'charts' as const,
  component: PieChart,
  description: 'Pie chart for showing proportional data distribution with support for donut style and custom styling',
  tags: ['chart', 'pie', 'donut', 'proportion', 'percentage', 'data-visualization'],
  propTypes: {
    title: 'string',
    series: 'Array<{ data, innerRadius?, outerRadius?, paddingAngle?, cornerRadius? }>',
    width: 'number',
    height: 'number',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
