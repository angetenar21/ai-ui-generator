/**
 * Test Data Fixtures
 * Comprehensive test data for all component categories following MainPrompt.md format
 */

export const testFixtures = {
  // TEXT & EXPLANATION COMPONENTS
  text: {
    basic: {
      name: 'text',
      templateProps: {
        content: 'This dashboard shows network activity over the past 24 hours.',
        variant: 'body',
        color: 'secondary',
        markdown: false
      }
    },
    markdown: {
      name: 'text',
      templateProps: {
        content: 'This dashboard shows **network activity** over the past 24 hours. Peak traffic occurred at *3 PM*.',
        variant: 'body',
        color: 'secondary',
        markdown: true
      }
    },
    heading: {
      name: 'text',
      templateProps: {
        content: 'System Performance Overview',
        variant: 'heading',
        color: 'primary'
      }
    }
  },

  insightCard: {
    success: {
      name: 'insight-card',
      templateProps: {
        title: 'System Performance Excellent',
        description: 'All services are operating within normal parameters. Response times are 15% better than average.',
        variant: 'success',
        metric: {
          value: '99.8%',
          label: 'Uptime',
          trend: 'up',
          trendValue: '+0.3%'
        },
        showIcon: true
      }
    },
    warning: {
      name: 'insight-card',
      templateProps: {
        title: 'High Memory Usage Detected',
        description: 'Database service is using 87% of available memory. Consider scaling up.',
        variant: 'warning',
        metric: {
          value: '87%',
          label: 'Memory Usage',
          trend: 'up',
          trendValue: '+12%'
        },
        showIcon: true
      }
    }
  },

  summaryCard: {
    systemHealth: {
      name: 'summary-card',
      templateProps: {
        title: 'System Health - Last Hour',
        description: 'Real-time metrics from all services',
        layout: 'grid',
        columns: 3,
        items: [
          {
            label: 'Total Requests',
            value: '1.2M',
            change: '+15%',
            changeType: 'positive',
            subtext: 'vs. last hour'
          },
          {
            label: 'Avg Response Time',
            value: '45ms',
            change: '-8ms',
            changeType: 'positive'
          },
          {
            label: 'Error Rate',
            value: '0.02%',
            change: '+0.01%',
            changeType: 'negative'
          }
        ]
      }
    },
    trafficSummary: {
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
    }
  },

  // CHART COMPONENTS
  lineChart: {
    networkTraffic: {
      name: 'line-chart',
      templateProps: {
        title: 'Network Traffic - Last 24 Hours',
        description: 'Hourly breakdown showing peak at 3 PM',
        xAxis: [{ data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] }],
        series: [{
          data: [245, 189, 156, 298, 345, 445, 320, 278],
          label: 'Bytes (millions)',
          color: '#F97316',
          curve: 'natural',
          showMark: true,
          area: false
        }],
        width: 800,
        height: 400,
        legend: true,
        grid: { horizontal: true, vertical: false }
      }
    },
    multiSeries: {
      name: 'line-chart',
      templateProps: {
        title: 'Service Performance Comparison',
        description: 'Response times for different services',
        xAxis: [{ data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] }],
        series: [
          {
            data: [45, 52, 48, 65, 58, 47],
            label: 'API Gateway',
            color: '#F97316',
            curve: 'natural'
          },
          {
            data: [23, 28, 25, 31, 29, 26],
            label: 'Auth Service',
            color: '#10B981',
            curve: 'natural'
          }
        ],
        width: 800,
        height: 400,
        legend: true
      }
    }
  },

  barChart: {
    errorsByService: {
      name: 'bar-chart',
      templateProps: {
        title: 'Errors by Service',
        description: 'Last 24 hours - API Gateway had the most errors',
        xAxis: [{ data: ['api-gateway', 'auth-service', 'user-service', 'db-service'] }],
        series: [{
          data: [152, 89, 45, 23],
          label: 'Error Count',
          color: '#EF4444'
        }],
        layout: 'vertical',
        width: 600,
        height: 400,
        legend: true
      }
    },
    requestVolume: {
      name: 'bar-chart',
      templateProps: {
        title: 'Request Volume by Endpoint',
        xAxis: [{ data: ['/api/users', '/api/auth', '/api/data', '/api/health'] }],
        series: [{
          data: [1250, 890, 456, 234],
          label: 'Requests',
          color: '#F97316'
        }],
        layout: 'vertical',
        width: 600,
        height: 350
      }
    }
  },

  pieChart: {
    trafficBySource: {
      name: 'pie-chart',
      templateProps: {
        title: 'Traffic by Source',
        description: 'Top 5 IP addresses by request volume',
        series: [{
          data: [
            { id: 1, value: 35, label: '10.0.0.1', color: '#F97316' },
            { id: 2, value: 28, label: '10.0.0.2', color: '#10B981' },
            { id: 3, value: 22, label: '10.0.0.3', color: '#3B82F6' },
            { id: 4, value: 10, label: '10.0.0.4', color: '#8B5CF6' },
            { id: 5, value: 5, label: 'Others', color: '#6B7280' }
          ]
        }],
        legend: true
      }
    }
  },

  composedChart: {
    trafficAndLatency: {
      name: 'composed-chart',
      templateProps: {
        title: 'Traffic & Latency Analysis',
        description: 'Combined view of volume and performance',
        xAxis: [{ data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] }],
        series: [
          {
            name: 'Request Volume',
            type: 'bar',
            data: [450, 320, 510, 680, 590, 420],
            color: '#F97316'
          },
          {
            name: 'Avg Latency (ms)',
            type: 'line',
            data: [45, 52, 48, 65, 58, 47],
            color: '#10B981',
            yAxisIndex: 1
          }
        ],
        yAxis: [
          { type: 'value', name: 'Requests' },
          { type: 'value', name: 'Latency (ms)', position: 'right' }
        ],
        legend: true
      }
    }
  },

  // DATA DISPLAY COMPONENTS
  dataTable: {
    serviceMetrics: {
      name: 'data-table',
      templateProps: {
        title: 'Service Performance Metrics',
        description: 'Last hour - sorted by request volume',
        columns: ['Service', 'Requests', 'Avg Latency', 'Error Rate', 'Status'],
        rows: [
          ['api-gateway', '125,340', '45.2ms', '0.12%', 'Healthy'],
          ['auth-service', '89,210', '23.1ms', '0.02%', 'Healthy'],
          ['user-service', '56,780', '67.8ms', '0.45%', 'Warning'],
          ['db-service', '34,120', '12.3ms', '0.01%', 'Healthy']
        ],
        sortable: true,
        searchable: true,
        pageSize: 10
      }
    },
    recentErrors: {
      name: 'data-table',
      templateProps: {
        title: 'Recent Errors',
        columns: ['Time', 'Service', 'Error Type', 'Message'],
        rows: [
          ['14:23:45', 'api-gateway', 'ConnectionTimeout', 'Failed to connect to db-service'],
          ['14:22:10', 'api-gateway', 'ValidationError', 'Invalid request payload'],
          ['14:20:33', 'auth-service', 'TokenExpired', 'JWT token expired'],
          ['14:19:22', 'user-service', 'DatabaseError', 'Query timeout']
        ],
        sortable: true
      }
    }
  },

  // LAYOUT COMPONENTS
  layout: {
    simpleStack: {
      name: 'layout',
      templateProps: {
        layoutType: 'stack',
        gap: 'large',
        children: [
          {
            name: 'text',
            templateProps: {
              content: 'System Overview',
              variant: 'heading'
            }
          },
          {
            name: 'summary-card',
            templateProps: {
              title: 'Quick Stats',
              layout: 'horizontal',
              items: [
                { label: 'Active Users', value: '1,234' },
                { label: 'Total Requests', value: '567K' }
              ]
            }
          }
        ]
      }
    },
    complexDashboard: {
      name: 'layout',
      templateProps: {
        layoutType: 'grid',
        columns: 2,
        gap: 'medium',
        children: [
          {
            name: 'summary-card',
            templateProps: {
              title: 'System Health',
              layout: 'grid',
              columns: 2,
              items: [
                { label: 'CPU Usage', value: '65%', changeType: 'neutral' },
                { label: 'Memory', value: '78%', changeType: 'warning' }
              ]
            }
          },
          {
            name: 'line-chart',
            templateProps: {
              title: 'Response Times',
              xAxis: [{ data: ['1h', '2h', '3h', '4h', '5h'] }],
              series: [{
                data: [45, 52, 48, 65, 58],
                label: 'Latency (ms)',
                color: '#F97316'
              }]
            }
          }
        ]
      }
    }
  },

  // FEEDBACK COMPONENTS
  alert: {
    success: {
      name: 'alert',
      templateProps: {
        type: 'success',
        title: 'System Healthy',
        message: 'All services operating normally. No issues detected in the last 24 hours.'
      }
    },
    warning: {
      name: 'alert',
      templateProps: {
        type: 'warning',
        title: '24 Errors Detected',
        message: 'Found 24 errors in the last hour. Most are from api-gateway service.'
      }
    },
    error: {
      name: 'alert',
      templateProps: {
        type: 'error',
        title: 'Service Outage',
        message: 'Database service is currently unavailable. Technical team has been notified.'
      }
    }
  }
};

// Complex test scenarios from MainPrompt.md examples
export const complexScenarios = {
  // Example 1: Simple Request → Rich Response
  trafficAnalysis: {
    name: 'layout',
    templateProps: {
      layoutType: 'stack',
      gap: 'large',
      children: [
        testFixtures.summaryCard.trafficSummary,
        {
          name: 'text',
          templateProps: {
            content: 'Network traffic has been **healthy** over the past 24 hours. We observed a **12% increase** compared to yesterday, with peak activity at **3 PM** (445M bytes transferred). This spike corresponds to scheduled backup operations.',
            markdown: true
          }
        },
        testFixtures.lineChart.networkTraffic,
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
  },

  // Example 2: Error Analysis
  errorAnalysis: {
    name: 'layout',
    templateProps: {
      layoutType: 'stack',
      gap: 'large',
      children: [
        testFixtures.alert.warning,
        testFixtures.barChart.errorsByService,
        testFixtures.dataTable.recentErrors,
        {
          name: 'insight-card',
          templateProps: {
            title: 'Recommended Action',
            description: 'The api-gateway is experiencing connection timeouts to db-service. Check database connection pool settings.',
            variant: 'warning'
          }
        }
      ]
    }
  }
};

// Test data for edge cases and validation
export const edgeCases = {
  emptyData: {
    name: 'line-chart',
    templateProps: {
      title: 'Empty Chart',
      xAxis: [{ data: [] }],
      series: [{ data: [], label: 'Empty Series' }]
    }
  },
  missingProps: {
    name: 'text',
    templateProps: {}
  },
  nullValues: {
    name: 'data-table',
    templateProps: {
      columns: ['A', 'B', 'C'],
      rows: [
        ['value1', null, 'value3'],
        [null, 'value2', null]
      ]
    }
  },
  deeplyNested: {
    name: 'layout',
    templateProps: {
      layoutType: 'stack',
      children: [
        {
          name: 'layout',
          templateProps: {
            layoutType: 'grid',
            columns: 2,
            children: [
              {
                name: 'layout',
                templateProps: {
                  layoutType: 'stack',
                  children: [
                    { name: 'text', templateProps: { content: 'Deep nesting level 3' } }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};