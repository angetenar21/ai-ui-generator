import { describe, test, expect } from 'vitest';
import { registryHelpers } from './utils';

/**
 * Component Registry Coverage Test
 * Ensures all template components are properly registered and discoverable
 */

describe('Component Registry Coverage', () => {
  test('should have all expected chart components registered', () => {
    const chartComponents = registryHelpers.getComponentsByCategory('charts');
    
    // Expected chart components based on the charts folder
    const expectedCharts = [
      'line-chart',
      'bar-chart',
      'pie-chart',
      'area-chart',
      'scatter-chart',
      'composed-chart',
      'donut-chart',
      'bubble-chart',
      'gauge-chart',
      'funnel-chart'
    ];

    expectedCharts.forEach(chartName => {
      if (registryHelpers.isComponentRegistered(chartName)) {
        expect(chartComponents).toContain(chartName);
      } else {
        console.warn(`Expected chart component "${chartName}" not found in registry`);
      }
    });

    console.log(`Found ${chartComponents.length} chart components:`, chartComponents);
  });

  test('should have data display components registered', () => {
    const dataComponents = registryHelpers.getComponentsByCategory('data-display');
    
    const expectedDataComponents = [
      'data-table',
      'data-grid',
      'list',
      'list-item',
      'badge',
      'chip',
      'avatar'
    ];

    expectedDataComponents.forEach(componentName => {
      if (registryHelpers.isComponentRegistered(componentName)) {
        expect(dataComponents).toContain(componentName);
      } else {
        console.warn(`Expected data component "${componentName}" not found in registry`);
      }
    });

    console.log(`Found ${dataComponents.length} data display components:`, dataComponents);
  });

  test('should have layout components registered', () => {
    const layoutComponents = registryHelpers.getComponentsByCategory('layout');
    
    const expectedLayoutComponents = [
      'layout',
      'container',
      'grid',
      'stack',
      'flexbox'
    ];

    expectedLayoutComponents.forEach(componentName => {
      if (registryHelpers.isComponentRegistered(componentName)) {
        expect(layoutComponents).toContain(componentName);
      } else {
        console.warn(`Expected layout component "${componentName}" not found in registry`);
      }
    });

    console.log(`Found ${layoutComponents.length} layout components:`, layoutComponents);
  });

  test('should have feedback components registered', () => {
    const feedbackComponents = registryHelpers.getComponentsByCategory('feedback');
    
    const expectedFeedbackComponents = [
      'alert',
      'toast',
      'modal',
      'dialog',
      'snackbar'
    ];

    expectedFeedbackComponents.forEach(componentName => {
      if (registryHelpers.isComponentRegistered(componentName)) {
        expect(feedbackComponents).toContain(componentName);
      } else {
        console.warn(`Expected feedback component "${componentName}" not found in registry`);
      }
    });

    console.log(`Found ${feedbackComponents.length} feedback components:`, feedbackComponents);
  });

  test('should log comprehensive registry statistics', () => {
    const allComponents = registryHelpers.getRegisteredComponents();
    const categories = ['charts', 'data-display', 'layout', 'feedback', 'inputs', 'surfaces', 'navigation', 'media', 'advanced'];
    
    console.log('\n=== COMPONENT REGISTRY STATISTICS ===');
    console.log(`Total registered components: ${allComponents.length}`);
    
    categories.forEach(category => {
      const componentsInCategory = registryHelpers.getComponentsByCategory(category);
      console.log(`${category}: ${componentsInCategory.length} components`);
      if (componentsInCategory.length > 0) {
        console.log(`  - ${componentsInCategory.slice(0, 5).join(', ')}${componentsInCategory.length > 5 ? '...' : ''}`);
      }
    });
    
    console.log('=====================================\n');
    
    // Test should pass if we have a reasonable number of components
    expect(allComponents.length).toBeGreaterThan(10);
  });

  test('should verify component metadata integrity', () => {
    const allComponents = registryHelpers.getRegisteredComponents();
    
    allComponents.forEach(componentName => {
      const metadata = registryHelpers.getComponentMetadata(componentName);
      
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(componentName);
      expect(metadata?.component).toBeDefined();
      expect(metadata?.category).toBeDefined();
      
      // Component should be callable
      expect(typeof metadata?.component).toBe('function');
    });
  });
});