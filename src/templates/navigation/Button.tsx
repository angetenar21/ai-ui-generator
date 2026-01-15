import React from 'react';

interface ButtonProps {
  label?: string;
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  text,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
}) => {
  const content = label || text || 'Button';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10',
    ghost: 'text-gray-300 hover:bg-gray-700/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    rounded-lg font-medium transition-all duration-200
    flex items-center justify-center gap-2
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {content}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};

export default Button;

export const metadata = {
  name: 'button',
  category: 'navigation' as const,
  component: Button,
  description: 'Interactive button component with multiple variants and sizes',
  tags: ['ui', 'interactive', 'navigation'],
};
