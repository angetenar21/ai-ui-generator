import React, { useState } from 'react';

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  icon?: string;
  description?: string;
}

interface MindMapProps {
  title?: string;
  data: MindMapNode;
  onNodeClick?: (node: MindMapNode) => void;
  layout?: 'radial' | 'tree';
}

const MindMap: React.FC<MindMapProps> = ({
  title,
  data,
  onNodeClick,
  layout = 'radial',
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([data.id])
  );
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderTreeLayout = (
    node: MindMapNode,
    level: number = 0,
    isRoot: boolean = true
  ) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.id;

    return (
      <div key={node.id} className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          {/* Node */}
          <div
            onClick={() => {
              if (hasChildren) toggleNode(node.id);
              onNodeClick?.(node);
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`
              relative
              ${isRoot ? 'px-6 py-4 rounded-xl' : 'px-4 py-3 rounded-lg'}
              ${node.color || 'bg-blue-600'}
              ${isHovered ? 'ring-4 ring-blue-400/50 scale-105' : ''}
              transition-all duration-200 cursor-pointer
              shadow-lg
            `}
          >
            <div className="flex items-center gap-2">
              {node.icon && (
                <span className="text-white text-lg">{node.icon}</span>
              )}
              <span
                className={`text-white font-semibold ${
                  isRoot ? 'text-lg' : 'text-sm'
                }`}
              >
                {node.label}
              </span>
              {hasChildren && (
                <svg
                  className={`w-4 h-4 text-white transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>

            {isHovered && node.description && (
              <div className="absolute top-full left-0 mt-2 z-50 w-64">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                  <p className="text-sm text-gray-300">{node.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Connector line */}
          {hasChildren && isExpanded && (
            <div className="w-0.5 h-8 bg-gray-600" />
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="flex-1 space-y-6 pt-2">
            {node.children!.map((child) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector */}
                <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-gray-600 -translate-x-4" />
                {renderTreeLayout(child, level + 1, false)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRadialLayout = (
    node: MindMapNode,
    level: number = 0,
    _angle: number = 0,
    _angleSpan: number = 360
  ) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.id;
    const childCount = node.children?.length || 0;

    if (level === 0) {
      // Root node in center
      return (
        <div className="relative flex items-center justify-center min-h-[600px]">
          <div
            onClick={() => {
              if (hasChildren) toggleNode(node.id);
              onNodeClick?.(node);
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`
              px-8 py-6 rounded-xl
              ${node.color || 'bg-gradient-to-br from-blue-600 to-purple-600'}
              ${isHovered ? 'ring-4 ring-blue-400/50 scale-110' : ''}
              transition-all duration-200 cursor-pointer
              shadow-2xl z-10
            `}
          >
            <div className="flex items-center gap-3">
              {node.icon && (
                <span className="text-white text-2xl">{node.icon}</span>
              )}
              <span className="text-white font-bold text-xl">
                {node.label}
              </span>
            </div>
          </div>

          {/* Render children in a circle */}
          {hasChildren && isExpanded && (
            <>
              {node.children!.map((child, index) => {
                const childAngle = (index / childCount) * 360;
                const radius = 250;
                const x = Math.cos((childAngle * Math.PI) / 180) * radius;
                const y = Math.sin((childAngle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={child.id}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    {/* Connection line */}
                    <svg
                      className="absolute top-1/2 left-1/2 pointer-events-none"
                      style={{
                        width: Math.abs(x) + 100,
                        height: Math.abs(y) + 100,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <line
                        x1="50%"
                        y1="50%"
                        x2={x > 0 ? '0%' : '100%'}
                        y2={y > 0 ? '0%' : '100%'}
                        stroke="#4B5563"
                        strokeWidth="2"
                      />
                    </svg>

                    <div
                      onClick={() => {
                        onNodeClick?.(child);
                      }}
                      onMouseEnter={() => setHoveredNode(child.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`
                        px-4 py-3 rounded-lg
                        ${child.color || 'bg-gray-700'}
                        ${hoveredNode === child.id ? 'ring-2 ring-blue-400 scale-105' : ''}
                        transition-all duration-200 cursor-pointer
                        shadow-lg whitespace-nowrap
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {child.icon && (
                          <span className="text-white">{child.icon}</span>
                        )}
                        <span className="text-white font-medium text-sm">
                          {child.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="glass-dark border border-gray-700/50 rounded-2xl p-6 my-4">
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
        </div>
      )}

      <div className="overflow-auto">
        {layout === 'radial' ? (
          renderRadialLayout(data)
        ) : (
          <div className="p-8">{renderTreeLayout(data)}</div>
        )}
      </div>
    </div>
  );
};

export default MindMap;

export const metadata = {
  name: 'mind-map',
  category: 'data-display' as const,
  component: MindMap,
  description: 'Interactive mind map visualization with expandable nodes',
  tags: ['mindmap', 'diagram', 'visualization', 'hierarchy', 'brainstorm'],
  propTypes: {
    title: 'string',
    data: 'MindMapNode',
    onNodeClick: '(node: MindMapNode) => void',
    layout: "'radial' | 'tree'",
  },
};
