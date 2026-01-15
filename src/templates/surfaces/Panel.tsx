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

  return (
    <div className={`${surfaceClasses} rounded-xl my-4 overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div
        className={`
          px-6 py-4 border-b border-border-main
          ${collapsible ? 'cursor-pointer hover:bg-bg-sub/50 transition-colors' : ''}
        `}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-text-primary font-semibold text-lg">
            {title}
          </h3>

          {collapsible && (
            <button
              className="text-text-tertiary hover:text-text-primary transition-colors"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          <div className="px-6 py-4">
            {content && (
              <div className="text-text-secondary leading-relaxed">
                {content}
              </div>
            )}

            {children && (
              <div className="space-y-2">
                {children}
              </div>
            )}

            {!content && !children && (
              <div className="text-text-tertiary text-sm text-center py-2">
                No content
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-3 border-t border-border-main bg-bg-sub/30">
              <div className="text-text-tertiary text-sm">
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
