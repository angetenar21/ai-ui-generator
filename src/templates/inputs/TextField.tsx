import React, { useState } from 'react';

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
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
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
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
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
            ${variantClasses[variant]}
            ${prefix || icon ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `.trim().replace(/\s+/g, ' ')}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
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

export default TextField;

export const metadata = {
  name: 'text-field',
  category: 'inputs' as const,
  component: TextField,
  description: 'Text input field with support for labels, validation, prefixes, suffixes, and various styles. Supports multiple input types.',
  tags: ['ui', 'input', 'form', 'text', 'field'],
};
