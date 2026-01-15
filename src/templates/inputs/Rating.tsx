import React, { useState } from 'react';

interface RatingProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'warning' | 'error';
  icon?: 'star' | 'heart' | 'circle';
  showValue?: boolean;
  onChange?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  label,
  value,
  defaultValue = 0,
  max = 5,
  precision = 1,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  size = 'medium',
  color = 'warning',
  icon = 'star',
  showValue = false,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = value !== undefined ? value : internalValue;
  const activeValue = hoverValue !== null ? hoverValue : displayValue;

  const handleClick = (newValue: number) => {
    if (disabled || readOnly) return;
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleMouseEnter = (newValue: number) => {
    if (disabled || readOnly) return;
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-7 h-7',
    large: 'w-9 h-9',
  };

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const getIcon = (fillType: 'full' | 'half' | 'empty', index: number) => {
    const starPath = "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";
    const heartPath = "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";
    const clipId = `half-clip-${index}`;

    switch (icon) {
      case 'star':
        return (
          <svg
            className={`${sizeClasses[size]} transition-colors duration-150`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            {fillType === 'half' ? (
              <>
                <path d={starPath} fill="currentColor" opacity="0.3" />
                <path d={starPath} fill="currentColor" clipPath={`url(#${clipId})`} />
              </>
            ) : fillType === 'full' ? (
              <path d={starPath} fill="currentColor" />
            ) : (
              <path d={starPath} fill="none" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        );
      case 'heart':
        return (
          <svg
            className={`${sizeClasses[size]} transition-colors duration-150`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            {fillType === 'half' ? (
              <>
                <path d={heartPath} fill="currentColor" opacity="0.3" />
                <path d={heartPath} fill="currentColor" clipPath={`url(#${clipId})`} />
              </>
            ) : fillType === 'full' ? (
              <path d={heartPath} fill="currentColor" />
            ) : (
              <path d={heartPath} fill="none" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        );
      case 'circle':
        return (
          <svg
            className={`${sizeClasses[size]} transition-colors duration-150`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            {fillType === 'half' ? (
              <>
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
                <circle cx="12" cy="12" r="10" fill="currentColor" clipPath={`url(#${clipId})`} />
              </>
            ) : fillType === 'full' ? (
              <circle cx="12" cy="12" r="10" fill="currentColor" />
            ) : (
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        );
      default:
        return null;
    }
  };

  const items = [];
  // Generate exactly 'max' number of stars
  for (let i = 1; i <= max; i++) {
    const itemValue = i;
    // Determine fill type: full, half, or empty
    let fillType: 'full' | 'half' | 'empty' = 'empty';

    if (activeValue >= itemValue) {
      // Star is fully filled
      fillType = 'full';
    } else if (activeValue >= itemValue - 1) {
      // Star is partially filled (has a decimal remainder)
      fillType = 'half';
    }

    items.push(
      <button
        key={i}
        type="button"
        onClick={() => handleClick(itemValue)}
        onMouseEnter={() => handleMouseEnter(itemValue)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || readOnly}
        className={`
          ${fillType !== 'empty' ? colorClasses[color] : 'text-gray-600'}
          ${disabled || readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
          transition-transform duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded
        `.trim().replace(/\s+/g, ' ')}
      >
        {getIcon(fillType, i)}
      </button>
    );
  }

  return (
    <div className="my-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-1">
        {items}
        {showValue && (
          <span className="ml-2 text-sm text-gray-400 font-mono">
            {displayValue.toFixed(precision === 0.5 ? 1 : 0)} / {max}
          </span>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default Rating;

export const metadata = {
  name: 'rating',
  category: 'inputs' as const,
  component: Rating,
  description: 'Rating component with customizable icons (star, heart, circle), precision, and max value. Supports hover effects and validation.',
  tags: ['ui', 'input', 'form', 'rating', 'stars', 'review'],
};
