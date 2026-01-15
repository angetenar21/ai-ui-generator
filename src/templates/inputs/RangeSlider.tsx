import React, { useState } from 'react';

interface RangeSliderProps {
  label?: string;
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  showValues?: boolean;
  showLabels?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  onChange?: (value: [number, number]) => void;
  onChangeCommitted?: (value: [number, number]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  required = false,
  showValues = true,
  showLabels = true,
  color = 'primary',
  size = 'medium',
  helperText,
  error = false,
  errorMessage,
  onChange,
  onChangeCommitted,
}) => {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const displayValue = value !== undefined ? value : internalValue;

  const [minValue, maxValue] = displayValue;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    const newValue: [number, number] = [Math.min(newMin, maxValue - step), maxValue];
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    const newValue: [number, number] = [minValue, Math.max(newMax, minValue + step)];
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleChangeCommitted = () => {
    if (onChangeCommitted) onChangeCommitted(displayValue);
  };

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const colorClasses = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
  };

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
          {showValues && (
            <span className="text-sm text-gray-400 font-mono">
              {minValue} - {maxValue}
            </span>
          )}
        </div>
      )}
      <div className="relative pt-1 pb-6">
        <div className="relative h-2">
          <div
            className="absolute h-2 bg-gray-700 rounded"
            style={{
              left: 0,
              right: 0,
            }}
          />
          <div
            className="absolute h-2 rounded"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
              backgroundColor: error ? '#ef4444' : colorClasses[color],
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinChange}
            onMouseUp={handleChangeCommitted}
            onTouchEnd={handleChangeCommitted}
            disabled={disabled}
            required={required}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ zIndex: minValue > max - (max - min) / 2 ? 5 : 4 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxChange}
            onMouseUp={handleChangeCommitted}
            onTouchEnd={handleChangeCommitted}
            disabled={disabled}
            required={required}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ zIndex: maxValue <= max - (max - min) / 2 ? 5 : 4 }}
          />
          <style>{`
            input[type="range"] {
              pointer-events: all;
            }
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: ${thumbSizeClasses[size].split(' ')[0].replace('w-', '')}rem;
              height: ${thumbSizeClasses[size].split(' ')[1].replace('h-', '')}rem;
              background: white;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.2s;
              pointer-events: all;
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
              pointer-events: all;
            }
            input[type="range"]::-moz-range-thumb:hover {
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
            }
          `}</style>
        </div>
        {showLabels && (
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{min}</span>
            <span>{max}</span>
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

export default RangeSlider;

export const metadata = {
  name: 'range-slider',
  category: 'inputs' as const,
  component: RangeSlider,
  description: 'Dual-handle range slider for selecting a range between min and max values. Supports steps, colors, and value display.',
  tags: ['ui', 'input', 'form', 'slider', 'range', 'dual'],
};
