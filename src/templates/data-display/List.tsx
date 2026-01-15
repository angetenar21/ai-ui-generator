import React from 'react';

type ListVariant = 'default' | 'bordered' | 'divided';
type ListDensity = 'compact' | 'comfortable' | 'spacious';

interface ListItemData {
  id: string;
  primary: string;
  secondary?: string;
  icon?: string;
  avatar?: string;
  action?: React.ReactNode;
  disabled?: boolean;
}

interface ListProps {
  title?: string;
  items: ListItemData[];
  variant?: ListVariant;
  density?: ListDensity;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelect?: (ids: string[]) => void;
  onItemClick?: (id: string) => void;
}

const List: React.FC<ListProps> = ({
  title,
  items,
  variant = 'default',
  density = 'comfortable',
  selectable = false,
  multiSelect = false,
  selectedIds = [],
  onSelect,
  onItemClick,
}) => {
  const [selected, setSelected] = React.useState<string[]>(selectedIds);

  const densityStyles: Record<ListDensity, string> = {
    compact: 'py-1.5 px-3',
    comfortable: 'py-3 px-4',
    spacious: 'py-4 px-6',
  };

  const handleItemClick = (id: string, disabled?: boolean) => {
    if (disabled) return;

    if (selectable) {
      let newSelected: string[];
      if (multiSelect) {
        newSelected = selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id];
      } else {
        newSelected = selected.includes(id) ? [] : [id];
      }
      setSelected(newSelected);
      onSelect?.(newSelected);
    }

    onItemClick?.(id);
  };

  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className="glass-dark border border-gray-700/50 rounded-2xl overflow-hidden my-4">
      {title && (
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
        </div>
      )}

      <ul
        className={`
          ${variant === 'bordered' ? 'border-x border-gray-700/50' : ''}
        `}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            onClick={() => handleItemClick(item.id, item.disabled)}
            className={`
              ${densityStyles[density]}
              flex items-center gap-4
              transition-colors
              ${variant === 'divided' && index !== items.length - 1 ? 'border-b border-gray-700/30' : ''}
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${!item.disabled && (selectable || onItemClick) ? 'cursor-pointer hover:bg-gray-800/30' : ''}
              ${isSelected(item.id) ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : ''}
            `}
          >
            {selectable && (
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected(item.id)}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                  disabled={item.disabled}
                />
              </div>
            )}

            {item.avatar && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
                  <img
                    src={item.avatar}
                    alt={item.primary}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {item.icon && !item.avatar && (
              <div className="flex-shrink-0 text-xl text-gray-400">
                {item.icon}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">
                {item.primary}
              </div>
              {item.secondary && (
                <div className="text-sm text-gray-400 truncate mt-0.5">
                  {item.secondary}
                </div>
              )}
            </div>

            {item.action && (
              <div className="flex-shrink-0">{item.action}</div>
            )}
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No items to display
        </div>
      )}
    </div>
  );
};

export default List;

export const metadata = {
  name: 'list',
  category: 'data-display' as const,
  component: List,
  description: 'Flexible list component with selection, icons, and various layouts',
  tags: ['list', 'items', 'selection', 'avatar', 'menu'],
  propTypes: {
    title: 'string',
    items: 'ListItemData[]',
    variant: "'default' | 'bordered' | 'divided'",
    density: "'compact' | 'comfortable' | 'spacious'",
    selectable: 'boolean',
    multiSelect: 'boolean',
    selectedIds: 'string[]',
    onSelect: '(ids: string[]) => void',
    onItemClick: '(id: string) => void',
  },
};
