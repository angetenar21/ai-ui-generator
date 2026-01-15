import React from 'react';

type ChipVariant = 'filled' | 'outlined' | 'soft';
type ChipColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type ChipSize = 'small' | 'medium' | 'large';

interface ChipData {
  id: string;
  label: string;
  icon?: string;
}

interface ChipProps {
  chips: ChipData[];
  variant?: ChipVariant;
  color?: ChipColor;
  size?: ChipSize;
  deletable?: boolean;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

const Chip: React.FC<ChipProps> = ({
  chips,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  deletable = false,
  onDelete,
  onClick,
}) => {
  const colorStyles: Record<ChipColor, { filled: string; outlined: string; soft: string }> = {
    default: {
      filled: 'bg-gray-700 text-gray-200 border-gray-700',
      outlined: 'bg-transparent text-gray-300 border-gray-600',
      soft: 'bg-gray-800/50 text-gray-200 border-gray-700/50',
    },
    primary: {
      filled: 'bg-blue-600 text-white border-blue-600',
      outlined: 'bg-transparent text-blue-400 border-blue-500',
      soft: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
    },
    success: {
      filled: 'bg-green-600 text-white border-green-600',
      outlined: 'bg-transparent text-green-400 border-green-500',
      soft: 'bg-green-900/30 text-green-300 border-green-700/50',
    },
    warning: {
      filled: 'bg-yellow-600 text-white border-yellow-600',
      outlined: 'bg-transparent text-yellow-400 border-yellow-500',
      soft: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
    },
    error: {
      filled: 'bg-red-600 text-white border-red-600',
      outlined: 'bg-transparent text-red-400 border-red-500',
      soft: 'bg-red-900/30 text-red-300 border-red-700/50',
    },
    info: {
      filled: 'bg-cyan-600 text-white border-cyan-600',
      outlined: 'bg-transparent text-cyan-400 border-cyan-500',
      soft: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/50',
    },
  };

  const sizeStyles: Record<ChipSize, { chip: string; icon: string; text: string }> = {
    small: {
      chip: 'px-2 py-1 text-xs gap-1',
      icon: 'text-xs',
      text: 'text-xs',
    },
    medium: {
      chip: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'text-sm',
      text: 'text-sm',
    },
    large: {
      chip: 'px-4 py-2 text-base gap-2',
      icon: 'text-base',
      text: 'text-base',
    },
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const handleClick = (id: string) => {
    onClick?.(id);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <div
          key={chip.id}
          onClick={() => handleClick(chip.id)}
          className={`
            inline-flex items-center rounded-full border font-medium
            transition-all duration-200
            ${colorStyles[color][variant]}
            ${sizeStyles[size].chip}
            ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          `}
        >
          {chip.icon && (
            <span className={sizeStyles[size].icon}>{chip.icon}</span>
          )}
          <span className={sizeStyles[size].text}>{chip.label}</span>
          {deletable && (
            <button
              onClick={(e) => handleDelete(e, chip.id)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label={`Remove ${chip.label}`}
            >
              <svg
                className={sizeStyles[size].icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chip;

export const metadata = {
  name: 'chip',
  category: 'data-display' as const,
  component: Chip,
  description: 'Removable chips/tags with icons and multiple variants',
  tags: ['chip', 'tag', 'label', 'removable', 'badge'],
  propTypes: {
    chips: 'ChipData[]',
    variant: "'filled' | 'outlined' | 'soft'",
    color: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
    size: "'small' | 'medium' | 'large'",
    deletable: 'boolean',
    onDelete: '(id: string) => void',
    onClick: '(id: string) => void',
  },
};
