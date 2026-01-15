import type { ComponentType, ReactNode } from 'react';

/**
 * VISUAL DESIGN SYSTEM TYPES
 */

/** Surface variant for visual hierarchy */
export type SurfaceVariant = 'default' | 'gradient' | 'accent' | 'glass' | 'elevated' | 'subtle';

/** Elevation level for depth */
export type ElevationLevel = 'flat' | 'raised' | 'floating' | 'overlay';

/** Visual emphasis */
export type EmphasisLevel = 'low' | 'medium' | 'high';

/** Semantic tone */
export type ToneVariant = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

/** Chart color palette types */
export type ChartPaletteType = 'default' | 'vibrant' | 'pastel' | 'gradient' | 'monochrome' | 'semantic';

/**
 * Metadata for a registered component
 */
export interface ComponentMetadata {
  /** Unique component name (e.g., 'line-chart', 'data-table') */
  name: string;

  /** Component category (e.g., 'charts', 'inputs', 'layout') */
  category: ComponentCategory;

  /** The actual React component */
  component: ComponentType<any>;

  /** Optional TypeScript prop types definition */
  propTypes?: Record<string, any>;

  /** Optional description of what the component does */
  description?: string;

  /** Optional example usage */
  examples?: any[];

  /** Optional tags for search/filtering */
  tags?: string[];
}

/**
 * Component categories for organization
 */
export type ComponentCategory =
  | 'charts'
  | 'data-display'
  | 'inputs'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'surfaces'
  | 'media'
  | 'advanced'
  | 'legacy';

/**
 * Component specification from AI/API
 * Supports both formats:
 * - New format: {name, templateProps}
 * - Legacy format: {type, props}
 */
export interface ComponentSpec {
  // New format
  name?: string;
  templateProps?: Record<string, any>;

  // Legacy format (for backward compatibility)
  type?: string;
  props?: Record<string, any>;

  // Common fields
  children?: ComponentSpec[];
  metadata?: {
    description?: string;
    generatedAt?: string;
    componentId?: string;
  };
}

/**
 * Props that all template components receive
 */
export interface BaseTemplateProps {
  /** Child component specifications */
  children?: ComponentSpec[];

  /** Function to render a child component */
  renderChild?: (child: ComponentSpec) => ReactNode;

  /** Visual variant for surface styling */
  variant?: SurfaceVariant;

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Visual emphasis level */
  emphasis?: EmphasisLevel;

  /** Semantic tone */
  tone?: ToneVariant;

  /** Additional custom props */
  [key: string]: any;
}

/**
 * Props for Card components with visual variants
 */
export interface CardTemplateProps extends BaseTemplateProps {
  title?: string;
  description?: string;
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
  emphasis?: EmphasisLevel;
  tone?: ToneVariant;
}

/**
 * Props for Chart components with visual variants
 */
export interface ChartTemplateProps extends BaseTemplateProps {
  title?: string;
  description?: string;
  palette?: ChartPaletteType;
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
  emphasis?: EmphasisLevel;
  useGradient?: boolean;
}

/**
 * Props for Form container components
 */
export interface FormContainerProps extends BaseTemplateProps {
  title?: string;
  description?: string;
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
  emphasis?: EmphasisLevel;
  tone?: ToneVariant;
}

/**
 * Registry interface for type safety
 */
export interface IComponentRegistry {
  /** Register a new component */
  register(metadata: ComponentMetadata): void;

  /** Get a component by name */
  get(name: string): ComponentType<any> | undefined;

  /** Check if a component exists */
  has(name: string): boolean;

  /** Get all registered components */
  getAll(): Map<string, ComponentMetadata>;

  /** Get components by category */
  getByCategory(category: ComponentCategory): ComponentMetadata[];

  /** Get all component names */
  getNames(): string[];

  /** Get all categories */
  getCategories(): ComponentCategory[];
}

/**
 * Generation history entry
 */
export interface GenerationHistory {
  id: string;
  prompt: string;
  response: ComponentSpec;
  timestamp: number;
  threadId: string;
  sessionId: string;
}

/**
 * Template gallery item
 */
export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: TemplateCategory;
  tags: string[];
  previewImage?: string;
}

/**
 * Template categories
 */
export type TemplateCategory = 'form' | 'dashboard' | 'list' | 'card' | 'chart' | 'layout' | 'other';
