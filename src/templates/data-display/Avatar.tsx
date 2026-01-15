import React from 'react';

type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
type AvatarVariant = 'circular' | 'rounded' | 'square';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  status?: AvatarStatus;
  badge?: string | number;
  fallbackIcon?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'medium',
  variant = 'circular',
  status = 'none',
  badge,
  fallbackIcon = '👤',
  onClick,
}) => {
  const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string; badge: string }> = {
    xs: {
      container: 'w-6 h-6 text-xs',
      text: 'text-xs',
      status: 'w-1.5 h-1.5 border',
      badge: 'text-[8px] min-w-[12px] h-3 px-0.5',
    },
    small: {
      container: 'w-8 h-8 text-sm',
      text: 'text-sm',
      status: 'w-2 h-2 border',
      badge: 'text-[10px] min-w-[16px] h-4 px-1',
    },
    medium: {
      container: 'w-10 h-10 text-base',
      text: 'text-base',
      status: 'w-2.5 h-2.5 border-2',
      badge: 'text-xs min-w-[20px] h-5 px-1.5',
    },
    large: {
      container: 'w-16 h-16 text-2xl',
      text: 'text-2xl',
      status: 'w-3 h-3 border-2',
      badge: 'text-sm min-w-[24px] h-6 px-2',
    },
    xl: {
      container: 'w-24 h-24 text-4xl',
      text: 'text-4xl',
      status: 'w-4 h-4 border-2',
      badge: 'text-base min-w-[28px] h-7 px-2',
    },
  };

  const variantStyles: Record<AvatarVariant, string> = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const statusStyles: Record<AvatarStatus, string> = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
    none: 'hidden',
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="relative inline-flex">
      <div
        onClick={onClick}
        className={`
          ${sizeStyles[size].container}
          ${variantStyles[variant]}
          bg-gradient-to-br from-blue-600 to-purple-600
          flex items-center justify-center
          overflow-hidden
          border border-gray-700/50
          ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        `}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : name ? (
          <span className={`${sizeStyles[size].text} font-semibold text-white`}>
            {getInitials(name)}
          </span>
        ) : (
          <span className={`${sizeStyles[size].text}`}>{fallbackIcon}</span>
        )}
      </div>

      {status !== 'none' && (
        <span
          className={`
            absolute bottom-0 right-0
            ${sizeStyles[size].status}
            ${statusStyles[status]}
            ${variantStyles[variant]}
            border-gray-900
          `}
        />
      )}

      {badge !== undefined && (
        <span
          className={`
            absolute -top-1 -right-1
            ${sizeStyles[size].badge}
            bg-red-600 text-white
            rounded-full
            flex items-center justify-center
            font-semibold
            border border-gray-900
          `}
        >
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );
};

export default Avatar;

export const metadata = {
  name: 'avatar',
  category: 'data-display' as const,
  component: Avatar,
  description: 'User avatar with status indicators, badges, and multiple sizes',
  tags: ['avatar', 'user', 'profile', 'status', 'badge', 'image'],
  propTypes: {
    src: 'string',
    alt: 'string',
    name: 'string',
    size: "'xs' | 'small' | 'medium' | 'large' | 'xl'",
    variant: "'circular' | 'rounded' | 'square'",
    status: "'online' | 'offline' | 'busy' | 'away' | 'none'",
    badge: 'string | number',
    fallbackIcon: 'string',
    onClick: '() => void',
  },
};
