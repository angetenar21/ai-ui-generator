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
  width = 400,
  height = 350,
  legend = true,
  margin = { top: 20, right: 20, bottom: 60, left: 20 },
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {(title || description) && (
        <div className="mb-4 px-2">
          {title && (
            <h3 className="text-lg font-display font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
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
                padding: { top: 20 },
                itemMarkWidth: 12,
                itemMarkHeight: 12,
                markGap: 6,
                itemGap: 16,
              }
              : undefined,
          }}
          sx={{
            '& .MuiChartsLegend-series text': {
              fill: 'currentColor',
              fontSize: '13px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 3,
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
