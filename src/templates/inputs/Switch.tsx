import React, { useState } from 'react';

interface SwitchProps {
  label?: string;
  text?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  labelPosition?: 'left' | 'right';
  onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  text,
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  color = 'primary',
  size = 'medium',
  labelPosition = 'right',
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const displayLabel = label || text;

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setInternalChecked(newChecked);
      if (onChange) onChange(newChecked);
    }
  };

  const sizeClasses = {
    small: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    medium: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    large: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className="my-4">
      <div className={`flex items-center ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : ''}`}>
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={handleChange}
          disabled={disabled}
          className={`
            ${sizeConfig.track}
            ${isChecked ? colorClasses[color] : 'bg-gray-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            relative inline-flex items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
          `.trim().replace(/\s+/g, ' ')}
        >
          <span
            className={`
              ${sizeConfig.thumb}
              ${isChecked ? sizeConfig.translate : 'translate-x-0.5'}
              inline-block transform rounded-full bg-white
              transition-transform duration-200 ease-in-out
              shadow-lg
            `.trim().replace(/\s+/g, ' ')}
          />
        </button>
        {displayLabel && (
          <label
            className={`text-sm text-gray-300 cursor-pointer select-none ${labelPosition === 'left' ? 'mr-3' : 'ml-3'}`}
            onClick={handleChange}
          >
            {displayLabel}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
      </div>
    </div>
  );
};

export default Switch;

export const metadata = {
  name: 'switch',
  category: 'inputs' as const,
  component: Switch,
  description: 'Toggle switch component with customizable colors, sizes, and label positioning. Modern on/off control.',
  tags: ['ui', 'input', 'form', 'switch', 'toggle'],
};
