import React, { useState } from 'react';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  defaultValue,
  rows = 4,
  minRows = 2,
  maxRows = 10,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  maxLength,
  showCharCount = false,
  autoResize = false,
  onChange,
  onBlur,
  onFocus,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setInternalValue(newValue);
      if (onChange) onChange(newValue);
    }
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

  const textareaRows = autoResize ? minRows : rows;

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={textareaRows}
        maxLength={maxLength}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : 'w-full'}
          rounded-lg text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          resize-${autoResize ? 'none' : 'vertical'}
        `.trim().replace(/\s+/g, ' ')}
        style={autoResize ? { minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` } : undefined}
      />
      <div className="flex justify-between items-center mt-1">
        <div className="flex-1">
          {(helperText || (error && errorMessage)) && (
            <p className={`text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
              {error && errorMessage ? errorMessage : helperText}
            </p>
          )}
        </div>
        {(showCharCount || maxLength) && (
          <p className="text-xs text-gray-400 ml-2">
            {displayValue.length}
            {maxLength && ` / ${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;

export const metadata = {
  name: 'text-area',
  category: 'inputs' as const,
  component: TextArea,
  description: 'Multi-line text input component with auto-resize, character count, and validation. Supports various styles and sizes.',
  tags: ['ui', 'input', 'form', 'textarea', 'multiline'],
};
