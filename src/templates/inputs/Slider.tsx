import React, { useState } from 'react';

interface SliderProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: Array<{ value: number; label: string }>;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  onChange?: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  required = false,
  showValue = true,
  showMarks = false,
  marks,
  color = 'primary',
  size = 'medium',
  helperText,
  error = false,
  errorMessage,
  onChange,
  onChangeCommitted,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleChangeCommitted = () => {
    if (onChangeCommitted) onChangeCommitted(displayValue);
  };

  const percentage = ((displayValue - min) / (max - min)) * 100;

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  // const sizeClasses = {
  //   small: 'h-1',
  //   medium: 'h-2',
  //   large: 'h-3',
  // };

  const thumbSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <div className="my-4 max-w-md">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {showValue && (
            <span className="text-sm text-gray-400 font-mono">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div className="relative pt-1">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={displayValue}
            onChange={handleChange}
            onMouseUp={handleChangeCommitted}
            onTouchEnd={handleChangeCommitted}
            disabled={disabled}
            required={required}
            className="w-full h-2 bg-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, ${error ? '#ef4444' : colorClasses[color].replace('bg-', '')} 0%, ${error ? '#ef4444' : colorClasses[color].replace('bg-', '')} ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: ${thumbSizeClasses[size].split(' ')[0].replace('w-', '')}rem;
              height: ${thumbSizeClasses[size].split(' ')[1].replace('h-', '')}rem;
              background: white;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.2s;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
            }
            input[type="range"]::-moz-range-thumb {
              width: ${thumbSizeClasses[size].split(' ')[0].replace('w-', '')}rem;
              height: ${thumbSizeClasses[size].split(' ')[1].replace('h-', '')}rem;
              background: white;
              border-radius: 50%;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.2s;
            }
            input[type="range"]::-moz-range-thumb:hover {
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
            }
          `}</style>
        </div>
        {showMarks && marks && marks.length > 0 && (
          <div className="relative mt-2">
            {marks.map((mark, index) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${markPercentage}%` }}
                >
                  <div className="w-0.5 h-2 bg-gray-500 mx-auto"></div>
                  <span className="block text-xs text-gray-400 mt-1 whitespace-nowrap">
                    {mark.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default Slider;

export const metadata = {
  name: 'slider',
  category: 'inputs' as const,
  component: Slider,
  description: 'Range slider component with customizable min/max values, steps, marks, and colors. Supports validation and real-time value display.',
  tags: ['ui', 'input', 'form', 'slider', 'range'],
};
