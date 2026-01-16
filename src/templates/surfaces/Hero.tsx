import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: 'arrow' | 'play' | 'none';
  action?: string;
}

interface HeroProps {
  /** Main headline */
  title: string;

  /** Supporting subtitle/tagline */
  subtitle?: string;

  /** Optional description text */
  description?: string;

  /** Background style */
  backgroundStyle?: 'gradient' | 'solid' | 'image';

  /** Background image URL (if backgroundStyle is 'image') */
  backgroundImage?: string;

  /** Call-to-action buttons */
  buttons?: HeroButton[];

  /** Text alignment */
  align?: 'left' | 'center';

  /** Size variant */
  size?: 'normal' | 'large';
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundStyle = 'gradient',
  backgroundImage,
  buttons = [],
  align = 'center',
  size = 'normal',
}) => {
  if (!title) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 my-2">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Hero section requires a title</div>
      </div>
    );
  }

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  const titleSizeClasses = {
    normal: 'text-4xl md:text-5xl',
    large: 'text-5xl md:text-6xl lg:text-7xl',
  };

  const getBackgroundClass = () => {
    if (backgroundStyle === 'image' && backgroundImage) {
      return 'bg-cover bg-center';
    }
    if (backgroundStyle === 'gradient') {
      return 'bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30';
    }
    return 'bg-gray-50 dark:bg-gray-800';
  };

  const getButtonVariantClass = (variant: string = 'primary') => {
    const variants = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white',
      secondary: 'bg-teal-500 hover:bg-teal-600 text-white',
      outline: 'border-2 border-orange-500 text-orange-500 dark:text-orange-400 hover:bg-orange-500 hover:text-white',
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  };

  const getButtonIcon = (iconName?: string) => {
    if (iconName === 'arrow') return <ArrowRight className="w-5 h-5" />;
    if (iconName === 'play') return <Play className="w-5 h-5" />;
    return null;
  };

  return (
    <div
      className={`
        ${getBackgroundClass()}
        border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden my-4
        relative
      `}
      style={
        backgroundStyle === 'image' && backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {/* Overlay for better text readability on images */}
      {backgroundStyle === 'image' && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" />
      )}

      <div className="relative z-10 px-6 py-16 md:py-24 lg:py-32">
        <div className={`max-w-4xl mx-auto flex flex-col gap-6 ${alignClasses[align]}`}>
          {/* Subtitle/Eyebrow */}
          {subtitle && (
            <div className="text-teal-600 dark:text-teal-400 font-semibold text-sm md:text-base uppercase tracking-wider">
              {subtitle}
            </div>
          )}

          {/* Main Title */}
          <h1 className={`
            ${titleSizeClasses[size]}
            font-display font-bold text-gray-900 dark:text-gray-100
            leading-tight
          `}>
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          {buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 mt-4 ${align === 'center' ? 'justify-center' : ''}`}>
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`
                    ${getButtonVariantClass(button.variant)}
                    px-6 py-3 rounded-lg font-semibold
                    flex items-center gap-2
                    transition-all transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                  `}
                >
                  {button.label}
                  {button.icon && button.icon !== 'none' && getButtonIcon(button.icon)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

export const metadata = {
  name: 'hero',
  category: 'surfaces' as const,
  component: Hero,
  description: 'Hero section for landing pages with title, subtitle, description, and CTA buttons',
  tags: ['hero', 'banner', 'landing', 'header', 'cta', 'showcase'],
  propTypes: {
    title: 'string (required) - Main headline text',
    subtitle: 'string - Supporting subtitle or eyebrow text',
    description: 'string - Optional descriptive text',
    backgroundStyle: 'string - Background: gradient, solid, image (default: gradient)',
    backgroundImage: 'string - Background image URL (used with backgroundStyle: image)',
    buttons: 'array - Array of button objects with label, variant, icon, and action',
    align: 'string - Text alignment: left, center (default: center)',
    size: 'string - Size variant: normal, large (default: normal)',
  },
};
