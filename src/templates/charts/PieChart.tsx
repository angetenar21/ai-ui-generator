import React from 'react';
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
  width = 280,
  height = 250,
  legend = true,
  margin = { top: 10, right: 10, bottom: 50, left: 10 },
}) => {
  return (
    <div className="w-full overflow-hidden">
      {(title || description) && (
        <div className="mb-3">
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

      <div className="w-full flex flex-col items-center overflow-hidden">
        <MuiPieChart
          series={series}
          width={width}
          height={height}
          margin={margin}
          slotProps={{
            legend: legend
              ? {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: { top: 10 },
                  itemMarkWidth: 10,
                  itemMarkHeight: 10,
                  markGap: 5,
                  itemGap: 12,
                }
              : undefined,
          }}
          sx={{
            '& .MuiChartsLegend-series text': {
              fill: '#374151 !important',
              fontSize: '11px',
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
