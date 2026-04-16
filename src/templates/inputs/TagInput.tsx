import React, { useState, useRef, type KeyboardEvent } from 'react';

interface TagInputProps {
  label?: string;
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  tags?: string[];
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  separator?: string | RegExp;
  validateTag?: (tag: string) => boolean;
  onChange?: (tags: string[]) => void;
  onAdd?: (tag: string) => void;
  onRemove?: (tag: string) => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  placeholder = 'Type and press Enter...',
  value,
  defaultValue,
  tags: propTags,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  maxTags,
  allowDuplicates = false,
  separator,
  validateTag,
  onChange,
  onAdd,
  onRemove,
}) => {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue || propTags || []);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTags = value !== undefined ? value : internalTags;

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (validateTag && !validateTag(trimmedTag)) return;

    if (!allowDuplicates && currentTags.includes(trimmedTag)) return;

    if (maxTags && currentTags.length >= maxTags) return;

    const newTags = [...currentTags, trimmedTag];
    setInternalTags(newTags);
    setInputValue('');
    if (onChange) onChange(newTags);
    if (onAdd) onAdd(trimmedTag);
  };

  const removeTag = (index: number) => {
    const tagToRemove = currentTags[index];
    const newTags = currentTags.filter((_, i) => i !== index);
    setInternalTags(newTags);
    if (onChange) onChange(newTags);
    if (onRemove) onRemove(tagToRemove);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (separator instanceof RegExp || typeof separator === 'string') {
      const parts = newValue.split(separator);
      if (parts.length > 1) {
        parts.slice(0, -1).forEach(part => addTag(part));
        setInputValue(parts[parts.length - 1]);
        return;
      }
    }

    setInputValue(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && currentTags.length > 0) {
      e.preventDefault();
      removeTag(currentTags.length - 1);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const variantClasses = {
    outlined: `border ${error ? 'border-red-400 ring-2 ring-red-500/10' : 'border-zinc-200 dark:border-zinc-700'} focus-within:border-orange-500 bg-white dark:bg-zinc-900`,
    filled: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} focus-within:border-orange-500 bg-zinc-50 dark:bg-zinc-800/50`,
    standard: `border-b-2 ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'} focus-within:border-orange-500 bg-transparent`,
  };

  const tagSizeClasses = {
    small: 'px-2.5 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <div className={`my-4 ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div
        onClick={handleContainerClick}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : 'w-full'}
          rounded-xl text-zinc-900 dark:text-white
          focus-within:ring-2 focus-within:ring-orange-500/20
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}
          transition-all duration-200
          flex flex-wrap gap-2 items-center min-h-[2.5rem]
        `.trim().replace(/\s+/g, ' ')}
      >
        {currentTags.map((tag, index) => (
          <span
            key={index}
            className={`
              ${tagSizeClasses[size]}
              inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium rounded-full
              transition-all duration-150
            `.trim().replace(/\s+/g, ' ')}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:text-orange-900 dark:hover:text-orange-200 focus:outline-none transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={currentTags.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags !== undefined && currentTags.length >= maxTags)}
          className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
        />
      </div>
      {(helperText || (error && errorMessage) || maxTags) && (
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${error ? 'text-red-400' : 'text-zinc-400'}`}>
            {error && errorMessage ? errorMessage : helperText}
          </p>
          {maxTags && (
            <p className="text-xs text-zinc-400">
              {currentTags.length} / {maxTags}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;

export const metadata = {
  name: 'tag-input',
  category: 'inputs' as const,
  component: TagInput,
  description: 'Tag input component for adding and removing tags with keyboard support, validation, and max limits. Supports custom separators.',
  tags: ['ui', 'input', 'form', 'tags', 'chips', 'labels'],
};
