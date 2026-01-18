import React from 'react';

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
}

const ChordChart: React.FC<ChordChartProps> = ({
  title,
  description,
  nodes,
  matrix,
  width = 800,
  height = 400,
}) => {
  void(width); // Width prop available for future use
  void(height); // Height prop available for future use
  // Validate
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No nodes data for chord chart</p>
        </div>
      </div>
    );
  }

  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No matrix data for chord chart</p>
        </div>
      </div>
    );
  }

  // Display as a relationship table/matrix
  const getColor = (value: number, maxValue: number): string => {
    if (value === 0) return '#1f2937';
    const intensity = maxValue === 0 ? 0.5 : value / maxValue;
    const hue = 250; // Purple hue
    return `hsla(${hue}, 70%, ${50 + intensity * 30}%, ${0.3 + intensity * 0.7})`;
  };

  const maxValue = Math.max(...matrix.flat());

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}

      <div className="overflow-auto" style={{ maxWidth: '100%' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-600 bg-gray-800 p-2 text-gray-300 font-semibold sticky left-0"></th>
              {nodes.map((node, i) => (
                <th
                  key={i}
                  className="border border-gray-600 bg-gray-800 p-2 text-gray-300 font-semibold"
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
                <td className="border border-gray-600 bg-gray-800 p-2 text-gray-300 font-semibold sticky left-0">
                  {nodes[i]?.name || `Node ${i}`}
                </td>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className="border border-gray-600 p-2 text-center text-white font-medium"
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

      <div className="text-xs text-gray-400 text-center mt-4">
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
            <span className="text-xs text-gray-400">{node.name}</span>
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
