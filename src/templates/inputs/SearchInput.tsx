import React, { useState } from 'react';

interface SearchInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  showClearButton?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  placeholder = 'Search...',
  value,
  defaultValue,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  showClearButton = true,
  error = false,
  helperText,
  errorMessage,
  onChange,
  onSearch,
  onClear,
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(displayValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch(displayValue);
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
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${fullWidth ? 'w-full' : 'w-full'}
            pl-10 pr-${showClearButton && displayValue ? '20' : '10'}
            rounded-lg text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `.trim().replace(/\s+/g, ' ')}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          )}
          {showClearButton && displayValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {onSearch && (
            <button
              type="button"
              onClick={handleSearchClick}
              disabled={disabled || loading}
              className="text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default SearchInput;

export const metadata = {
  name: 'search-input',
  category: 'inputs' as const,
  component: SearchInput,
  description: 'Search input component with clear button, loading state, and search icon. Supports Enter key to search.',
  tags: ['ui', 'input', 'form', 'search', 'filter'],
};
