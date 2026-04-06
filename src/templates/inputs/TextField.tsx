import React, { useState } from 'react';
import { useData } from '../core/DataContext';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  name?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  prefix,
  suffix,
  icon,
  onChange,
  onBlur,
  onFocus,
  name,
}) => {
  const { setData } = useData();
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (name) setData(name, newValue);
    if (onChange) onChange(newValue);
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800`,
    filled: `border-b-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-100 dark:bg-gray-800/50`,
    standard: `border-b-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-transparent`,
  };

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className={`
        flex items-center
        ${variantClasses[variant]}
        rounded-lg transition-all duration-200
        focus-within:ring-2 focus-within:ring-emerald-500/50
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `.trim().replace(/\s+/g, ' ')}>
        {(prefix || icon) && (
          <div className="pl-3 pr-2 text-gray-400 flex-shrink-0">
            {prefix || icon}
          </div>
        )}
        <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`
            ${sizeClasses[size]}
            flex-1 bg-transparent
            ${!(prefix || icon) ? 'pl-4' : 'pl-0'}
            ${!suffix ? 'pr-4' : 'pr-0'}
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none 
            disabled:cursor-not-allowed
          `.trim().replace(/\s+/g, ' ')}
        />
        {suffix && (
          <div className="px-3 text-gray-400 flex-shrink-0">
            {suffix}
          </div>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;

export const metadata = {
  name: 'text-field',
  category: 'inputs' as const,
  component: TextField,
  description: 'Text input field with support for labels, validation, prefixes, suffixes, and various styles. Supports multiple input types.',
  tags: ['ui', 'input', 'form', 'text', 'field'],
};
