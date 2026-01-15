/**
 * Component Template System - Main Entry Point
 *
 * This file uses Vite's import.meta.glob to automatically discover
 * and register all components in the templates directory.
 *
 * NO MORE SWITCH-CASE STATEMENTS! 🎉
 *
 * Components self-register by exporting metadata:
 * export const metadata = { name: 'line-chart', category: 'charts', component: LineChart }
 */

import { registry, registerComponent } from './core/registry';
import { renderComponent, renderComponents, ComponentRenderer } from './core/renderer';
import { getComponentStats, logRegistryStats } from './core/utils';
import type { ComponentMetadata } from './core/types';

// Auto-discover and register all component modules using Vite glob
// This replaces manual imports and switch statements!
const componentModules = import.meta.glob<{
  default?: any;
  metadata?: ComponentMetadata;
}>('./**/*.{tsx,ts}', {
  eager: true,
});

// Register all components that export metadata
let registeredCount = 0;
for (const path in componentModules) {
  // Skip core files
  if (path.includes('/core/')) continue;

  try {
    const module = componentModules[path];
    const metadata = module.metadata;

    if (metadata && metadata.name && metadata.category && metadata.component) {
      registerComponent(metadata);
      registeredCount++;
    }
  } catch (error) {
    console.warn(`[Templates] Failed to register component from ${path}:`, error);
  }
}

// Log registration statistics
console.log(`[Templates] Auto-registered ${registeredCount} components`);
if (registeredCount > 0) {
  const stats = getComponentStats(Array.from(registry.getAll().values()));
  logRegistryStats(stats);
}

// Re-export core functionality
export { renderComponent, renderComponents, ComponentRenderer };
export { registry, registerComponent };
export type { ComponentMetadata } from './core/types';

// Export convenience functions
export function getRegisteredComponentNames(): string[] {
  return registry.getNames();
}

export function getComponentsByCategory(category: string) {
  return registry.getByCategory(category as any);
}

export function getAllComponents() {
  return Array.from(registry.getAll().values());
}

export function getRegistryStats() {
  return registry.getStats();
}

// Legacy export for backward compatibility
// Components now self-register via metadata exports
export const crayonResponseTemplates = [
  { name: 'text', Component: registry.get('text') },
  { name: 'card', Component: registry.get('card') },
  { name: 'panel', Component: registry.get('panel') },
  { name: 'summary-card', Component: registry.get('summary-card') },
  { name: 'line-chart', Component: registry.get('line-chart') },
  { name: 'bar-chart', Component: registry.get('bar-chart') },
  { name: 'data-grid', Component: registry.get('data-grid') },
  { name: 'stack', Component: registry.get('stack') },
  { name: 'grid', Component: registry.get('grid') },
  { name: 'button', Component: registry.get('button') },
].filter((t) => t.Component); // Only include registered components
