import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getSurfaceClasses, getToneClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ToneVariant, ComponentSpec } from '../core/types';

interface PanelProps {
  /** Panel header/title */
  title?: string;

  /** Panel content */
  content?: string;

  /** Secondary content text (alias for content) */
  description?: string;

  /** Footer content */
  footer?: string;

  /** Make panel collapsible */
  collapsible?: boolean;

  /** Default collapsed state (only applies if collapsible) */
  defaultCollapsed?: boolean;

  /** Surface variant for visual hierarchy */
  variant?: SurfaceVariant;

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Visual emphasis level */
  emphasis?: EmphasisLevel;

  /** Semantic tone */
  tone?: ToneVariant;

  /** Header variant: 'default' = with border-bottom, 'minimal' = no border (clean dashboard look) */
  headerVariant?: 'default' | 'minimal';

  /** Optional children (for nested components) */
  children?: ComponentSpec[];

  /** Function to render child component specs */
  renderChild?: (child: ComponentSpec) => React.ReactNode;

  /** Optional CSS class names */
  className?: string;
}

const Panel: React.FC<PanelProps> = ({
  title,
  content,
  description,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  variant = 'default',
  elevation = 'raised',
  emphasis = 'medium',
  tone,
  headerVariant = 'default',
  children,
  renderChild,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const displayContent = content || description;

  // Build classes using design tokens
  const surfaceClasses = tone
    ? getToneClasses(tone, emphasis)
    : getSurfaceClasses(variant, elevation);

  // Force text to be readable - add text color classes as important overrides for inline styles
  const textColorClass = 'text-zinc-900 dark:text-white';
  const secondaryTextClass = 'text-zinc-600 dark:text-zinc-300';

  return (
    <div className={`${surfaceClasses} rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${className || 'w-full'} max-w-full ${textColorClass} flex flex-col animate-slide-up`}>
      {/* Header */}
      {title && (
        <div
        className={`
          px-6 py-5
          ${headerVariant === 'default' && variant !== 'gradient' && variant !== 'accent' ? 'border-b border-white/20 dark:border-white/[0.07]' : ''}
          ${collapsible && variant !== 'gradient' && variant !== 'accent' ? 'cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 transition-colors' : ''}
          ${collapsible && (variant === 'gradient' || variant === 'accent') ? 'cursor-pointer transition-colors' : ''}
          rounded-t-2xl ${isCollapsed && !footer ? 'rounded-b-2xl' : ''}
        `}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h3 className={`${textColorClass} font-display font-bold text-xl md:text-2xl leading-snug tracking-tight mb-0.5`}>
            {title}
          </h3>


          {collapsible && (
            <button
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-transform duration-300 flex-shrink-0 ml-2"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <>
          <div className="px-5 py-4">
            {displayContent && (
              <div className={`${secondaryTextClass} text-sm leading-relaxed`}>
                {displayContent}
              </div>
            )}


            {children && children.length > 0 && renderChild && (
              <div className="space-y-4 mt-3">
                {children.map((child, index) => (
                  <div key={index}>{renderChild(child)}</div>
                ))}
              </div>
            )}

            {!displayContent && (!children || children.length === 0) && (
              <div className="text-zinc-400 dark:text-zinc-500 text-xs text-center py-4">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`px-5 py-3 border-t border-white/15 dark:border-white/[0.06] bg-white/15 dark:bg-white/[0.03] rounded-b-2xl`}>
              <div className={`${secondaryTextClass} text-xs`}>
                {footer}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Panel;

export const metadata = {
  name: 'panel',
  category: 'surfaces' as const,
  component: Panel,
  description: 'Panel container with header, content, optional footer, and collapsible functionality. Supports visual variants, elevation, emphasis, and semantic tones.',
  tags: ['panel', 'container', 'collapsible', 'accordion', 'section', 'card'],
  propTypes: {
    title: 'string - Optional Panel header/title',
    content: 'string - Main content text',
    footer: 'string - Optional footer content',
    collapsible: 'boolean - Make panel collapsible (default: false)',
    defaultCollapsed: 'boolean - Start collapsed (default: false)',
    variant: 'SurfaceVariant - Visual style: default | gradient | accent | glass | elevated | subtle (default: default)',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    emphasis: 'EmphasisLevel - Visual emphasis: low | medium | high (default: medium)',
    tone: 'ToneVariant - Semantic tone: neutral | primary | accent | success | warning | error | info',
    children: 'ReactNode - Optional nested components',
    className: 'string - Optional CSS class names',
  },
};
