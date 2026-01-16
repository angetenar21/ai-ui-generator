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
  height: propHeight = 200,
  legend = true,
  margin = { top: 5, right: 5, bottom: 40, left: 5 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: propWidth || 220, height: propHeight });

  useEffect(() => {
    const updateSize = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = propWidth || 260;

      // Keep width within the container while avoiding tiny renders
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

      <div ref={containerRef} className="w-full flex justify-center items-center overflow-hidden">
        <MuiPieChart
          series={series}
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
