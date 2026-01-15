import { describe, test, expect } from 'vitest';
import { testComponentRender, validateSpec, renderFromSpec } from './utils';
import { testFixtures, edgeCases } from './fixtures';

/**
 * Component Template Tests
 * Tests all component templates with various JSON configurations
 */

describe('Text and Explanation Components', () => {
  describe('text component', () => {
    test('should render basic text', () => {
      const spec = testFixtures.text.basic;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render markdown text', () => {
      const spec = testFixtures.text.markdown;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render heading text', () => {
      const spec = testFixtures.text.heading;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });

  describe('insight-card component', () => {
    test('should render success insight card', () => {
      const spec = testFixtures.insightCard.success;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render warning insight card', () => {
      const spec = testFixtures.insightCard.warning;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });

  describe('summary-card component', () => {
    test('should render system health summary', () => {
      const spec = testFixtures.summaryCard.systemHealth;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render traffic summary', () => {
      const spec = testFixtures.summaryCard.trafficSummary;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });
});

describe('Chart Components', () => {
  describe('line-chart component', () => {
    test('should render network traffic chart', () => {
      const spec = testFixtures.lineChart.networkTraffic;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render multi-series line chart', () => {
      const spec = testFixtures.lineChart.multiSeries;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });

  describe('bar-chart component', () => {
    test('should render errors by service chart', () => {
      const spec = testFixtures.barChart.errorsByService;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render request volume chart', () => {
      const spec = testFixtures.barChart.requestVolume;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });

  describe('pie-chart component', () => {
    test('should render traffic by source chart', () => {
      const spec = testFixtures.pieChart.trafficBySource;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });

  describe('composed-chart component', () => {
    test('should render traffic and latency analysis', () => {
      const spec = testFixtures.composedChart.trafficAndLatency;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });
});

describe('Data Display Components', () => {
  describe('data-table component', () => {
    test('should render service metrics table', () => {
      const spec = testFixtures.dataTable.serviceMetrics;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render recent errors table', () => {
      const spec = testFixtures.dataTable.recentErrors;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });
});

describe('Layout Components', () => {
  describe('layout component', () => {
    test('should render simple stack layout', () => {
      const spec = testFixtures.layout.simpleStack;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render complex dashboard layout', () => {
      const spec = testFixtures.layout.complexDashboard;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });
});

describe('Feedback Components', () => {
  describe('alert component', () => {
    test('should render success alert', () => {
      const spec = testFixtures.alert.success;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render warning alert', () => {
      const spec = testFixtures.alert.warning;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });

    test('should render error alert', () => {
      const spec = testFixtures.alert.error;
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
      expect(testComponentRender(spec)).toBe(true);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle empty data gracefully', () => {
    const spec = edgeCases.emptyData;
    const validation = validateSpec(spec);
    expect(validation.valid).toBe(true);
    expect(() => renderFromSpec(spec)).not.toThrow();
  });

  test('should handle missing props', () => {
    const spec = edgeCases.missingProps;
    const validation = validateSpec(spec);
    expect(validation.valid).toBe(true);
    expect(() => renderFromSpec(spec)).not.toThrow();
  });

  test('should handle null values in data', () => {
    const spec = edgeCases.nullValues;
    const validation = validateSpec(spec);
    expect(validation.valid).toBe(true);
    expect(() => renderFromSpec(spec)).not.toThrow();
  });

  test('should handle deeply nested components', () => {
    const spec = edgeCases.deeplyNested;
    const validation = validateSpec(spec);
    expect(validation.valid).toBe(true);
    expect(() => renderFromSpec(spec)).not.toThrow();
  });
});

describe('Legacy Format Support', () => {
  test('should support legacy type/props format', () => {
    const legacySpec = {
      type: 'text',
      props: {
        content: 'Legacy format test',
        variant: 'body'
      }
    };

    const validation = validateSpec(legacySpec);
    expect(validation.valid).toBe(true);
    expect(testComponentRender(legacySpec)).toBe(true);
  });

  test('should support mixed format in nested components', () => {
    const mixedSpec = {
      name: 'layout',
      templateProps: {
        layoutType: 'stack',
        children: [
          {
            type: 'text',  // Legacy format
            props: {
              content: 'Legacy child'
            }
          },
          {
            name: 'text',  // New format
            templateProps: {
              content: 'New format child'
            }
          }
        ]
      }
    };

    const validation = validateSpec(mixedSpec);
    expect(validation.valid).toBe(true);
    expect(testComponentRender(mixedSpec)).toBe(true);
  });
});

describe('Color Palette Validation', () => {
  test('should accept valid hex colors', () => {
    const spec = {
      name: 'line-chart',
      templateProps: {
        series: [{
          data: [1, 2, 3],
          color: '#F97316'  // Valid hex color from MainPrompt.md
        }]
      }
    };

    const validation = validateSpec(spec);
    expect(validation.valid).toBe(true);
  });

  test('should handle semantic colors from palette', () => {
    const colors = ['#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'];
    
    colors.forEach(color => {
      const spec = {
        name: 'line-chart',
        templateProps: {
          series: [{ data: [1, 2, 3], color }]
        }
      };
      
      const validation = validateSpec(spec);
      expect(validation.valid).toBe(true);
    });
  });
});