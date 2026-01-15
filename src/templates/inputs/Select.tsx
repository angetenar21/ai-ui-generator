import React, { useState } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  options?: SelectOption[];
  items?: SelectOption[];
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (value: string | number) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  defaultValue,
  options,
  items,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue || '');
  const displayValue = value !== undefined ? value : internalValue;
  const selectOptions = options || items || [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    outlined: `border-2 ${error ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 bg-gray-800`,
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
      <select
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          cursor-pointer
        `.trim().replace(/\s+/g, ' ')}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {selectOptions.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={option.disabled}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;

export const metadata = {
  name: 'select',
  category: 'inputs' as const,
  component: Select,
  description: 'Select dropdown component with options, validation, and styling variants. Supports labels and helper text.',
  tags: ['ui', 'input', 'form', 'select', 'dropdown'],
};
