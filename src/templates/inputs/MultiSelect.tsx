import React, { useState, useRef, useEffect } from 'react';

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
  onChange?: (value: Array<string | number>) => void;
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
}) => {
  const [internalValue, setInternalValue] = useState<Array<string | number>>(defaultValue || []);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedValues = value !== undefined ? value : internalValue;
  const selectOptions = options || items || [];

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
    if (onChange) onChange(newValues);
  };

  const handleRemoveValue = (optionValue: string | number) => {
    const newValues = selectedValues.filter(v => v !== optionValue);
    setInternalValue(newValues);
    if (onChange) onChange(newValues);
  };

  const getSelectedLabels = () => {
    return selectOptions
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label);
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
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${fullWidth ? 'w-full' : 'w-full'}
            rounded-lg text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-all duration-200
            min-h-[2.5rem] flex items-center flex-wrap gap-1
          `.trim().replace(/\s+/g, ' ')}
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-sm rounded"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveValue(selectOptions.find(opt => opt.label === label)?.value || '');
                  }}
                  className="hover:text-gray-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {selectOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isDisabled = disabled || option.disabled || (maxSelections !== undefined && selectedValues.length >= maxSelections && !isSelected);

              return (
                <div
                  key={index}
                  onClick={() => !isDisabled && handleToggleOption(option.value)}
                  className={`
                    px-4 py-2 flex items-center gap-2
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700'}
                    ${isSelected ? 'bg-gray-700' : ''}
                    transition-colors
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={isDisabled}
                      className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  )}
                  <span className="text-gray-300">{option.label}</span>
                </div>
              );
            })}
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

export default MultiSelect;

export const metadata = {
  name: 'multi-select',
  category: 'inputs' as const,
  component: MultiSelect,
  description: 'Multi-select dropdown with checkboxes, tags display, and max selection limit. Supports validation and styling variants.',
  tags: ['ui', 'input', 'form', 'select', 'multiselect', 'dropdown'],
};
