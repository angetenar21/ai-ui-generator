import { describe, test, expect } from 'vitest';
import { testComponentRender, renderFromSpec, validateSpec, extractComponentNames } from './utils';
import { complexScenarios } from './fixtures';

/**
 * Integration Tests
 * Tests complete JSON workflows from MainPrompt.md examples
 */

describe('Complete Workflow Integration', () => {
  describe('Traffic Analysis Scenario', () => {
    const scenario = complexScenarios.trafficAnalysis;

    test('should validate complete traffic analysis JSON', () => {
      const validation = validateSpec(scenario);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should render complete traffic analysis dashboard', () => {
      expect(testComponentRender(scenario)).toBe(true);
    });

    test('should contain all expected components', () => {
      const componentNames = extractComponentNames(scenario);
      
      expect(componentNames).toContain('layout');
      expect(componentNames).toContain('summary-card');
      expect(componentNames).toContain('text');
      expect(componentNames).toContain('line-chart');
      expect(componentNames).toContain('insight-card');
    });

    test('should render text content with proper formatting', () => {
      const result = renderFromSpec(scenario);
      
      // Should contain main content elements
      expect(result.container).toBeDefined();
    });

    test('should handle nested component hierarchy', () => {
      // The layout should have 4 children
      expect(scenario.templateProps.children).toHaveLength(4);
      
      // Each child should be valid
      scenario.templateProps.children.forEach((child, index) => {
        const validation = validateSpec(child);
        expect(validation.valid).toBe(true);
        if (!validation.valid) {
          console.error(`Child ${index} validation failed:`, validation.errors);
        }
      });
    });
  });

  describe('Error Analysis Scenario', () => {
    const scenario = complexScenarios.errorAnalysis;

    test('should validate complete error analysis JSON', () => {
      const validation = validateSpec(scenario);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should render complete error analysis dashboard', () => {
      expect(testComponentRender(scenario)).toBe(true);
    });

    test('should contain all expected components', () => {
      const componentNames = extractComponentNames(scenario);
      
      expect(componentNames).toContain('layout');
      expect(componentNames).toContain('alert');
      expect(componentNames).toContain('bar-chart');
      expect(componentNames).toContain('data-table');
      expect(componentNames).toContain('insight-card');
    });

    test('should properly nest components', () => {
      expect(scenario.templateProps.children).toHaveLength(4);
      
      // Validate each child component
      const [alert, barChart, dataTable, insightCard] = scenario.templateProps.children;
      
      expect((alert as any).name).toBe('alert');
      expect((barChart as any).name).toBe('bar-chart');
      expect((dataTable as any).name).toBe('data-table');
      expect((insightCard as any).name).toBe('insight-card');
    });
  });

  describe('Format Compatibility', () => {
    test('should handle mixed old/new format in complex scenarios', () => {
      const mixedFormatScenario = {
        name: 'layout',
        templateProps: {
          layoutType: 'stack',
          children: [
            // New format
            {
              name: 'summary-card',
              templateProps: {
                title: 'New Format Summary',
                items: [{ label: 'Test', value: '100' }]
              }
            },
            // Legacy format
            {
              type: 'text',
              props: {
                content: 'Legacy format text'
              }
            },
            // Nested mixed format
            {
              name: 'layout',
              templateProps: {
                layoutType: 'horizontal',
                children: [
                  {
                    type: 'bar-chart',
                    props: {
                      series: [{ data: [1, 2, 3] }]
                    }
                  }
                ]
              }
            }
          ]
        }
      };

      const validation = validateSpec(mixedFormatScenario);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(mixedFormatScenario)).toBe(true);
    });
  });

  describe('Real-world Data Patterns', () => {
    test('should handle time-series data correctly', () => {
      const timeSeriesSpec = {
        name: 'line-chart',
        templateProps: {
          title: 'System CPU Usage - Last 24 Hours',
          description: 'Hourly CPU utilization across all servers',
          xAxis: [{ 
            data: Array.from({ length: 24 }, (_, i) => 
              `${i.toString().padStart(2, '0')}:00`
            )
          }],
          series: [{
            data: Array.from({ length: 24 }, () => 
              Math.floor(Math.random() * 40) + 30
            ),
            label: 'CPU Usage (%)',
            color: '#F97316',
            curve: 'natural'
          }],
          width: 800,
          height: 400,
          grid: { horizontal: true, vertical: false }
        }
      };

      const validation = validateSpec(timeSeriesSpec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(timeSeriesSpec)).toBe(true);
    });

    test('should handle large datasets in tables', () => {
      const largeTableSpec = {
        name: 'data-table',
        templateProps: {
          title: 'System Logs - Last 1000 Entries',
          columns: ['Timestamp', 'Level', 'Service', 'Message', 'Request ID'],
          rows: Array.from({ length: 100 }, (_, i) => [
            new Date(Date.now() - i * 60000).toISOString(),
            ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
            ['api-gateway', 'auth-service', 'db-service'][Math.floor(Math.random() * 3)],
            `Sample log message ${i + 1}`,
            `req-${Math.random().toString(36).substr(2, 9)}`
          ]),
          sortable: true,
          searchable: true,
          pageSize: 50
        }
      };

      const validation = validateSpec(largeTableSpec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(largeTableSpec)).toBe(true);
    });
  });

  describe('MainPrompt.md Examples Validation', () => {
    test('should validate all MainPrompt examples', () => {
      // Example from MainPrompt.md - Part 7
      const mainPromptExample = {
        name: 'layout',
        templateProps: {
          layoutType: 'stack',
          gap: 'large',
          children: [
            {
              name: 'summary-card',
              templateProps: {
                title: 'Network Traffic Summary - Last 24 Hours',
                layout: 'grid',
                columns: 3,
                items: [
                  { label: 'Total Requests', value: '3.2M', change: '+12%', changeType: 'positive' },
                  { label: 'Peak Hour', value: '3 PM', subtext: '445M bytes' },
                  { label: 'Avg Bytes/Request', value: '2.1 KB', change: '-5%', changeType: 'positive' }
                ]
              }
            },
            {
              name: 'text',
              templateProps: {
                content: 'Network traffic has been **healthy** over the past 24 hours. We observed a **12% increase** compared to yesterday, with peak activity at **3 PM** (445M bytes transferred). This spike corresponds to scheduled backup operations.',
                markdown: true
              }
            },
            {
              name: 'line-chart',
              templateProps: {
                title: 'Hourly Traffic Pattern',
                description: 'Bytes transferred per hour',
                xAxis: [{ data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] }],
                series: [{
                  data: [245, 189, 156, 298, 345, 445, 320, 278],
                  label: 'Bytes (millions)',
                  color: '#F97316',
                  curve: 'natural',
                  area: true
                }],
                width: 800,
                height: 400
              }
            },
            {
              name: 'insight-card',
              templateProps: {
                title: 'No Anomalies Detected',
                description: 'Traffic patterns are consistent with historical trends. No DDoS or unusual activity detected.',
                variant: 'success'
              }
            }
          ]
        }
      };

      const validation = validateSpec(mainPromptExample);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(mainPromptExample)).toBe(true);

      // Should contain all expected components
      const componentNames = extractComponentNames(mainPromptExample);
      expect(componentNames).toContain('layout');
      expect(componentNames).toContain('summary-card');
      expect(componentNames).toContain('text');
      expect(componentNames).toContain('line-chart');
      expect(componentNames).toContain('insight-card');
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle complex nested layouts efficiently', () => {
      const complexNested = {
        name: 'layout',
        templateProps: {
          layoutType: 'grid',
          columns: 3,
          children: Array.from({ length: 9 }, (_, i) => ({
            name: 'layout',
            templateProps: {
              layoutType: 'stack',
              children: [
                {
                  name: 'text',
                  templateProps: {
                    content: `Section ${i + 1}`,
                    variant: 'heading'
                  }
                },
                {
                  name: 'summary-card',
                  templateProps: {
                    title: `Metrics ${i + 1}`,
                    items: [
                      { label: 'Value A', value: String(Math.floor(Math.random() * 1000)) },
                      { label: 'Value B', value: String(Math.floor(Math.random() * 1000)) }
                    ]
                  }
                }
              ]
            }
          }))
        }
      };

      const start = Date.now();
      const validation = validateSpec(complexNested);
      const validationTime = Date.now() - start;
      
      expect(validation.valid).toBe(true);
      expect(validationTime).toBeLessThan(1000); // Should validate in under 1 second

      const renderStart = Date.now();
      expect(testComponentRender(complexNested)).toBe(true);
      const renderTime = Date.now() - renderStart;
      
      expect(renderTime).toBeLessThan(2000); // Should render in under 2 seconds
    });
  });

  describe('Error Recovery and Robustness', () => {
    test('should gracefully handle partial component failures', () => {
      const partiallyBrokenSpec = {
        name: 'layout',
        templateProps: {
          layoutType: 'stack',
          children: [
            // Valid component
            {
              name: 'text',
              templateProps: {
                content: 'This should work'
              }
            },
            // Invalid component (doesn't exist)
            {
              name: 'non-existent-component',
              templateProps: {
                someProps: 'value'
              }
            },
            // Another valid component
            {
              name: 'text',
              templateProps: {
                content: 'This should also work'
              }
            }
          ]
        }
      };

      // Should not throw during validation or rendering
      expect(() => validateSpec(partiallyBrokenSpec)).not.toThrow();
      expect(() => renderFromSpec(partiallyBrokenSpec)).not.toThrow();
    });

    test('should handle malformed JSON gracefully', () => {
      const malformedSpecs = [
        // Missing required fields
        { templateProps: { content: 'Missing name' } },
        // Wrong data types - need to cast for testing
        { name: '123', templateProps: {} },
        // Null values
        { name: 'text', templateProps: null }
      ];

      malformedSpecs.forEach((spec) => {
        expect(() => validateSpec(spec)).not.toThrow();
        expect(() => renderFromSpec(spec as any)).not.toThrow();
      });
    });
  });
});