import React, { useState, useEffect } from 'react';
import { useData } from '../core/DataContext';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  name?: string;
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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
  name,
}) => {
  const { data, setData } = useData();

  // useState MUST come before useEffect (Rules of Hooks)
  // Normalize options: support both {label, value} objects and simple strings
  const rawOptions = options || items || [];
  const selectOptions = rawOptions.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt };
    }
    return opt;
  }).filter(opt => opt && typeof opt === 'object');

  // useState MUST come before useEffect (Rules of Hooks)
  const [internalValue, setInternalValue] = useState<string | number>(() => {
    // Priority: 1. Context data if name is provided, 2. defaultValue
    if (name && data && data[name] !== undefined) {
      return data[name];
    }
    return defaultValue !== undefined ? defaultValue : '';
  });

  const displayValue = value !== undefined ? value : internalValue;

  // Sync from DataContext when context value changes (e.g. another component sets the same key)
  useEffect(() => {
    if (name && data && data[name] !== undefined && data[name] !== internalValue) {
      setInternalValue(data[name]);
    }
  }, [data, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (onChange) onChange(newValue);

    // Update context if name is present
    if (name && setData) {
      setData(name, newValue);
    }
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
          ${fullWidth ? 'w-full' : 'max-w-md'}
          rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-orange-500/50
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
