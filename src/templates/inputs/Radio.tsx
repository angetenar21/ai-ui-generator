import React, { useState } from 'react';

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  label?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  options?: RadioOption[];
  items?: RadioOption[];
  choices?: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  onChange?: (value: string | number) => void;
}

const Radio: React.FC<RadioProps> = ({
  label,
  name = 'radio-group',
  value,
  defaultValue,
  options,
  items,
  choices,
  orientation = 'vertical',
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  color = 'primary',
  size = 'medium',
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue || '');
  const selectedValue = value !== undefined ? value : internalValue;
  const radioOptions = options || items || choices || [];

  const handleChange = (newValue: string | number) => {
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const colorClasses = {
    primary: 'text-blue-600 focus:ring-blue-500',
    secondary: 'text-gray-600 focus:ring-gray-500',
    success: 'text-green-600 focus:ring-green-500',
    warning: 'text-yellow-600 focus:ring-yellow-500',
    error: 'text-red-600 focus:ring-red-500',
  };

  return (
    <div className="my-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className={`flex ${orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
        {radioOptions.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`${name}-${index}`}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                disabled={isDisabled}
                required={required}
                className={`
                  ${sizeClasses[size]}
                  ${colorClasses[color]}
                  ${error ? 'border-red-500' : 'border-gray-600'}
                  border-2 bg-gray-800
                  focus:ring-2 focus:ring-offset-0
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  cursor-pointer
                `.trim().replace(/\s+/g, ' ')}
              />
              <label
                htmlFor={`${name}-${index}`}
                className={`ml-2 text-sm text-gray-300 cursor-pointer select-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default Radio;

export const metadata = {
  name: 'radio',
  category: 'inputs' as const,
  component: Radio,
  description: 'Radio button group component with customizable colors, sizes, and orientations. Supports validation and helper text.',
  tags: ['ui', 'input', 'form', 'radio', 'selection'],
};
