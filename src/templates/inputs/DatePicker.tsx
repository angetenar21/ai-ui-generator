import React, { useState } from 'react';

interface DatePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  showCalendarIcon?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  defaultValue,
  min,
  max,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  showCalendarIcon = true,
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
        {showCalendarIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <input
          type="date"
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${showCalendarIcon ? 'pl-10' : ''}
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

export default DatePicker;

export const metadata = {
  name: 'date-picker',
  category: 'inputs' as const,
  component: DatePicker,
  description: 'Date picker component with calendar icon, min/max date validation, and various styling options.',
  tags: ['ui', 'input', 'form', 'date', 'calendar'],
};
