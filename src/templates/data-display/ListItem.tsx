import React from 'react';

type ListItemVariant = 'default' | 'highlighted' | 'minimal';
type ListItemSize = 'small' | 'medium' | 'large';

interface ListItemProps {
  primary: string;
  secondary?: string;
  tertiary?: string;
  icon?: string;
  avatar?: string;
  badge?: string | number;
  variant?: ListItemVariant;
  size?: ListItemSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  action?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({
  primary,
  secondary,
  tertiary,
  icon,
  avatar,
  badge,
  variant = 'default',
  size = 'medium',
  selected = false,
  disabled = false,
  onClick,
  action,
  leftContent,
  rightContent,
}) => {
  const sizeStyles: Record<ListItemSize, { container: string; primary: string; secondary: string; icon: string; avatar: string }> = {
    small: {
      container: 'py-2 px-3 gap-2',
      primary: 'text-sm',
      secondary: 'text-xs',
      icon: 'text-base',
      avatar: 'w-8 h-8',
    },
    medium: {
      container: 'py-3 px-4 gap-3',
      primary: 'text-base',
      secondary: 'text-sm',
      icon: 'text-xl',
      avatar: 'w-10 h-10',
    },
    large: {
      container: 'py-4 px-5 gap-4',
      primary: 'text-lg',
      secondary: 'text-base',
      icon: 'text-2xl',
      avatar: 'w-12 h-12',
    },
  };

  const variantStyles: Record<ListItemVariant, string> = {
    default: 'bg-transparent',
    highlighted: 'bg-gray-800/30 border-l-4 border-l-blue-500',
    minimal: 'bg-transparent border-b border-gray-800/30',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        ${sizeStyles[size].container}
        ${variantStyles[variant]}
        flex items-center
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onClick && !disabled ? 'cursor-pointer hover:bg-gray-800/30' : ''}
        ${selected ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : ''}
      `}
    >
      {leftContent}

      {avatar && (
        <div className="flex-shrink-0">
          <div className={`${sizeStyles[size].avatar} rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}>
            {avatar.startsWith('http') ? (
              <img
                src={avatar}
                alt={primary}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">{avatar}</span>
            )}
          </div>
        </div>
      )}

      {icon && !avatar && (
        <div className={`flex-shrink-0 ${sizeStyles[size].icon} text-gray-400`}>
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className={`${sizeStyles[size].primary} text-white font-medium truncate flex items-center gap-2`}>
          {primary}
          {badge !== undefined && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        {secondary && (
          <div className={`${sizeStyles[size].secondary} text-gray-400 truncate mt-0.5`}>
            {secondary}
          </div>
        )}
        {tertiary && (
          <div className="text-xs text-gray-500 truncate mt-0.5">
            {tertiary}
          </div>
        )}
      </div>

      {rightContent}

      {action && (
        <div className="flex-shrink-0 ml-2">{action}</div>
      )}
    </div>
  );
};

export default ListItem;

export const metadata = {
  name: 'list-item',
  category: 'data-display' as const,
  component: ListItem,
  description: 'Individual list item with rich content support',
  tags: ['list', 'item', 'menu', 'avatar', 'badge'],
  propTypes: {
    primary: 'string',
    secondary: 'string',
    tertiary: 'string',
    icon: 'string',
    avatar: 'string',
    badge: 'string | number',
    variant: "'default' | 'highlighted' | 'minimal'",
    size: "'small' | 'medium' | 'large'",
    selected: 'boolean',
    disabled: 'boolean',
    onClick: '() => void',
    action: 'React.ReactNode',
    leftContent: 'React.ReactNode',
    rightContent: 'React.ReactNode',
  },
};
