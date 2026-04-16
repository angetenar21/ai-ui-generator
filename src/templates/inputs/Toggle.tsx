import React, { useState } from 'react';
import { useData } from '../core/DataContext';

interface ToggleProps {
  /** Label for the toggle */
  label?: string;

  /** Helper text */
  description?: string;

  /** Initial state */
  defaultChecked?: boolean;

  /** Controlled state */
  checked?: boolean;

  /** Change handler */
  onChange?: (checked: boolean) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'danger';

  /** DataContext binding key */
  name?: string;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  disabled = false,
  size = 'medium',
  variant = 'primary',
  name,
}) => {
  const { setData } = useData();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setInternalChecked(newValue);
    if (name) setData(name, newValue);
    onChange?.(newValue);
  };

  // Size classes
  const sizeClasses = {
    small: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translateX: 'translate-x-4',
    },
    medium: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translateX: 'translate-x-5',
    },
    large: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translateX: 'translate-x-7',
    },
  };

  // Variant colors
  const variantClasses = {
    default: 'bg-zinc-300 dark:bg-zinc-700',
    primary: 'bg-orange-500 dark:bg-orange-500',
    success: 'bg-green-500 dark:bg-green-500',
    danger: 'bg-red-500 dark:bg-red-500',
  };

  const activeClass = isChecked ? variantClasses[variant] : 'bg-zinc-300 dark:bg-zinc-700';
  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-start gap-3 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          ${currentSize.track}
          ${activeClass}
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-orange-500/20 focus:ring-offset-2 dark:focus:ring-offset-zinc-900
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            ${currentSize.thumb}
            ${isChecked ? currentSize.translateX : 'translate-x-0'}
            pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0
            transition-transform duration-200 ease-in-out
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {label}
            </span>
          )}
          {description && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;

export const metadata = {
  name: 'toggle',
  category: 'inputs' as const,
  component: Toggle,
  description: 'Toggle switch for boolean settings and preferences',
  tags: ['toggle', 'switch', 'checkbox', 'boolean', 'setting', 'option'],
  propTypes: {
    label: 'string',
    description: 'string',
    defaultChecked: 'boolean',
    checked: 'boolean',
    onChange: '(checked: boolean) => void',
    disabled: 'boolean',
    size: "'small' | 'medium' | 'large'",
    variant: "'default' | 'primary' | 'success' | 'danger'",
  },
};
