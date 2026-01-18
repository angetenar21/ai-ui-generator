import React from 'react';
import { Users } from 'lucide-react';

interface Avatar {
  /** User's name or identifier */
  name?: string;

  /** Alternative: label can be used for initials */
  label?: string;

  /** Alternative: alt can be used as name */
  alt?: string;

  /** Avatar image URL */
  src?: string;

  /** Fallback initials (auto-generated from name if not provided) */
  initials?: string;

  /** Avatar color variant */
  color?: string;
}

interface AvatarGroupProps {
  /** Array of avatar objects */
  avatars: Avatar[];

  /** Maximum number of avatars to display before showing "+N" */
  max?: number;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Optional label/title */
  label?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars = [],
  max = 5,
  size = 'medium',
  label,
}) => {
  // Validate and sanitize data - filter out invalid avatars
  // Accept multiple property name variations (name/alt, initials/label)
  const validAvatars = Array.isArray(avatars)
    ? avatars.filter(avatar => avatar && (avatar.name || avatar.alt || avatar.initials || avatar.label || avatar.src))
    : [];

  if (validAvatars.length === 0) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-lg p-4 my-1">
        <div className="flex items-center gap-2 text-text-tertiary">
          <Users className="w-5 h-5" />
          <span className="text-sm">No avatars to display</span>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
  };

  const displayAvatars = validAvatars.slice(0, max);
  const remainingCount = validAvatars.length - max;

  const getInitials = (name: string | undefined, providedInitials?: string): string => {
    if (providedInitials) return providedInitials.substring(0, 2).toUpperCase();

    // Handle missing or invalid name
    if (!name || typeof name !== 'string') return '??';

    const trimmedName = name.trim();
    if (!trimmedName) return '??';

    const words = trimmedName.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return trimmedName.substring(0, 2).toUpperCase();
  };

  const getColorClass = (index: number, color?: string): string => {
    if (color) return color;
    
    const colors = [
      'bg-primary-500',
      'bg-accent-cyan',
      'bg-accent-purple',
      'bg-accent-pink',
      'bg-accent-from',
      'bg-success',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="glass-dark border border-gray-700/50 rounded-lg p-4 my-1">
      {label && (
        <div className="text-text-secondary text-sm font-medium mb-3">{label}</div>
      )}
      
      <div className="flex items-center -space-x-2">
        {displayAvatars.map((avatar, index) => {
          // Support multiple property name variations
          const displayName = avatar.name || avatar.alt || 'User';
          const displayInitials = avatar.initials || avatar.label;

          return (
            <div
              key={index}
              className={`
                ${sizeClasses[size]}
                rounded-full border-2 border-bg-main
                overflow-hidden flex items-center justify-center
                font-semibold text-white
                hover:z-10 hover:scale-110 transition-transform cursor-pointer
                ${!avatar.src ? getColorClass(index, avatar.color) : ''}
              `}
              title={displayName}
            >
              {avatar.src ? (
                <img
                  src={avatar.src}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.textContent = getInitials(displayName, displayInitials);
                    e.currentTarget.parentElement!.classList.add(getColorClass(index, avatar.color));
                  }}
                />
              ) : (
                getInitials(displayName, displayInitials)
              )}
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full border-2 border-bg-main
              bg-bg-sub flex items-center justify-center
              font-semibold text-text-secondary
              hover:z-10 hover:scale-110 transition-transform cursor-pointer
            `}
            title={`${remainingCount} more`}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      {validAvatars.length > 0 && (
        <div className="text-text-tertiary text-xs mt-3">
          {validAvatars.length} {validAvatars.length === 1 ? 'member' : 'members'}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

export const metadata = {
  name: 'avatar-group',
  category: 'surfaces' as const,
  component: AvatarGroup,
  description: 'Display a group of user avatars with overflow handling and customizable appearance',
  tags: ['avatar', 'group', 'users', 'team', 'members', 'profile'],
  propTypes: {
    avatars: 'array (required) - Array of avatar objects with name, src, initials, and color',
    max: 'number - Maximum avatars to display before showing "+N" (default: 5)',
    size: 'string - Size variant: small, medium, large (default: medium)',
    label: 'string - Optional label to display above the avatar group',
  },
};
