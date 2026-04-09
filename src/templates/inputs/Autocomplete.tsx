import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteOption {
  value: string | number;
  label: string;
}

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  options?: AutocompleteOption[];
  items?: AutocompleteOption[];
  suggestions?: AutocompleteOption[];
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  filterOnType?: boolean;
  caseSensitive?: boolean;
  onChange?: (value: string | number) => void;
  onInputChange?: (inputValue: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  placeholder = 'Type to search...',
  value,
  defaultValue,
  options,
  items,
  suggestions,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  filterOnType = true,
  caseSensitive = false,
  onChange,
  onInputChange,
  onBlur,
  onFocus,
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue || '');
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayValue = value !== undefined ? value : internalValue;
  const autocompleteOptions = (options || items || suggestions || []).filter(opt => opt && typeof opt === 'object');

  useEffect(() => {
    const selectedOption = autocompleteOptions.find(opt => opt.value === displayValue);
    if (selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [displayValue, autocompleteOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = filterOnType
    ? autocompleteOptions.filter(option =>
      caseSensitive
        ? option.label.includes(inputValue)
        : option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
    : autocompleteOptions;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (onInputChange) onInputChange(newValue);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    setInputValue(option.label);
    setInternalValue(option.value);
    setIsOpen(false);
    if (onChange) onChange(option.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border-2 ${error ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'} bg-white dark:bg-zinc-800`,
    filled: `border-b-2 ${error ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'} bg-zinc-100 dark:bg-zinc-800/50`,
    standard: `border-b-2 ${error ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'} bg-transparent`,
  };

  return (
    <div className={`my-4 relative ${isOpen ? 'z-50' : 'z-10'} ${fullWidth ? 'w-full' : 'max-w-md'}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true);
            if (onFocus) onFocus();
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${fullWidth ? 'w-full' : 'w-full'}
            pr-10
            rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `.trim().replace(/\s+/g, ' ')}
        />
        <div className="absolute right-3 top-1/2 -tranzinc-y-1/2 text-zinc-400 pointer-events-none">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl shadow-xl max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`
                  px-4 py-2 cursor-pointer transition-colors
                  ${highlightedIndex === index ? 'bg-indigo-500 text-white' : 'text-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'}
                `.trim().replace(/\s+/g, ' ')}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-zinc-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default Autocomplete;

export const metadata = {
  name: 'autocomplete',
  category: 'inputs' as const,
  component: Autocomplete,
  description: 'Autocomplete input with dropdown suggestions, keyboard navigation, and filtering. Supports custom options and validation.',
  tags: ['ui', 'input', 'form', 'autocomplete', 'search', 'suggestions'],
};
