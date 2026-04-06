import React from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Plus, Minus, X, Check, Download, Upload, Search, Settings, Menu, Home, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';

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
  children,
}) => {
  const content = label || text || children || '';

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
    'skipback': <SkipBack className="w-4 h-4" />,
    'skipforward': <SkipForward className="w-4 h-4" />,
    'previous': <SkipBack className="w-4 h-4" />,
    'next': <SkipForward className="w-4 h-4" />,
    'volume': <Volume2 className="w-4 h-4" />,
    'volume2': <Volume2 className="w-4 h-4" />,
    'mute': <VolumeX className="w-4 h-4" />,
    'shuffle': <Shuffle className="w-4 h-4" />,
    'repeat': <Repeat className="w-4 h-4" />,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const normalizedName = iconName.toLowerCase().replace(/[\s-_]/g, '');
    return iconMap[normalizedName] || null;
  };

  const variantClasses = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(16,185,129,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_4px_12px_rgba(16,185,129,0.4)]',
    secondary: 'bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_2px_rgba(0,0,0,0.2)]',
    outline: 'border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm',
    ghost: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200 dark:active:bg-white/20',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(239,68,68,0.3)]',
    success: 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(20,184,166,0.3)]',
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
    ${disabled ? 'opacity-50 cursor-not-allowed select-none' : 'cursor-pointer'}
    rounded-lg sm:rounded-xl font-medium tracking-tight transition-all duration-200
    flex items-center justify-center gap-2 select-none
  `.trim().replace(/\s+/g, ' ');

  const iconElement = getIcon(icon);

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {iconElement && iconPosition === 'left' && iconElement}
      {content && <span>{content}</span>}
      {iconElement && iconPosition === 'right' && iconElement}
      {!content && !iconElement && <span>Button</span>}
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
  propTypes: {
    label: 'string - Text to display on the button',
    text: 'string - Alternative to label',
    variant: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'",
    size: "'small' | 'medium' | 'large'",
    disabled: 'boolean',
    icon: 'string - lucide icon name (e.g. "play", "settings", "search", "plus", "check")',
    iconPosition: "'left' | 'right'",
    fullWidth: 'boolean',
  },
};
