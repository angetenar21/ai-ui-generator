import type { ComponentType } from 'react';
import type { ComponentMetadata, ComponentCategory, IComponentRegistry } from './types';

/**
 * Singleton Component Registry
 *
 * This registry stores all available components and provides
 * lookup functionality to eliminate switch-case statements.
 *
 * Usage:
 * - Components register themselves on import via metadata export
 * - Renderer looks up components by name: registry.get('line-chart')
 * - No manual registration needed!
 */
class ComponentRegistry implements IComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentMetadata> = new Map();

  private constructor() {
    // Private constructor enforces singleton pattern
    console.log('[ComponentRegistry] Initialized');
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * Register a component in the registry
   */
  register(metadata: ComponentMetadata): void {
    if (this.components.has(metadata.name)) {
      console.warn(
        `[ComponentRegistry] Component "${metadata.name}" is already registered. Overwriting...`
      );
    }

    this.components.set(metadata.name, metadata);
    console.log(
      `[ComponentRegistry] Registered: ${metadata.name} (${metadata.category})`
    );
  }

  /**
   * Get a component by name
   */
  get(name: string): ComponentType<any> | undefined {
    return this.components.get(name)?.component;
  }

  /**
   * Get full metadata for a component
   */
  getMetadata(name: string): ComponentMetadata | undefined {
    return this.components.get(name);
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Get all registered components
   */
  getAll(): Map<string, ComponentMetadata> {
    return new Map(this.components);
  }

  /**
   * Get all component names
   */
  getNames(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Get components filtered by category
   */
  getByCategory(category: ComponentCategory): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      (metadata) => metadata.category === category
    );
  }

  /**
   * Get all unique categories
   */
  getCategories(): ComponentCategory[] {
    const categories = new Set<ComponentCategory>();
    this.components.forEach((metadata) => {
      categories.add(metadata.category);
    });
    return Array.from(categories);
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const stats = {
      total: this.components.size,
      byCategory: {} as Record<string, number>,
    };

    this.components.forEach((metadata) => {
      const category = metadata.category;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear all registered components (useful for testing)
   */
  clear(): void {
    this.components.clear();
    console.log('[ComponentRegistry] Cleared all components');
  }
}

// Export singleton instance
export const registry = ComponentRegistry.getInstance();

/**
 * Decorator function for auto-registration
 *
 * Usage in component files:
 * ```typescript
 * const LineChart: React.FC<LineChartProps> = (props) => { ... };
 *
 * export default LineChart;
 * export const metadata = {
 *   name: 'line-chart',
 *   category: 'charts',
 *   component: LineChart,
 *   description: 'A line chart component',
 * };
 * ```
 */
export function registerComponent(metadata: ComponentMetadata): void {
  registry.register(metadata);
}

/**
 * HOC (Higher Order Component) for registration
 * Alternative registration pattern using decorators
 *
 * @deprecated Use metadata export pattern instead
 */
export function Register(
  name: string,
  category: ComponentCategory,
  options?: {
    description?: string;
    propTypes?: Record<string, any>;
    tags?: string[];
  }
) {
  return function <T extends ComponentType<any>>(component: T): T {
    registry.register({
      name,
      category,
      component,
      description: options?.description,
      propTypes: options?.propTypes,
      tags: options?.tags,
    });
    return component;
  };
}
