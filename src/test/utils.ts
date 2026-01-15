import React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import type { ComponentSpec } from '../templates/core/types';
import { renderComponent } from '../templates/core/renderer';
import { registry } from '../templates/core/registry';

/**
 * Test utilities for component rendering and validation
 */

/**
 * Render a component from JSON spec for testing
 */
export const renderFromSpec = (spec: ComponentSpec): RenderResult => {
  const element = renderComponent(spec);
  return render(React.createElement(React.Fragment, {}, element));
};

/**
 * Test if a component can be rendered without errors
 */
export const testComponentRender = (spec: ComponentSpec): boolean => {
  try {
    const result = renderFromSpec(spec);
    return result.container.children.length > 0;
  } catch (error) {
    console.error('Component render failed:', error);
    return false;
  }
};

/**
 * Validate JSON spec structure
 */
export const validateSpec = (spec: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for required fields
  const componentName = spec.name || spec.type;
  if (!componentName) {
    errors.push('Missing component name (expected "name" or "type" field)');
  }

  const props = spec.templateProps || spec.props;
  if (!props) {
    errors.push('Missing component props (expected "templateProps" or "props" field)');
  }

  // Check if component exists in registry
  if (componentName && !registry.has(componentName)) {
    errors.push(`Component "${componentName}" not found in registry`);
  }

  // Validate children if present
  if (props?.children && Array.isArray(props.children)) {
    props.children.forEach((child: any, index: number) => {
      const childValidation = validateSpec(child);
      if (!childValidation.valid) {
        errors.push(`Child ${index}: ${childValidation.errors.join(', ')}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Extract all component names used in a spec (including nested)
 */
export const extractComponentNames = (spec: ComponentSpec): string[] => {
  const names: string[] = [];
  const componentName = (spec as any).name || (spec as any).type;
  
  if (componentName) {
    names.push(componentName);
  }

  const props = (spec as any).templateProps || (spec as any).props || {};
  const children = props.children || (spec as any).children || [];

  if (Array.isArray(children)) {
    children.forEach((child: ComponentSpec) => {
      names.push(...extractComponentNames(child));
    });
  }

  return names;
};

/**
 * Test data generators for common scenarios
 */
export const createTestData = {
  lineChart: () => ({
    name: 'line-chart',
    templateProps: {
      title: 'Test Line Chart',
      description: 'Sample line chart for testing',
      xAxis: [{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }],
      series: [{
        data: [10, 20, 15, 30, 25],
        label: 'Test Series',
        color: '#F97316'
      }],
      width: 600,
      height: 300
    }
  }),

  barChart: () => ({
    name: 'bar-chart',
    templateProps: {
      title: 'Test Bar Chart',
      xAxis: [{ data: ['A', 'B', 'C', 'D'] }],
      series: [{
        data: [10, 20, 15, 30],
        label: 'Test Data',
        color: '#10B981'
      }]
    }
  }),

  dataTable: () => ({
    name: 'data-table',
    templateProps: {
      title: 'Test Table',
      columns: ['Name', 'Value', 'Status'],
      rows: [
        ['Item 1', 100, 'Active'],
        ['Item 2', 200, 'Inactive'],
        ['Item 3', 150, 'Active']
      ]
    }
  }),

  text: () => ({
    name: 'text',
    templateProps: {
      content: 'Test text content',
      variant: 'body',
      color: 'primary'
    }
  }),

  summaryCard: () => ({
    name: 'summary-card',
    templateProps: {
      title: 'Test Summary',
      description: 'Test summary card',
      layout: 'grid',
      columns: 2,
      items: [
        { label: 'Metric 1', value: '100', change: '+10%', changeType: 'positive' },
        { label: 'Metric 2', value: '200', change: '-5%', changeType: 'negative' }
      ]
    }
  }),

  layout: () => ({
    name: 'layout',
    templateProps: {
      layoutType: 'stack',
      gap: 'medium',
      children: [
        createTestData.text(),
        createTestData.lineChart()
      ]
    }
  })
};

/**
 * Registry test helpers
 */
export const registryHelpers = {
  getRegisteredComponents: () => Array.from(registry.getNames()),
  getComponentsByCategory: (category: string) => 
    registry.getByCategory(category as any).map((meta: any) => meta.name),
  isComponentRegistered: (name: string) => registry.has(name),
  getComponentMetadata: (name: string) => registry.getMetadata(name)
};

/**
 * Mock data for complex scenarios
 */
export const mockData = {
  timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.floor(Math.random() * 100) + 50
  })),

  categoricalData: ['Category A', 'Category B', 'Category C', 'Category D']
    .map(name => ({
      name,
      value: Math.floor(Math.random() * 100) + 10,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    })),

  tableData: {
    columns: ['ID', 'Name', 'Email', 'Status', 'Last Login'],
    rows: Array.from({ length: 10 }, (_, i) => [
      `${i + 1}`,
      `User ${i + 1}`,
      `user${i + 1}@example.com`,
      Math.random() > 0.5 ? 'Active' : 'Inactive',
      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    ])
  }
};