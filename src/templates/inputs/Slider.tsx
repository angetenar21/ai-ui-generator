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
  marks?: Array<{ value: number; label: string 
  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}>;
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

  // Helper function to get color value based on color prop and error state
  const getColorValue = (colorProp: string): string => {
    if (error) return '#EF4444'; // red-500

    const colorMap: Record<string, string> = {
      primary: '#f97316',   // orange-500
      secondary: '#6B7280', // zinc-500
      success: '#10B981',   // green-500
      warning: '#F59E0B',   // amber-500
      error: '#EF4444',     // red-500
    };

    return colorMap[colorProp] || colorProp;
  };

  // const sizeClasses = {
  //   small: 'h-1',
  //   medium: 'h-2',
  //   large: 'h-3',
  // };

  const thumbSizeCss = {
    small: '14px',
    medium: '20px',
    large: '26px',
  };

  return (
    <div className="my-4 max-w-md">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
            {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
          </label>
          {showValue && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
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
            className="w-full h-2 rounded-full bg-transparent appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, ${getColorValue(color)} 0%, ${getColorValue(color)} ${percentage}%, #e4e4e7 ${percentage}%, #e4e4e7 100%)`,
              borderRadius: '9999px',
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: ${thumbSizeCss[size]};
              height: ${thumbSizeCss[size]};
              background: white;
              border-radius: 50%;
              cursor: pointer;
              border: 2px solid ${getColorValue(color)};
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06);
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 6px ${getColorValue(color)}20;
              transform: scale(1.15);
            }
            input[type="range"]::-moz-range-thumb {
              width: ${thumbSizeCss[size]};
              height: ${thumbSizeCss[size]};
              background: white;
              border-radius: 50%;
              cursor: pointer;
              border: 2px solid ${getColorValue(color)};
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06);
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            input[type="range"]::-moz-range-thumb:hover {
              box-shadow: 0 0 0 6px ${getColorValue(color)}20;
              transform: scale(1.15);
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
                  <div className="w-0.5 h-2 bg-zinc-500 mx-auto"></div>
                  <span className="block text-xs text-zinc-400 mt-1 whitespace-nowrap">
                    {mark.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-zinc-400'}`}>
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
