import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  count?: number;
  showDot?: boolean;
  max?: number;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  count,
  showDot = false,
  max = 99,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-zinc-700 text-zinc-200 shadow-sm',
    primary: 'bg-orange-600 text-white shadow-sm shadow-orange-600/20',
    success: 'bg-green-600 text-white shadow-sm shadow-green-600/20',
    warning: 'bg-yellow-600 text-white shadow-sm shadow-yellow-600/20',
    error: 'bg-red-600 text-white shadow-sm shadow-red-600/20',
    info: 'bg-orange-600 text-white shadow-sm shadow-orange-600/20',
  };

  const sizeStyles: Record<BadgeSize, { badge: string; text: string; dot: string }> = {
    small: {
      badge: 'px-2 py-0.5 text-[11px]',
      text: 'text-[11px]',
      dot: 'w-1.5 h-1.5',
    },
    medium: {
      badge: 'px-2.5 py-1 text-[11px]',
      text: 'text-[11px]',
      dot: 'w-2 h-2',
    },
    large: {
      badge: 'px-3 py-1.5 text-xs',
      text: 'text-xs',
      dot: 'w-2.5 h-2.5',
    },
  };

  const displayCount = count !== undefined && count > max ? `${max}+` : count;

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`
          inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide
          ${variantStyles[variant]}
          ${sizeStyles[size].badge}
        `}
      >
        {showDot && (
          <span
            className={`
              rounded-full bg-current opacity-75
              ${sizeStyles[size].dot}
            `}
          />
        )}
        {label}
        {count !== undefined && (
          <span className={`font-semibold ${sizeStyles[size].text}`}>
            {displayCount}
          </span>
        )}
      </span>
    </div>
  );
};

export default Badge;

export const metadata = {
  name: 'badge',
  category: 'data-display' as const,
  component: Badge,
  description: 'Status badge with count/text support and multiple variants',
  tags: ['badge', 'status', 'label', 'count', 'notification'],
  propTypes: {
    label: 'string',
    variant: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
    size: "'small' | 'medium' | 'large'",
    count: 'number',
    showDot: 'boolean',
    max: 'number',
  },
};
