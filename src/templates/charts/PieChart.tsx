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

      children?: React.ReactNode;
      renderChild?: (child: any) => React.ReactNode;
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

  /** Optional CSS class names */
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  series,
  width: propWidth,
  height: propHeight = 300,
  legend = true,
  margin = { top: 10, right: 10, bottom: legend ? 80 : 10, left: 10 },
  className = '',
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
  const legendTextColor = isDarkMode ? '#E5E7EB' : '#374151';

  // Validation
  // Ensure we have at least one numeric value that isn't 0
  const hasValidData = series && series.length > 0 && series.some(s =>
    s.data && s.data.length > 0 && s.data.some((item: any) => item.value !== 0 && item.value !== null)
  );

  if (!hasValidData) {
    return (
      <div className={`${className || 'w-full h-full'} card rounded-card p-6`}>
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-center items-center min-h-[300px] text-gray-600 dark:text-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className || 'w-full h-full'} flex flex-col`}>
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

      <div ref={containerRef} className="flex-1 flex flex-col justify-center items-center w-full px-4 min-h-[300px]">
        <MuiPieChart
          series={series}
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
    className: 'string',
  },
};
