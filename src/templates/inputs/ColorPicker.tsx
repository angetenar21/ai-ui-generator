import React, { useState } from 'react';

interface ColorPickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  showPreview?: boolean;
  showInput?: boolean;
  presetColors?: string[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  defaultValue = '#3b82f6',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  showPreview = true,
  showInput = true,
  presetColors,
  onChange,
  onBlur,
  onFocus,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const displayValue = value !== undefined ? value : internalValue;

  const defaultPresets = [
    '#ef4444', '#10B981', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#64748b', '#000000', '#ffffff',
  ];

  const colorPresets = presetColors || defaultPresets;

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border ${error ? 'border-red-400 ring-2 ring-red-500/10' : 'border-zinc-200 dark:border-zinc-700'} focus:border-orange-500 bg-white dark:bg-zinc-900`,
    filled: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} focus:border-orange-500 bg-zinc-50 dark:bg-zinc-800/50`,
    standard: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} focus:border-orange-500 bg-transparent`,
  };

  const previewSizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-3 items-start">
        {showPreview && (
          <div className="relative">
            <input
              type="color"
              value={displayValue}
              onChange={handleInputChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              required={required}
              className={`
                ${previewSizeClasses[size]}
                rounded-xl border border-zinc-200 dark:border-zinc-700
                cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
              `.trim().replace(/\s+/g, ' ')}
              style={{ background: displayValue }}
            />
          </div>
        )}
        {showInput && (
          <div className="flex-1">
            <input
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              required={required}
              placeholder="#000000"
              maxLength={7}
              className={`
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${fullWidth ? 'w-full' : 'w-full'}
                rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono uppercase
                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
              `.trim().replace(/\s+/g, ' ')}
            />
          </div>
        )}
      </div>
      {colorPresets && colorPresets.length > 0 && (
        <div className="mt-3 grid grid-cols-10 gap-2">
          {colorPresets.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && handleChange(color)}
              disabled={disabled}
              className={`
                w-8 h-8 rounded-xl
                ${displayValue.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-zinc-900' : 'border border-zinc-200 dark:border-zinc-600'}
                hover:scale-110 transition-transform duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              `.trim().replace(/\s+/g, ' ')}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-zinc-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default ColorPicker;

export const metadata = {
  name: 'color-picker',
  category: 'inputs' as const,
  component: ColorPicker,
  description: 'Color picker with preview, text input, and preset color palette. Supports hex color values and validation.',
  tags: ['ui', 'input', 'form', 'color', 'picker', 'palette'],
};
