import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../core/DataContext';

interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  value?: Array<string | number>;
  defaultValue?: Array<string | number>;
  options?: MultiSelectOption[];
  items?: MultiSelectOption[];
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  maxSelections?: number;
  showCheckboxes?: boolean;
  name?: string;
  onChange?: (value: Array<string | number>) => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = 'Select options...',
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
  errorMessage,
  maxSelections,
  showCheckboxes = true,
  onChange,
  name,
}) => {
  const { data, setData } = useData();

  // Normalize options: support both {label, value} objects and simple strings
  const rawOptions = options || items || [];
  const selectOptions = rawOptions.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt };
    }
    return opt;
  }).filter(opt => opt && typeof opt === 'object');

  const [internalValue, setInternalValue] = useState<Array<string | number>>(() => {
    // Priority: 1. Context data if name is provided, 2. defaultValue
    if (name && data && data[name] !== undefined) {
      return Array.isArray(data[name]) ? data[name] : [data[name]];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue as any];
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rawSelectedValues = value !== undefined ? value : internalValue;
  const selectedValues = Array.isArray(rawSelectedValues) 
    ? rawSelectedValues 
    : (rawSelectedValues !== undefined && rawSelectedValues !== null ? [rawSelectedValues as any] : []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string | number) => {
    let newValues: Array<string | number>;

    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newValues = [...selectedValues, optionValue];
    }

    setInternalValue(newValues);
    if (name) setData(name, newValues);
    if (onChange) onChange(newValues);
  };

  const handleRemoveValue = (optionValue: string | number) => {
    const newValues = selectedValues.filter(v => v !== optionValue);
    setInternalValue(newValues);
    if (name) setData(name, newValues);
    if (onChange) onChange(newValues);
  };

  const getSelectedLabels = () => {
    return selectOptions
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label);
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border ${error ? 'border-red-400 ring-2 ring-red-500/10' : 'border-zinc-200 dark:border-zinc-700'} bg-white dark:bg-zinc-900`,
    filled: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} bg-zinc-50 dark:bg-zinc-800/50`,
    standard: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} bg-transparent`,
  };

  return (
    <div className={`my-4 relative ${isOpen ? 'z-50' : 'z-10'} ${fullWidth ? 'w-full' : 'max-w-md'}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${fullWidth ? 'w-full' : 'w-full'}
            rounded-xl text-zinc-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-orange-500/20
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            transition-all duration-200
            min-h-[2.5rem] flex items-center flex-wrap gap-1
          `.trim().replace(/\s+/g, ' ')}
        >
          {selectedValues.length === 0 ? (
            <span className="text-zinc-400">{placeholder}</span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium rounded-full"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveValue(selectOptions.find(opt => opt.label === label)?.value || '');
                  }}
                  className="hover:text-orange-900 dark:hover:text-orange-200 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl shadow-xl shadow-black/8 dark:shadow-black/30 max-h-60 overflow-auto py-1">
            {selectOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isDisabled = disabled || option.disabled || (maxSelections !== undefined && selectedValues.length >= maxSelections && !isSelected);

              return (
                <div
                  key={index}
                  onClick={() => !isDisabled && handleToggleOption(option.value)}
                  className={`
                    px-3 py-2.5 flex items-center gap-2 rounded-lg mx-1 text-sm
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50'}
                    ${isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : ''}
                    transition-colors
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }}
                      disabled={isDisabled}
                      className="w-4 h-4 rounded border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  )}
                  <span className="text-zinc-800 dark:text-zinc-300">{option.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;

export const metadata = {
  name: 'multi-select',
  category: 'inputs' as const,
  component: MultiSelect,
  description: 'Multi-select dropdown with checkboxes, tags display, and max selection limit. Supports validation and styling variants.',
  tags: ['ui', 'input', 'form', 'select', 'multiselect', 'dropdown'],
};
