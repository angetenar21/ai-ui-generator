import React, { useState } from 'react';

interface CheckboxProps {
  label?: string;
  text?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  text,
  checked,
  defaultChecked = false,
  value,
  disabled = false,
  required = false,
  error = false,
  helperText,
  color = 'primary',
  size = 'medium',
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const displayLabel = label || text;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setInternalChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const colorClasses = {
    primary: 'text-blue-600 focus:ring-blue-500',
    secondary: 'text-gray-600 focus:ring-gray-500',
    success: 'text-green-600 focus:ring-green-500',
    warning: 'text-yellow-600 focus:ring-yellow-500',
    error: 'text-red-600 focus:ring-red-500',
  };

  return (
    <div className="my-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          required={required}
          className={`
            ${sizeClasses[size]}
            ${colorClasses[color]}
            ${error ? 'border-red-500' : 'border-gray-600'}
            rounded border-2 bg-gray-800
            focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            cursor-pointer
          `.trim().replace(/\s+/g, ' ')}
        />
        {displayLabel && (
          <label className="ml-2 text-sm text-gray-300 cursor-pointer select-none">
            {displayLabel}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
      </div>
      {helperText && (
        <p className={`mt-1 ml-7 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;

export const metadata = {
  name: 'checkbox',
  category: 'inputs' as const,
  component: Checkbox,
  description: 'Checkbox input component with customizable colors, sizes, and validation. Supports labels and helper text.',
  tags: ['ui', 'input', 'form', 'checkbox', 'toggle'],
};
