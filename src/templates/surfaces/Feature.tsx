import React from 'react';
import { Star, Zap, Shield, Heart, TrendingUp, Check, Sparkles, Award } from 'lucide-react';

interface FeatureProps {
  /** Feature title */
  title: string;

  /** Feature description */
  description: string;

  /** Icon name */
  icon?: 'star' | 'zap' | 'shield' | 'heart' | 'trending' | 'check' | 'sparkles' | 'award';

  /** Icon color variant */
  iconColor?: 'primary' | 'cyan' | 'purple' | 'pink' | 'success';

  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal';

  /** Optional link URL */
  link?: string;

  /** Optional link text */
  linkText?: string;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  icon = 'star',
  iconColor = 'primary',
  orientation = 'vertical',
  link,
  linkText = 'Learn more',
}) => {
  if (!title || !description) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-lg p-4 my-2">
        <div className="text-text-tertiary text-sm">Feature card requires title and description</div>
      </div>
    );
  }

  const iconMap = {
    star: Star,
    zap: Zap,
    shield: Shield,
    heart: Heart,
    trending: TrendingUp,
    check: Check,
    sparkles: Sparkles,
    award: Award,
  };

  const iconColorClasses = {
    primary: 'bg-primary-500/20 text-primary-500',
    cyan: 'bg-accent-cyan/20 text-accent-cyan',
    purple: 'bg-accent-purple/20 text-accent-purple',
    pink: 'bg-accent-pink/20 text-accent-pink',
    success: 'bg-success/20 text-success',
  };

  const IconComponent = iconMap[icon] || Star;

  const isVertical = orientation === 'vertical';

  return (
    <div className="glass-dark border border-gray-700/50 rounded-lg p-6 my-2 hover:border-gray-600/50 transition-all group">
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} gap-4`}>
        {/* Icon */}
        <div className={`
          flex-shrink-0
          ${isVertical ? 'mb-2' : ''}
        `}>
          <div className={`
            w-12 h-12 rounded-lg
            flex items-center justify-center
            ${iconColorClasses[iconColor]}
            group-hover:scale-110 transition-transform
          `}>
            <IconComponent className="w-6 h-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-semibold text-lg mb-2">
            {title}
          </h3>
          
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {description}
          </p>

          {link && (
            <a
              href={link}
              className="text-primary-500 hover:text-primary-400 text-sm font-medium inline-flex items-center gap-1 transition-colors"
            >
              {linkText}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feature;

export const metadata = {
  name: 'feature',
  category: 'surfaces' as const,
  component: Feature,
  description: 'Feature highlight card with icon, title, description, and optional link',
  tags: ['feature', 'card', 'highlight', 'showcase', 'benefits', 'icon'],
  propTypes: {
    title: 'string (required) - Feature title',
    description: 'string (required) - Feature description',
    icon: 'string - Icon name: star, zap, shield, heart, trending, check, sparkles, award (default: star)',
    iconColor: 'string - Icon color: primary, cyan, purple, pink, success (default: primary)',
    orientation: 'string - Layout: vertical, horizontal (default: vertical)',
    link: 'string - Optional link URL',
    linkText: 'string - Link text (default: "Learn more")',
  },
};
