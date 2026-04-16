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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border ${error ? 'border-red-400 ring-2 ring-red-500/10' : 'border-zinc-200 dark:border-zinc-700'} bg-white dark:bg-zinc-900`,
    filled: `border-b-2 ${error ? 'border-red-400 ring-2 ring-red-500/10' : 'border-zinc-200 dark:border-zinc-700'} bg-zinc-50 dark:bg-zinc-800/50`,
    standard: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} bg-transparent`,
  };

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <div className={`
        flex items-center
        ${variantClasses[variant]}
        rounded-xl transition-all duration-200
        focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `.trim().replace(/\s+/g, ' ')}>
        <div className="pl-3 pr-2 text-zinc-400 flex-shrink-0">
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
            flex-1 bg-transparent
            text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            focus:outline-none 
            disabled:cursor-not-allowed
          `.trim().replace(/\s+/g, ' ')}
        />
        <div className="px-3 flex items-center gap-2 flex-shrink-0">
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full transition-opacity duration-200"></div>
          )}
          {showClearButton && displayValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
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
              className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors disabled:opacity-50"
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
        <p className={`mt-1.5 text-xs ${error ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
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
