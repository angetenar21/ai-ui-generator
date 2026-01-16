import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getSurfaceClasses, getToneClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ToneVariant } from '../core/types';

interface PanelProps {
  /** Panel header/title */
  title: string;

  /** Panel content */
  content?: string;

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

  /** Optional children (for nested components) */
  children?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  title,
  content,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  variant = 'default',
  elevation = 'raised',
  emphasis = 'medium',
  tone,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  if (!title) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 my-2">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Panel requires a title</div>
      </div>
    );
  }

  // Build classes using design tokens
  const surfaceClasses = tone
    ? getToneClasses(tone, emphasis)
    : getSurfaceClasses(variant, elevation);

  // Force text to be readable - add text color classes as important overrides for inline styles
  const textColorClass = 'text-gray-900 dark:text-white';
  const secondaryTextClass = 'text-gray-600 dark:text-gray-300';

  return (
    <div className={`${surfaceClasses} rounded-xl my-2 overflow-hidden transition-all duration-300 w-full max-w-full ${textColorClass}`}>
      {/* Header */}
      <div
        className={`
          px-4 py-3 border-b border-gray-200 dark:border-gray-700
          ${collapsible ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' : ''}
        `}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h3 className={`${textColorClass} font-semibold text-sm truncate`}>
            {title}
          </h3>

          {collapsible && (
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
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

      {/* Content */}
      {!isCollapsed && (
        <>
          <div className="px-4 py-3 overflow-hidden">
            {content && (
              <div className={`${secondaryTextClass} text-sm leading-relaxed`}>
                {content}
              </div>
            )}

            {children && (
              <div className="space-y-3 overflow-hidden">
                {children}
              </div>
            )}

            {!content && !children && (
              <div className="text-gray-400 dark:text-gray-500 text-xs text-center py-2">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
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
    title: 'string (required) - Panel header/title',
    content: 'string - Main content text',
    footer: 'string - Optional footer content',
    collapsible: 'boolean - Make panel collapsible (default: false)',
    defaultCollapsed: 'boolean - Start collapsed (default: false)',
    variant: 'SurfaceVariant - Visual style: default | gradient | accent | glass | elevated | subtle (default: default)',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    emphasis: 'EmphasisLevel - Visual emphasis: low | medium | high (default: medium)',
    tone: 'ToneVariant - Semantic tone: neutral | primary | accent | success | warning | error | info',
    children: 'ReactNode - Optional nested components',
  },
};
