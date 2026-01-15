import type { ComponentMetadata, ComponentCategory } from './types';

/**
 * Utility functions for component management
 */

/**
 * Normalize component names to kebab-case
 * LineChart -> line-chart
 * DataTable -> data-table
 */
export function normalizeComponentName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Convert component name to PascalCase for display
 * line-chart -> LineChart
 */
export function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: ComponentCategory): string {
  const displayNames: Record<ComponentCategory, string> = {
    charts: 'Charts & Graphs',
    'data-display': 'Data Display',
    inputs: 'Form Inputs',
    layout: 'Layout Components',
    navigation: 'Navigation',
    feedback: 'Feedback & Alerts',
    surfaces: 'Surfaces & Cards',
    media: 'Media Components',
    advanced: 'Advanced Components',
    legacy: 'Legacy Components',
  };

  return displayNames[category] || category;
}

/**
 * Group components by category
 */
export function groupByCategory(
  components: ComponentMetadata[]
): Record<ComponentCategory, ComponentMetadata[]> {
  const grouped = {} as Record<ComponentCategory, ComponentMetadata[]>;

  components.forEach((component) => {
    if (!grouped[component.category]) {
      grouped[component.category] = [];
    }
    grouped[component.category].push(component);
  });

  return grouped;
}

/**
 * Filter components by search query
 */
export function filterComponents(
  components: ComponentMetadata[],
  query: string
): ComponentMetadata[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return components;
  }

  return components.filter((component) => {
    // Search in name
    if (component.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in description
    if (component.description?.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in tags
    if (component.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    // Search in category
    if (component.category.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * Sort components by name
 */
export function sortComponents(
  components: ComponentMetadata[],
  order: 'asc' | 'desc' = 'asc'
): ComponentMetadata[] {
  return [...components].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Get component statistics
 */
export interface ComponentStats {
  total: number;
  byCategory: Record<string, number>;
  topCategories: Array<{ category: string; count: number }>;
}

export function getComponentStats(components: ComponentMetadata[]): ComponentStats {
  const byCategory: Record<string, number> = {};

  components.forEach((component) => {
    const category = component.category;
    byCategory[category] = (byCategory[category] || 0) + 1;
  });

  const topCategories = Object.entries(byCategory)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: components.length,
    byCategory,
    topCategories,
  };
}

/**
 * Validate component metadata
 */
export function validateComponentMetadata(metadata: Partial<ComponentMetadata>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata.name) {
    errors.push('Component name is required');
  }

  if (!metadata.category) {
    errors.push('Component category is required');
  }

  if (!metadata.component) {
    errors.push('Component reference is required');
  }

  if (metadata.name && !/^[a-z0-9-]+$/.test(metadata.name)) {
    errors.push('Component name must be in kebab-case (lowercase letters, numbers, and hyphens)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create a component metadata object with defaults
 */
export function createComponentMetadata(
  name: string,
  category: ComponentCategory,
  component: any,
  options?: {
    description?: string;
    tags?: string[];
    propTypes?: Record<string, any>;
  }
): ComponentMetadata {
  return {
    name: normalizeComponentName(name),
    category,
    component,
    description: options?.description,
    tags: options?.tags || [],
    propTypes: options?.propTypes,
  };
}

/**
 * Log registry statistics to console
 */
export function logRegistryStats(stats: ComponentStats): void {
  console.group('📊 Component Registry Statistics');
  console.log(`Total components: ${stats.total}`);
  console.log('\nBy category:');
  stats.topCategories.forEach(({ category, count }) => {
    console.log(`  ${getCategoryDisplayName(category as ComponentCategory)}: ${count}`);
  });
  console.groupEnd();
}

/**
 * Deep merge props (useful for component wrappers)
 */
export function mergeProps<T extends Record<string, any>>(
  defaultProps: T,
  userProps: Partial<T>
): T {
  return {
    ...defaultProps,
    ...userProps,
  };
}

/**
 * Check if a value is a valid React component
 */
export function isValidComponent(value: any): boolean {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && '$$typeof' in value)
  );
}

/**
 * Color utility functions for templates
 */

/**
 * Default color palette for charts (matches the design system)
 */
export const DEFAULT_CHART_COLORS = [
  '#F97316', // Primary orange
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#22C55E', // Jade
];

/**
 * Get color from user input or fallback to default
 * This ensures templates respect user-provided colors while having good defaults
 */
export function getColor(userColor?: string, defaultColor?: string, index: number = 0): string {
  // Always prioritize user-provided color
  if (userColor && isValidHexColor(userColor)) {
    return userColor;
  }

  // Use default if provided
  if (defaultColor && isValidHexColor(defaultColor)) {
    return defaultColor;
  }

  // Fallback to palette by index
  return DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
}

/**
 * Process series array to ensure all items have valid colors
 * Respects user-provided colors, fills in defaults where needed
 */
export function processSeriesColors<T extends { color?: string }>(
  series: T[],
  defaultColors: string[] = DEFAULT_CHART_COLORS
): (T & { color: string })[] {
  return series.map((item, index) => ({
    ...item,
    color: getColor(item.color, defaultColors[index % defaultColors.length], index),
  }));
}

/**
 * Get theme-aware text color for light/dark mode
 */
export function getTextColor(variant: 'primary' | 'secondary' | 'muted' = 'primary'): string {
  // This will be used with CSS classes, but we can provide fallback values
  const colors = {
    primary: '#111827',   // text-text-primary
    secondary: '#374151', // text-text-secondary
    muted: '#6B7280',     // text-text-muted
  };
  return colors[variant];
}
