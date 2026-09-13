import React from 'react';
import type { SurfaceVariant, ElevationLevel } from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses } from '@/theme/designTokens';

interface ChordChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** Node definitions */
  nodes: Array<{
    name: string;
}>;

  /** Relationship matrix */
  matrix: number[][];

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const ChordChart: React.FC<ChordChartProps> = ({
  title,
  description,
  nodes,
  matrix,
  width: _width,
  height: _height,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  // Detect dark mode
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  // Validate
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-zinc-400">
          <p className="text-sm">No nodes data for chord chart</p>
        </div>
      </div>
    );
  }

  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-zinc-400">
          <p className="text-sm">No matrix data for chord chart</p>
        </div>
      </div>
    );
  }

  // Display as a relationship table/matrix
  const getColor = (value: number, maxValue: number): string => {
    if (value === 0) return isDarkMode ? '#1f2937' : '#f3f4f6';
    const intensity = maxValue === 0 ? 0.5 : value / maxValue;
    const hue = 250; // Purple hue
    const lightness = isDarkMode ? 50 + intensity * 30 : 85 - intensity * 40;
    return `hsla(${hue}, 70%, ${lightness}%, ${0.3 + intensity * 0.7})`;
  };

  const maxValue = Math.max(...matrix.flat());

  return (
    <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
      {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-zinc-400 mb-4 text-center">{description}</p>
      )}

      <div className="overflow-auto" style={{ maxWidth: '100%' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={`border p-2 font-semibold sticky left-0 ${isDarkMode ? 'border-zinc-600 bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-100 text-zinc-700'}`}></th>
              {nodes.map((node, i) => (
                <th
                  key={i}
                  className={`border p-2 font-semibold ${isDarkMode ? 'border-zinc-600 bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-100 text-zinc-700'}`}
                  style={{ minWidth: 80 }}
                >
                  {node.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className={`border p-2 font-semibold sticky left-0 ${isDarkMode ? 'border-zinc-600 bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-100 text-zinc-700'}`}>
                  {nodes[i]?.name || `Node ${i}`}
                </td>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className={`border p-2 text-center font-medium ${isDarkMode ? 'border-zinc-600 text-white' : 'border-zinc-200 text-zinc-800'}`}
                    style={{
                      backgroundColor: getColor(value, maxValue),
                      cursor: 'pointer',
                    }}
                    title={`${nodes[i]?.name} → ${nodes[j]?.name}: ${value}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-zinc-400 text-center mt-4">
        Relationship matrix - darker colors indicate stronger connections
      </div>

      {/* Node legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: `hsl(${(i * 360) / nodes.length}, 70%, 60%)`,
              }}
            />
            <span className="text-xs text-zinc-400">{node.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordChart;

export const metadata = {
  name: 'chord-chart',
  category: 'charts' as const,
  component: ChordChart,
  description: 'Chord diagram for showing relationships between nodes. Displayed as matrix table.',
  tags: ['chart', 'chord', 'network', 'relationships', 'matrix'],
  propTypes: {
    title: 'string',
    description: 'string',
    nodes: 'Array<{ name }>',
    matrix: 'number[][]',
    width: 'number',
    height: 'number',
  },
};
