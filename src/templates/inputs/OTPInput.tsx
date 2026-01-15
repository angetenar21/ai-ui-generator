import React, { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';

interface OTPInputProps {
  label?: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  type?: 'number' | 'text';
  mask?: boolean;
  size?: 'small' | 'medium' | 'large';
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  label,
  length = 6,
  value,
  defaultValue = '',
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  type = 'number',
  mask = false,
  size = 'medium',
  autoFocus = true,
  onChange,
  onComplete,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue.split('').slice(0, length));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const displayValue = value !== undefined ? value.split('').slice(0, length) : internalValue;

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;

    const sanitizedValue = type === 'number' ? newValue.replace(/[^0-9]/g, '') : newValue;
    if (sanitizedValue.length > 1) return;

    const newOTP = [...displayValue];
    newOTP[index] = sanitizedValue;

    setInternalValue(newOTP);
    const otpString = newOTP.join('');
    if (onChange) onChange(otpString);

    if (sanitizedValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!displayValue[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        handleChange(index, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const sanitizedData = type === 'number' ? pastedData.replace(/[^0-9]/g, '') : pastedData;
    const chars = sanitizedData.split('').slice(0, length);

    const newOTP = [...displayValue];
    chars.forEach((char, i) => {
      newOTP[i] = char;
    });

    setInternalValue(newOTP);
    const otpString = newOTP.join('');
    if (onChange) onChange(otpString);

    const focusIndex = Math.min(chars.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  const sizeClasses = {
    small: 'w-10 h-10 text-base',
    medium: 'w-12 h-12 text-xl',
    large: 'w-14 h-14 text-2xl',
  };

  return (
    <div className="my-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2 justify-center max-w-md">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'number' ? 'numeric' : 'text'}
            maxLength={1}
            value={displayValue[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus && index === 0}
            className={`
              ${sizeClasses[size]}
              ${error ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'}
              text-center font-mono font-bold text-white bg-transparent
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `.trim().replace(/\s+/g, ' ')}
          />
        ))}
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-2 text-xs text-center ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default OTPInput;

export const metadata = {
  name: 'otp-input',
  category: 'inputs' as const,
  component: OTPInput,
  description: 'OTP (One-Time Password) input with auto-focus, paste support, and keyboard navigation. Supports masking and validation.',
  tags: ['ui', 'input', 'form', 'otp', 'verification', 'code'],
};
