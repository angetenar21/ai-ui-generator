import React, { useState, useEffect, useRef } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const rawOptions = options || items || [];
  const selectOptions = rawOptions.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt };
    }
    return opt as SelectOption;
  }).filter(opt => opt && typeof opt === 'object');

  const [internalValue, setInternalValue] = useState<string | number>(() => {
    if (name && data && data[name] !== undefined) return data[name];
    return defaultValue !== undefined ? defaultValue : '';
  });
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = value !== undefined ? value : internalValue;

  const selectedLabel = selectOptions.find(o => String(o.value) === String(displayValue))?.label;

  // Sync from DataContext
  useEffect(() => {
    if (name && data && data[name] !== undefined && data[name] !== internalValue) {
      setInternalValue(data[name]);
    }
  }, [data, name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string | number) => {
    setInternalValue(optValue);
    setIsOpen(false);
    if (onChange) onChange(optValue);
    if (name && setData) setData(name, optValue);
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-5 py-3 text-base',
  };

  const triggerBorderClass = error
    ? 'border-red-400 ring-2 ring-red-500/10'
    : isOpen
      ? 'border-orange-500 ring-2 ring-orange-500/20'
      : 'border-zinc-200 dark:border-zinc-700';

  const variantTriggerBg = {
    outlined: `bg-white dark:bg-zinc-900 border ${triggerBorderClass}`,
    filled: `bg-zinc-50 dark:bg-zinc-800/50 border-b-2 border-t-0 border-x-0 ${triggerBorderClass} rounded-t-xl`,
    standard: `bg-transparent border-b-2 border-t-0 border-x-0 ${triggerBorderClass}`,
  };

  return (
    <div className={`my-4 relative ${isOpen ? 'z-50' : 'z-10'} ${fullWidth ? 'w-full' : 'max-w-md'}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            ${sizeClasses[size]}
            ${variantTriggerBg[variant]}
            ${fullWidth ? 'w-full' : 'min-w-[160px] w-full'}
            ${variant === 'outlined' ? 'rounded-xl' : ''}
            flex items-center justify-between gap-2
            text-left
            text-zinc-900 dark:text-white
            transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
          `.trim().replace(/\s+/g, ' ')}
        >
          <span className={`truncate ${!selectedLabel ? 'text-zinc-400 dark:text-zinc-500' : ''}`}>
            {selectedLabel || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Panel */}
        {isOpen && selectOptions.length > 0 && (
          <div
            className="absolute z-50 mt-1.5 w-full min-w-[160px] bg-white dark:bg-zinc-800
                       border border-zinc-200/60 dark:border-zinc-700/60
                       rounded-xl shadow-xl shadow-black/8 dark:shadow-black/30"
          >
            {/* overflow-hidden is ONLY on the scroll div, NOT the outer panel — prevents focus ring clipping */}
            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin rounded-xl">
              {selectOptions.map((option, index) => {
                const isSelected = String(option.value) === String(displayValue);
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    className={`
                      w-[calc(100%-0.5rem)] text-left px-3 py-2.5 text-sm transition-colors rounded-lg mx-1
                      ${isSelected
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium'
                        : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                      }
                      ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `.trim().replace(/\s+/g, ' ')}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={isSelected ? '' : 'ml-5'}>{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
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
  description: 'Custom select dropdown with smooth animation, search, and theme support.',
  tags: ['ui', 'input', 'form', 'select', 'dropdown'],
};
