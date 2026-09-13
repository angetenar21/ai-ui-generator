import React, { useState } from 'react';
import { useData } from '../core/DataContext';

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
  name?: string;
  onChange?: (checked: boolean) => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
  name,
}) => {
  const { setData } = useData();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const displayLabel = label || text;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setInternalChecked(newChecked);
    if (name) setData(name, newChecked);
    if (onChange) onChange(newChecked);
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-7 h-7',
  };

  const colorClasses = {
    primary: 'text-orange-500 focus:ring-orange-500/20',
    secondary: 'text-zinc-600 focus:ring-zinc-500/20',
    success: 'text-green-600 focus:ring-green-500/20',
    warning: 'text-yellow-600 focus:ring-yellow-500/20',
    error: 'text-red-600 focus:ring-red-500/20',
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
            ${error ? 'border-red-400' : 'border-zinc-300 dark:border-zinc-600'}
            rounded-md border-2 bg-white dark:bg-zinc-800
            focus:ring-2 focus:ring-offset-1
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
            cursor-pointer
          `.trim().replace(/\s+/g, ' ')}
        />
        {displayLabel && (
          <label className="ml-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            {displayLabel}
            {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </label>
        )}
      </div>
      {helperText && (
        <p className={`mt-1 ml-7 text-xs ${error ? 'text-red-400' : 'text-zinc-400'}`}>
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
