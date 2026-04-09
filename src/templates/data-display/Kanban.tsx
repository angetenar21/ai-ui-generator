import React, { useState } from 'react';

const safeStr = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val.label) return String(val.label);
  try { return JSON.stringify(val); } catch { return '[value]'; }
};

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  avatar?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
  color?: string;
}

interface KanbanProps {
  title?: string;
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard) => void;
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Kanban: React.FC<KanbanProps> = ({
  title = 'Kanban Board',
  columns,
  onCardClick,
  onCardMove,
}) => {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const [draggedCard, setDraggedCard] = useState<{
    card: KanbanCard;
    columnId: string;
  } | null>(null);

  const priorityColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-red-600',
  };

  const handleDragStart = (card: KanbanCard, columnId: string) => {
    setDraggedCard({ card, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (draggedCard && draggedCard.columnId !== targetColumnId) {
      onCardMove?.(draggedCard.card.id, draggedCard.columnId, targetColumnId);
    }
    setDraggedCard(null);
  };

  return (
    <div className="card border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 my-4">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-white">
          {title}
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {safeColumns.filter(c => c && c.id).map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {column.color && (
                    <div
                      className={`w-3 h-3 rounded-full ${column.color}`}
                    />
                  )}
                  <h4 className="font-semibold text-white">{column.title}</h4>
                  <span className="text-sm text-zinc-400">
                    ({(column.cards || []).length}
                    {column.limit ? `/${column.limit}` : ''})
                  </span>
                </div>
              </div>
              {column.limit && (column.cards || []).length >= column.limit && (
                <div className="text-xs text-yellow-400">
                  Column limit reached
                </div>
              )}
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {(column.cards || []).map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                  onClick={() => onCardClick?.(card)}
                  className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4
                           hover:bg-zinc-800/50 hover:border-zinc-600/50
                           cursor-pointer transition-all duration-200
                           hover:shadow-lg hover:scale-[1.02]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-white font-medium text-sm flex-1">
                      {card.title}
                    </h5>
                    {card.priority && (
                      <span
                        className={`
                          w-2 h-2 rounded-full flex-shrink-0 mt-1
                          ${priorityColors[card.priority]}
                        `}
                        title={`${card.priority} priority`}
                      />
                    )}
                  </div>

                  {/* Description */}
                  {card.description && (
                    <p className="text-zinc-400 text-xs mb-3 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-indigo-900/30 text-indigo-300
                                   border border-indigo-700/50 rounded text-xs"
                        >
                          {safeStr(tag)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {card.assignee && (
                      <div className="flex items-center gap-2">
                        {card.avatar ? (
                          <img
                            src={card.avatar}
                            alt={card.assignee}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {card.assignee.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-zinc-400">
                          {card.assignee}
                        </span>
                      </div>
                    )}

                    {card.dueDate && (
                      <div className="text-xs text-zinc-500">
                        {new Date(card.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(column.cards || []).length === 0 && (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  Drop cards here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {safeColumns.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          No columns to display
        </div>
      )}
    </div>
  );
};

export default Kanban;

export const metadata = {
  name: 'kanban',
  category: 'data-display' as const,
  component: Kanban,
  description: 'Drag-and-drop kanban board with columns and cards',
  tags: ['kanban', 'board', 'cards', 'workflow', 'drag-drop', 'agile'],
  propTypes: {
    title: 'string',
    columns: 'KanbanColumn[]',
    onCardClick: '(card: KanbanCard) => void',
    onCardMove: '(cardId: string, fromColumn: string, toColumn: string) => void',
  },
};
