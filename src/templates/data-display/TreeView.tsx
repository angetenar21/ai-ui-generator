import React, { useState } from 'react';

interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  metadata?: Record<string, any>;
}

interface TreeViewProps {
  title?: string;
  data: TreeNode[];
  defaultExpandAll?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  showLines?: boolean;
  onNodeClick?: (node: TreeNode) => void;
  onNodeSelect?: (selectedNodes: TreeNode[]) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  title,
  data,
  defaultExpandAll = false,
  selectable = false,
  multiSelect = false,
  showLines = true,
  onNodeClick,
  onNodeSelect,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    defaultExpandAll ? new Set(getAllNodeIds(data)) : new Set()
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function getAllNodeIds(nodes: TreeNode[]): string[] {
    const ids: string[] = [];
    const traverse = (node: TreeNode) => {
      ids.push(node.id);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return ids;
  }

  const toggleExpand = (nodeId: string) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  };

  const handleNodeClick = (node: TreeNode) => {
    if (selectable) {
      setSelected((prev) => {
        const newSelected = new Set(prev);
        if (multiSelect) {
          if (newSelected.has(node.id)) {
            newSelected.delete(node.id);
          } else {
            newSelected.add(node.id);
          }
        } else {
          newSelected.clear();
          newSelected.add(node.id);
        }

        // Get full node objects for callback
        const selectedNodes = getAllNodes(data).filter((n) =>
          newSelected.has(n.id)
        );
        onNodeSelect?.(selectedNodes);

        return newSelected;
      });
    }
    onNodeClick?.(node);
  };

  function getAllNodes(nodes: TreeNode[]): TreeNode[] {
    const allNodes: TreeNode[] = [];
    const traverse = (node: TreeNode) => {
      allNodes.push(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return allNodes;
  }

  const TreeNodeComponent: React.FC<{
    node: TreeNode;
    level: number;
    isLast: boolean;
    parentLines: boolean[];
  }> = ({ node, level, isLast, parentLines }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selected.has(node.id);

    return (
      <div>
        <div
          className={`
            flex items-center py-1.5 px-2 rounded-lg
            transition-colors cursor-pointer
            ${isSelected ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/30'}
          `}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          {showLines && level > 0 && (
            <div className="absolute left-0 flex">
              {parentLines.map((showLine, idx) => (
                <div
                  key={idx}
                  className="w-6"
                  style={{ marginLeft: `${idx * 24}px` }}
                >
                  {showLine && (
                    <div className="h-full w-px bg-gray-700/50 ml-3" />
                  )}
                </div>
              ))}
              <div className="relative" style={{ width: '24px' }}>
                <div className="absolute h-px w-3 bg-gray-700/50 top-1/2 left-3" />
                {!isLast && (
                  <div className="absolute w-px bg-gray-700/50 top-1/2 left-3 h-full" />
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-1 relative z-10">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
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
              </button>
            )}

            {!hasChildren && <div className="w-5" />}

            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleNodeClick(node)}
                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            )}

            <div
              onClick={() => handleNodeClick(node)}
              className="flex items-center gap-2 flex-1"
            >
              {node.icon && (
                <span className="text-gray-400 text-lg">{node.icon}</span>
              )}
              <span className="text-white text-sm">{node.label}</span>
              {node.metadata?.count !== undefined && (
                <span className="text-xs text-gray-500">
                  ({node.metadata.count})
                </span>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child, index) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={index === node.children!.length - 1}
                parentLines={[...parentLines, !isLast]}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-dark border border-gray-700/50 rounded-2xl p-6 my-4">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(new Set(getAllNodeIds(data)))}
              className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpanded(new Set())}
              className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {data.map((node, index) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            isLast={index === data.length - 1}
            parentLines={[]}
          />
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No data to display
        </div>
      )}
    </div>
  );
};

export default TreeView;

export const metadata = {
  name: 'tree-view',
  category: 'data-display' as const,
  component: TreeView,
  description: 'Hierarchical tree view with expand/collapse and selection',
  tags: ['tree', 'hierarchy', 'folder', 'nested', 'expandable'],
  propTypes: {
    title: 'string',
    data: 'TreeNode[]',
    defaultExpandAll: 'boolean',
    selectable: 'boolean',
    multiSelect: 'boolean',
    showLines: 'boolean',
    onNodeClick: '(node: TreeNode) => void',
    onNodeSelect: '(selectedNodes: TreeNode[]) => void',
  },
};
