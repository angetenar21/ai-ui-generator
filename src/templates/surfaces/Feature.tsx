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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">Feature card requires title and description</div>
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
    primary: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  };

  const IconComponent = iconMap[icon] || Star;

  const isVertical = orientation === 'vertical';

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 ease-out group">
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} gap-4`}>
        {/* Icon */}
        <div className={`
          flex-shrink-0
          ${isVertical ? 'mb-2' : ''}
        `}>
          <div className={`
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            ${iconColorClasses[iconColor]}
            group-hover:scale-110 transition-transform
          `}>
            <IconComponent className="w-6 h-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-zinc-900 dark:text-zinc-100 font-display font-bold text-lg mb-2">
            {title}
          </h3>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
            {description}
          </p>

          {link && (
            <a
              href={link}
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
            >
              {linkText}
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
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
