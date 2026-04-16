import React, { useState } from 'react';

interface OrgNode {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  email?: string;
  phone?: string;
  department?: string;
  children?: OrgNode[];
}

interface OrgChartProps {
  title?: string;
  data: OrgNode;
  onNodeClick?: (node: OrgNode) => void;
  showDetails?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const OrgChart: React.FC<OrgChartProps> = ({
  title = 'Organization Chart',
  data,
  onNodeClick,
  showDetails = false,
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

  const renderNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.id;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div
          onClick={() => {
            onNodeClick?.(node);
            if (hasChildren) toggleNode(node.id);
          }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          className={`
            relative bg-white dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50
            rounded-2xl p-4 min-w-[240px] max-w-[280px]
            cursor-pointer transition-all duration-300
            shadow-md hover:shadow-lg
            ${isHovered ? 'border-orange-500 shadow-lg shadow-orange-500/20 -translate-y-0.5' : ''}
            ${level === 0 ? 'bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-900/50 dark:to-purple-900/50 border-orange-300 dark:border-orange-600' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {node.avatar ? (
                <img
                  src={node.avatar}
                  alt={node.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {node.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-zinc-900 dark:text-white font-semibold text-sm truncate">
                {node.name}
              </h4>
              <p className="text-zinc-400 text-xs truncate mt-0.5">
                {node.title}
              </p>
              {node.department && (
                <p className="text-zinc-500 text-xs truncate mt-0.5">
                  {node.department}
                </p>
              )}
            </div>

            {/* Expand icon */}
            {hasChildren && (
              <div className="flex-shrink-0">
                <svg
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Additional details */}
          {showDetails && (isHovered || level === 0) && (
            <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-1">
              {node.email && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{node.email}</span>
                </div>
              )}
              {node.phone && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{node.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Reports count badge */}
          {hasChildren && (
            <div className="absolute -bottom-2 right-4 bg-orange-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-sm">
              {node.children!.length}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <>
            {/* Vertical connector */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-zinc-300 to-zinc-200 dark:from-zinc-600 dark:to-zinc-700" />

            {/* Horizontal line */}
            <div className="relative w-full">
              {node.children!.length > 1 && (
                <div
                  className="absolute top-0 h-0.5 bg-gradient-to-r from-zinc-300 to-zinc-200 dark:from-zinc-600 dark:to-zinc-700"
                  style={{
                    left: '50%',
                    right: '50%',
                    width: `${(node.children!.length - 1) * 300}px`,
                    transform: 'translateX(-50%)',
                  }}
                />
              )}

              {/* Children nodes */}
              <div className="flex justify-center gap-12 pt-8">
                {node.children!.map((child) => (
                  <div key={child.id} className="relative">
                    {/* Vertical connector to child */}
                    <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-zinc-300 to-zinc-200 dark:from-zinc-600 dark:to-zinc-700 -translate-x-1/2" />
                    {renderNode(child, level + 1)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="card border border-zinc-200/60 dark:border-zinc-700 rounded-2xl p-6 my-4 overflow-x-auto shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allIds = new Set<string>();
                const traverse = (node: OrgNode) => {
                  allIds.add(node.id);
                  node.children?.forEach(traverse);
                };
                traverse(data);
                setExpandedNodes(allIds);
              }}
              className="px-3 py-1 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedNodes(new Set([data.id]))}
              className="px-3 py-1 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      <div className="py-8 min-w-max">{renderNode(data)}</div>
    </div>
  );
};

export default OrgChart;

export const metadata = {
  name: 'org-chart',
  category: 'data-display' as const,
  component: OrgChart,
  description: 'Organizational hierarchy chart with employee details',
  tags: ['organization', 'chart', 'hierarchy', 'team', 'structure', 'employees'],
  propTypes: {
    title: 'string',
    data: 'OrgNode',
    onNodeClick: '(node: OrgNode) => void',
    showDetails: 'boolean',
  },
};
