import React, { useState } from 'react';

interface TimePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  step?: number;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  showClockIcon?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  defaultValue,
  min,
  max,
  step,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  showClockIcon = true,
  onChange,
  onBlur,
  onFocus,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border-2 ${error ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 bg-transparent`,
    filled: `border-b-2 ${error ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 bg-gray-800/50`,
    standard: `border-b-2 ${error ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 bg-transparent`,
  };

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {showClockIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        <input
          type="time"
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${showClockIcon ? 'pl-10' : ''}
            ${fullWidth ? 'w-full' : 'w-full'}
            rounded-lg text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            [color-scheme:dark]
          `.trim().replace(/\s+/g, ' ')}
        />
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default TimePicker;

export const metadata = {
  name: 'time-picker',
  category: 'inputs' as const,
  component: TimePicker,
  description: 'Time picker component with clock icon, min/max time validation, and step support.',
  tags: ['ui', 'input', 'form', 'time', 'clock'],
};
