import { describe, test, expect } from 'vitest';
import { registry } from '../templates/core/registry';
import { renderComponent } from '../templates/core/renderer';
import { validateSpec, extractComponentNames, registryHelpers } from './utils';

/**
 * Core System Tests
 * Tests the fundamental functionality of the component registry and renderer
 */

describe('Component Registry', () => {
  test('should be initialized', () => {
    expect(registry).toBeDefined();
    expect(typeof registry.get).toBe('function');
    expect(typeof registry.has).toBe('function');
    expect(typeof registry.getAll).toBe('function');
  });

  test('should have registered components', () => {
    const allComponents = registry.getAll();
    expect(allComponents.size).toBeGreaterThan(0);
    
    const names = registry.getNames();
    expect(names.length).toBeGreaterThan(0);
    
    console.log(`Registry contains ${names.length} components:`, names.slice(0, 10));
  });

  test('should have all required categories', () => {
    const categories = registry.getCategories();
    const expectedCategories = ['charts', 'data-display', 'layout', 'feedback'];
    
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
  });

  test('should retrieve components by category', () => {
    const chartComponents = registry.getByCategory('charts');
    expect(chartComponents.length).toBeGreaterThan(0);
    
    const layoutComponents = registry.getByCategory('layout');
    expect(layoutComponents.length).toBeGreaterThan(0);
  });

  test('should validate component existence', () => {
    // These components should exist based on the templates folder
    const expectedComponents = [
      'line-chart',
      'bar-chart', 
      'data-table',
      'layout'
    ];

    expectedComponents.forEach(name => {
      expect(registry.has(name)).toBe(true);
      expect(registry.get(name)).toBeDefined();
    });
  });
});

describe('Component Renderer', () => {
  test('should handle both name/templateProps format', () => {
    const spec = {
      name: 'text',
      templateProps: {
        content: 'Test content',
        variant: 'body'
      }
    };

    expect(() => renderComponent(spec)).not.toThrow();
  });

  test('should handle legacy type/props format', () => {
    const spec = {
      type: 'text',
      props: {
        content: 'Test content',
        variant: 'body'
      }
    };

    expect(() => renderComponent(spec)).not.toThrow();
  });

  test('should handle missing components gracefully', () => {
    const spec = {
      name: 'non-existent-component',
      templateProps: {}
    };

    // Should not throw, but might return null or error component
    expect(() => renderComponent(spec)).not.toThrow();
  });

  test('should handle nested components', () => {
    const spec = {
      name: 'layout',
      templateProps: {
        layoutType: 'stack',
        children: [
          {
            name: 'text',
            templateProps: {
              content: 'Child text'
            }
          }
        ]
      }
    };

    expect(() => renderComponent(spec)).not.toThrow();
  });
});

describe('Spec Validation', () => {
  test('should validate correct specs', () => {
    const validSpec = {
      name: 'text',
      templateProps: {
        content: 'Test'
      }
    };

    const result = validateSpec(validSpec);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should catch missing component name', () => {
    const invalidSpec = {
      templateProps: {
        content: 'Test'
      }
    };

    const result = validateSpec(invalidSpec);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing component name (expected "name" or "type" field)');
  });

  test('should catch missing props', () => {
    const invalidSpec = {
      name: 'text'
    };

    const result = validateSpec(invalidSpec);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing component props (expected "templateProps" or "props" field)');
  });

  test('should catch non-existent components', () => {
    const invalidSpec = {
      name: 'fake-component',
      templateProps: {}
    };

    const result = validateSpec(invalidSpec);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('not found in registry'))).toBe(true);
  });
});

describe('Component Name Extraction', () => {
  test('should extract single component name', () => {
    const spec = {
      name: 'text',
      templateProps: { content: 'Test' }
    };

    const names = extractComponentNames(spec);
    expect(names).toContain('text');
  });

  test('should extract nested component names', () => {
    const spec = {
      name: 'layout',
      templateProps: {
        children: [
          { name: 'text', templateProps: { content: 'Test' } },
          { name: 'line-chart', templateProps: { series: [] } }
        ]
      }
    };

    const names = extractComponentNames(spec);
    expect(names).toContain('layout');
    expect(names).toContain('text');
    expect(names).toContain('line-chart');
  });
});

describe('Registry Helpers', () => {
  test('should get registered component names', () => {
    const names = registryHelpers.getRegisteredComponents();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  test('should check component registration', () => {
    const names = registryHelpers.getRegisteredComponents();
    if (names.length > 0) {
      expect(registryHelpers.isComponentRegistered(names[0])).toBe(true);
    }
    expect(registryHelpers.isComponentRegistered('definitely-not-a-component')).toBe(false);
  });

  test('should get components by category', () => {
    const chartComponents = registryHelpers.getComponentsByCategory('charts');
    expect(Array.isArray(chartComponents)).toBe(true);
  });

  test('should get component metadata', () => {
    const names = registryHelpers.getRegisteredComponents();
    if (names.length > 0) {
      const metadata = registryHelpers.getComponentMetadata(names[0]);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(names[0]);
    }
  });
});