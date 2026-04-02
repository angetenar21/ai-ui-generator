import React from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Plus, Minus, X, Check, Download, Upload, Search, Settings, Menu, Home } from 'lucide-react';

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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    'play': <Play className="w-4 h-4" />,
    'playarrow': <Play className="w-4 h-4" />,
    'pause': <Pause className="w-4 h-4" />,
    'chevronright': <ChevronRight className="w-4 h-4" />,
    'chevronleft': <ChevronLeft className="w-4 h-4" />,
    'plus': <Plus className="w-4 h-4" />,
    'add': <Plus className="w-4 h-4" />,
    'minus': <Minus className="w-4 h-4" />,
    'close': <X className="w-4 h-4" />,
    'x': <X className="w-4 h-4" />,
    'check': <Check className="w-4 h-4" />,
    'download': <Download className="w-4 h-4" />,
    'upload': <Upload className="w-4 h-4" />,
    'search': <Search className="w-4 h-4" />,
    'settings': <Settings className="w-4 h-4" />,
    'menu': <Menu className="w-4 h-4" />,
    'home': <Home className="w-4 h-4" />,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const normalizedName = iconName.toLowerCase().replace(/[\s-_]/g, '');
    return iconMap[normalizedName] || null;
  };

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/10',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2.5 text-base',
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

  const iconElement = getIcon(icon);

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {iconElement && iconPosition === 'left' && iconElement}
      {content}
      {iconElement && iconPosition === 'right' && iconElement}
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
