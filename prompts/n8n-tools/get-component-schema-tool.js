// Minimal Get Component Schema tool for n8n Custom Code Tool
console.log('Get Component Schema tool running');

const components = {
  "area-chart": {
    "name": "area-chart",
    "category": "charts",
    "fileName": "AreaChart",
    "description": "Area chart for visualizing cumulative data and trends over time with filled regions",
    "tags": [
      "chart",
      "area",
      "trend",
      "cumulative",
      "stacked",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis data points",
        "required": false,
        "tsType": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>"
      },
      "series": {
        "type": "string",
        "description": "Series data for the areas",
        "required": true,
        "tsType": "Array<{ data: number[]; label?: string; color?: string; stack?: string; curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'; showMark?: boolean; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "grid": {
        "type": "boolean",
        "description": "Show grid lines",
        "required": false,
        "tsType": "{ vertical?: boolean; horizontal?: boolean; }"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      }
    },
    "interfaces": {
      "AreaChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "xAxis": {
          "type": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>",
          "description": "X-axis data points",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: number[]; label?: string; color?: string; stack?: string; curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'; showMark?: boolean; }>",
          "description": "Series data for the areas",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "grid": {
          "type": "{ vertical?: boolean; horizontal?: boolean; }",
          "description": "Show grid lines",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        }
      }
    }
  },
  "bar-chart": {
    "name": "bar-chart",
    "category": "charts",
    "fileName": "BarChart",
    "description": "Bar chart for comparing categorical data with support for horizontal/vertical layout, stacked bars, visual variants, and color palettes",
    "tags": [
      "chart",
      "bar",
      "column",
      "comparison",
      "categorical",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis data (categories)",
        "required": false,
        "tsType": "Array<{ data: (number | string)[]; label?: string; scaleType?: 'band' | 'linear'; }>"
      },
      "series": {
        "type": "string",
        "description": "Series data for the bars",
        "required": true,
        "tsType": "Array<{ data: number[]; label?: string; color?: string; stack?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "backgroundColor": {
        "type": "string",
        "description": "Chart background color (plot area)",
        "required": false,
        "tsType": "string"
      },
      "cardBackgroundColor": {
        "type": "string",
        "description": "Card background color",
        "required": false,
        "tsType": "string"
      },
      "layout": {
        "type": "'horizontal' | 'vertical'",
        "description": "Layout orientation",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      },
      "grid": {
        "type": "boolean",
        "description": "Show grid lines",
        "required": false,
        "tsType": "{ vertical?: boolean; horizontal?: boolean; }"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      },
      "variant": {
        "type": "SurfaceVariant",
        "description": "Surface variant for visual hierarchy",
        "required": false,
        "tsType": "SurfaceVariant"
      },
      "elevation": {
        "type": "ElevationLevel",
        "description": "Elevation level for depth",
        "required": false,
        "tsType": "ElevationLevel"
      },
      "emphasis": {
        "type": "EmphasisLevel",
        "description": "Visual emphasis level",
        "required": false,
        "tsType": "EmphasisLevel"
      },
      "palette": {
        "type": "ChartPaletteType",
        "description": "Chart color palette",
        "required": false,
        "tsType": "ChartPaletteType"
      },
      "useGradient": {
        "type": "boolean",
        "description": "Use gradient fills",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "BarChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "xAxis": {
          "type": "Array<{ data: (number | string)[]; label?: string; scaleType?: 'band' | 'linear'; }>",
          "description": "X-axis data (categories)",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: number[]; label?: string; color?: string; stack?: string; }>",
          "description": "Series data for the bars",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "backgroundColor": {
          "type": "string",
          "description": "Chart background color (plot area)",
          "optional": true
        },
        "cardBackgroundColor": {
          "type": "string",
          "description": "Card background color",
          "optional": true
        },
        "layout": {
          "type": "'horizontal' | 'vertical'",
          "description": "Layout orientation",
          "optional": true
        },
        "grid": {
          "type": "{ vertical?: boolean; horizontal?: boolean; }",
          "description": "Show grid lines",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        },
        "variant": {
          "type": "SurfaceVariant",
          "description": "Surface variant for visual hierarchy",
          "optional": true
        },
        "elevation": {
          "type": "ElevationLevel",
          "description": "Elevation level for depth",
          "optional": true
        },
        "emphasis": {
          "type": "EmphasisLevel",
          "description": "Visual emphasis level",
          "optional": true
        },
        "palette": {
          "type": "ChartPaletteType",
          "description": "Chart color palette",
          "optional": true
        },
        "useGradient": {
          "type": "boolean",
          "description": "Use gradient fills",
          "optional": true
        }
      }
    }
  },
  "boxplot-chart": {
    "name": "boxplot-chart",
    "category": "charts",
    "fileName": "BoxPlotChart",
    "description": "Box plot chart for statistical distribution. Shows min, Q1, median, Q3, and max values.",
    "tags": [
      "chart",
      "boxplot",
      "statistics",
      "distribution"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Chart description",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis categories",
        "required": false,
        "tsType": "string[]"
      },
      "series": {
        "type": "string",
        "description": "Series data with box plot statistics",
        "required": true,
        "tsType": "Array<{ name: string; data: Array<[ number, number, number, number, number ]>; // [min, q1, median, q3, max] type?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "BoxPlotChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "xAxis": {
          "type": "string[]",
          "description": "X-axis categories",
          "optional": true
        },
        "series": {
          "type": "Array<{ name: string; data: Array<[ number, number, number, number, number ]>; // [min, q1, median, q3, max] type?: string; }>",
          "description": "Series data with box plot statistics",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "bubble-chart": {
    "name": "bubble-chart",
    "category": "charts",
    "fileName": "BubbleChart",
    "description": "Bubble chart for visualizing three-dimensional data with x, y, and size dimensions",
    "tags": [
      "chart",
      "bubble",
      "scatter",
      "3d",
      "correlation",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "series": {
        "type": "string",
        "description": "Series data with bubble points",
        "required": true,
        "tsType": "Array<{ label?: string; name?: string; data: Array<[ number, number, number ] | { value: [ number, number, number ]; name?: string; color?: string; }>; color?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "BubbleChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "series": {
          "type": "Array<{ label?: string; name?: string; data: Array<[ number, number, number ] | { value: [ number, number, number ]; name?: string; color?: string; }>; color?: string; }>",
          "description": "Series data with bubble points",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "chord-chart": {
    "name": "chord-chart",
    "category": "charts",
    "fileName": "ChordChart",
    "description": "Chord diagram for showing relationships between nodes. Displayed as matrix table.",
    "tags": [
      "chart",
      "chord",
      "network",
      "relationships",
      "matrix"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Chart description",
        "required": false,
        "tsType": "string"
      },
      "nodes": {
        "type": "string",
        "description": "Node definitions",
        "required": true,
        "tsType": "Array<{ name: string; }>"
      },
      "matrix": {
        "type": "number",
        "description": "Relationship matrix",
        "required": true,
        "tsType": "number[][]"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "ChordChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "nodes": {
          "type": "Array<{ name: string; }>",
          "description": "Node definitions",
          "optional": false
        },
        "matrix": {
          "type": "number[][]",
          "description": "Relationship matrix",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "composed-chart": {
    "name": "composed-chart",
    "category": "charts",
    "fileName": "ComposedChart",
    "description": "Chart combining bar and line series with dual y-axes support",
    "tags": [
      "chart",
      "composed",
      "mixed",
      "bar",
      "line",
      "dual-axis"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>"
      },
      "yAxis": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<{ type?: string; name?: string; position?: 'left' | 'right'; }>"
      },
      "series": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "ComposedChartSeries[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "legend": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "ComposedChartSeries": {
        "name": {
          "type": "string",
          "optional": false
        },
        "type": {
          "type": "'bar' | 'line'",
          "optional": false
        },
        "data": {
          "type": "number[]",
          "optional": false
        },
        "color": {
          "type": "string",
          "optional": true
        },
        "yAxisIndex": {
          "type": "number",
          "optional": true
        }
      },
      "ComposedChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "xAxis": {
          "type": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>",
          "optional": true
        },
        "yAxis": {
          "type": "Array<{ type?: string; name?: string; position?: 'left' | 'right'; }>",
          "optional": true
        },
        "series": {
          "type": "ComposedChartSeries[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "donut-chart": {
    "name": "donut-chart",
    "category": "charts",
    "fileName": "DonutChart",
    "description": "Donut chart (pie chart with center hole) for displaying proportional data with optional center label",
    "tags": [
      "chart",
      "donut",
      "pie",
      "proportion",
      "percentage",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "string",
        "description": "Series data for donut slices",
        "required": true,
        "tsType": "Array<{ id: string | number; value: number; label?: string; color?: string; }>"
      },
      "innerRadius": {
        "type": "number",
        "description": "Inner radius percentage (creates the donut hole)",
        "required": false,
        "tsType": "number"
      },
      "outerRadius": {
        "type": "number",
        "description": "Outer radius",
        "required": false,
        "tsType": "number"
      },
      "paddingAngle": {
        "type": "number",
        "description": "Padding angle between slices",
        "required": false,
        "tsType": "number"
      },
      "cornerRadius": {
        "type": "number",
        "description": "Corner radius for slices",
        "required": false,
        "tsType": "number"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "centerLabel": {
        "type": "string",
        "description": "Show center label",
        "required": false,
        "tsType": "string"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      }
    },
    "interfaces": {
      "DonutChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "data": {
          "type": "Array<{ id: string | number; value: number; label?: string; color?: string; }>",
          "description": "Series data for donut slices",
          "optional": false
        },
        "innerRadius": {
          "type": "number",
          "description": "Inner radius percentage (creates the donut hole)",
          "optional": true
        },
        "outerRadius": {
          "type": "number",
          "description": "Outer radius",
          "optional": true
        },
        "paddingAngle": {
          "type": "number",
          "description": "Padding angle between slices",
          "optional": true
        },
        "cornerRadius": {
          "type": "number",
          "description": "Corner radius for slices",
          "optional": true
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "centerLabel": {
          "type": "string",
          "description": "Show center label",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        }
      }
    }
  },
  "funnel-chart": {
    "name": "funnel-chart",
    "category": "charts",
    "fileName": "FunnelChart",
    "description": "Funnel chart for conversion funnels",
    "tags": [
      "chart",
      "funnel",
      "conversion"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "Array<{ name: string; value: number; }>"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "FunnelChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "Array<{ name: string; value: number; }>",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "gauge-chart": {
    "name": "gauge-chart",
    "category": "charts",
    "fileName": "GaugeChart",
    "description": "Gauge chart for displaying a single value within a range, useful for KPIs and metrics",
    "tags": [
      "chart",
      "gauge",
      "meter",
      "kpi",
      "metric",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "number",
        "description": "Current value - can be direct number or from series",
        "required": false,
        "tsType": "number"
      },
      "series": {
        "type": "string",
        "description": "Series data format [{ data: [value], label?, colorStops? }]",
        "required": false,
        "tsType": "Array<{ data?: number[]; label?: string; colorStops?: ColorStop[]; }>"
      },
      "valueMin": {
        "type": "number",
        "description": "Minimum value",
        "required": false,
        "tsType": "number"
      },
      "valueMax": {
        "type": "number",
        "description": "Maximum value",
        "required": false,
        "tsType": "number"
      },
      "startAngle": {
        "type": "number",
        "description": "Start angle in degrees",
        "required": false,
        "tsType": "number"
      },
      "endAngle": {
        "type": "number",
        "description": "End angle in degrees",
        "required": false,
        "tsType": "number"
      },
      "innerRadius": {
        "type": "string",
        "description": "Inner radius percentage",
        "required": false,
        "tsType": "string"
      },
      "outerRadius": {
        "type": "string",
        "description": "Outer radius percentage",
        "required": false,
        "tsType": "string"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "text": {
        "type": "string",
        "description": "Value label text",
        "required": false,
        "tsType": "string"
      },
      "color": {
        "type": "string",
        "description": "Color of the gauge arc",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "ColorStop": {
        "offset": {
          "type": "number",
          "optional": false
        },
        "color": {
          "type": "string",
          "optional": false
        }
      },
      "GaugeChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "value": {
          "type": "number",
          "description": "Current value - can be direct number or from series",
          "optional": true
        },
        "series": {
          "type": "Array<{ data?: number[]; label?: string; colorStops?: ColorStop[]; }>",
          "description": "Series data format [{ data: [value], label?, colorStops? }]",
          "optional": true
        },
        "valueMin": {
          "type": "number",
          "description": "Minimum value",
          "optional": true
        },
        "valueMax": {
          "type": "number",
          "description": "Maximum value",
          "optional": true
        },
        "startAngle": {
          "type": "number",
          "description": "Start angle in degrees",
          "optional": true
        },
        "endAngle": {
          "type": "number",
          "description": "End angle in degrees",
          "optional": true
        },
        "innerRadius": {
          "type": "string",
          "description": "Inner radius percentage",
          "optional": true
        },
        "outerRadius": {
          "type": "string",
          "description": "Outer radius percentage",
          "optional": true
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "text": {
          "type": "string",
          "description": "Value label text",
          "optional": true
        },
        "color": {
          "type": "string",
          "description": "Color of the gauge arc",
          "optional": true
        }
      }
    }
  },
  "grouped-bar-chart": {
    "name": "grouped-bar-chart",
    "category": "charts",
    "fileName": "GroupedBarChart",
    "description": "Grouped bar chart",
    "tags": [
      "chart"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "any[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "GroupedBarChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "any[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "heatmap-chart": {
    "name": "heatmap-chart",
    "category": "charts",
    "fileName": "HeatMapChart",
    "description": "Heat map visualization for 2D data density. Shows values with color intensity.",
    "tags": [
      "chart",
      "heatmap",
      "density",
      "2d"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Chart description",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis labels",
        "required": false,
        "tsType": "{ data: string[]; }"
      },
      "yAxis": {
        "type": "string",
        "description": "Y-axis labels",
        "required": false,
        "tsType": "{ data: string[]; }"
      },
      "series": {
        "type": "string",
        "description": "Series data with heatmap values",
        "required": true,
        "tsType": "Array<{ name?: string; data: Array<[ number, number, number ]>; // [x, y, value] }>"
      },
      "visualMap": {
        "type": "string",
        "description": "Visual mapping configuration",
        "required": false,
        "tsType": "{ min?: number; max?: number; inRange?: { color?: string[]; }; }"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "HeatMapChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "xAxis": {
          "type": "{ data: string[]; }",
          "description": "X-axis labels",
          "optional": true
        },
        "yAxis": {
          "type": "{ data: string[]; }",
          "description": "Y-axis labels",
          "optional": true
        },
        "series": {
          "type": "Array<{ name?: string; data: Array<[ number, number, number ]>; // [x, y, value] }>",
          "description": "Series data with heatmap values",
          "optional": false
        },
        "visualMap": {
          "type": "{ min?: number; max?: number; inRange?: { color?: string[]; }; }",
          "description": "Visual mapping configuration",
          "optional": true
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "histogram-chart": {
    "name": "histogram-chart",
    "category": "charts",
    "fileName": "HistogramChart",
    "description": "Histogram for distribution visualization. Supports series format with [label, value] pairs.",
    "tags": [
      "chart",
      "histogram",
      "distribution",
      "bar"
    ],
    "props": {},
    "interfaces": {
      "HistogramChartPropsOld": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "data": {
          "type": "Array<{ name: string; value: number; [key: string]: any; }>",
          "description": "Data in simple Recharts format",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      },
      "HistogramChartPropsNew": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "series": {
          "type": "Array<{ name: string; data: Array<[ string, number ]>; // [label, value] pairs type?: string; color?: string; }>",
          "description": "Series data with histogram bins",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "line-chart": {
    "name": "line-chart",
    "category": "charts",
    "fileName": "LineChart",
    "description": "Line chart for visualizing trends over time with support for multiple series, curves, areas, visual variants, and color palettes",
    "tags": [
      "chart",
      "line",
      "trend",
      "time-series",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis data points",
        "required": false,
        "tsType": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>"
      },
      "series": {
        "type": "string",
        "description": "Series data for the lines",
        "required": true,
        "tsType": "Array<{ data: number[]; label?: string; color?: string; curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'; showMark?: boolean; area?: boolean; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "backgroundColor": {
        "type": "string",
        "description": "Chart background color (plot area)",
        "required": false,
        "tsType": "string"
      },
      "cardBackgroundColor": {
        "type": "string",
        "description": "Card background color",
        "required": false,
        "tsType": "string"
      },
      "grid": {
        "type": "boolean",
        "description": "Show grid lines",
        "required": false,
        "tsType": "{ vertical?: boolean; horizontal?: boolean; }"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      },
      "variant": {
        "type": "SurfaceVariant",
        "description": "Surface variant for visual hierarchy",
        "required": false,
        "tsType": "SurfaceVariant"
      },
      "elevation": {
        "type": "ElevationLevel",
        "description": "Elevation level for depth",
        "required": false,
        "tsType": "ElevationLevel"
      },
      "emphasis": {
        "type": "EmphasisLevel",
        "description": "Visual emphasis level",
        "required": false,
        "tsType": "EmphasisLevel"
      },
      "palette": {
        "type": "ChartPaletteType",
        "description": "Chart color palette",
        "required": false,
        "tsType": "ChartPaletteType"
      },
      "useGradient": {
        "type": "boolean",
        "description": "Use gradient fills for area charts",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "LineChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "xAxis": {
          "type": "Array<{ data: (number | string | Date)[]; label?: string; scaleType?: 'band' | 'linear' | 'log' | 'time'; }>",
          "description": "X-axis data points",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: number[]; label?: string; color?: string; curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'; showMark?: boolean; area?: boolean; }>",
          "description": "Series data for the lines",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "backgroundColor": {
          "type": "string",
          "description": "Chart background color (plot area)",
          "optional": true
        },
        "cardBackgroundColor": {
          "type": "string",
          "description": "Card background color",
          "optional": true
        },
        "grid": {
          "type": "{ vertical?: boolean; horizontal?: boolean; }",
          "description": "Show grid lines",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        },
        "variant": {
          "type": "SurfaceVariant",
          "description": "Surface variant for visual hierarchy",
          "optional": true
        },
        "elevation": {
          "type": "ElevationLevel",
          "description": "Elevation level for depth",
          "optional": true
        },
        "emphasis": {
          "type": "EmphasisLevel",
          "description": "Visual emphasis level",
          "optional": true
        },
        "palette": {
          "type": "ChartPaletteType",
          "description": "Chart color palette",
          "optional": true
        },
        "useGradient": {
          "type": "boolean",
          "description": "Use gradient fills for area charts",
          "optional": true
        }
      }
    }
  },
  "multi-axis-chart": {
    "name": "multi-axis-chart",
    "category": "charts",
    "fileName": "MultiAxisChart",
    "description": "Chart with multiple axes",
    "tags": [
      "chart"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "any[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "MultiAxisChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "any[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "multi-line-chart": {
    "name": "multi-line-chart",
    "category": "charts",
    "fileName": "MultiLineChart",
    "description": "Multiple line series",
    "tags": [
      "chart"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "any[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "MultiLineChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "any[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "pie-chart": {
    "name": "pie-chart",
    "category": "charts",
    "fileName": "PieChart",
    "description": "Pie chart for showing proportional data distribution with support for donut style and custom styling",
    "tags": [
      "chart",
      "pie",
      "donut",
      "proportion",
      "percentage",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "series": {
        "type": "string",
        "description": "Series data for pie slices",
        "required": true,
        "tsType": "Array<{ data: Array<{ id: string | number; value: number; label?: string; color?: string; }>; innerRadius?: number; outerRadius?: number; paddingAngle?: number; cornerRadius?: number; startAngle?: number; endAngle?: number; cx?: number; cy?: number; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      }
    },
    "interfaces": {
      "PieChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: Array<{ id: string | number; value: number; label?: string; color?: string; }>; innerRadius?: number; outerRadius?: number; paddingAngle?: number; cornerRadius?: number; startAngle?: number; endAngle?: number; cx?: number; cy?: number; }>",
          "description": "Series data for pie slices",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        }
      }
    }
  },
  "polar-chart": {
    "name": "polar-chart",
    "category": "charts",
    "fileName": "PolarChart",
    "description": "Polar coordinate chart. Displays data in radial bar format.",
    "tags": [
      "chart",
      "polar",
      "radial",
      "circular"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Chart description",
        "required": false,
        "tsType": "string"
      },
      "angleAxis": {
        "type": "string",
        "description": "Angle axis configuration",
        "required": false,
        "tsType": "{ data: string[]; }"
      },
      "radiusAxis": {
        "type": "any",
        "description": "Radius axis configuration",
        "required": false,
        "tsType": "any"
      },
      "series": {
        "type": "string",
        "description": "Series data for polar chart",
        "required": true,
        "tsType": "Array<{ name?: string; type?: string; data: number[]; coordinateSystem?: string; color?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "PolarChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "angleAxis": {
          "type": "{ data: string[]; }",
          "description": "Angle axis configuration",
          "optional": true
        },
        "radiusAxis": {
          "type": "any",
          "description": "Radius axis configuration",
          "optional": true
        },
        "series": {
          "type": "Array<{ name?: string; type?: string; data: number[]; coordinateSystem?: string; color?: string; }>",
          "description": "Series data for polar chart",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "radar-chart": {
    "name": "radar-chart",
    "category": "charts",
    "fileName": "RadarChart",
    "description": "Radar chart for comparing multiple variables across different categories. Supports three formats: (1) indicator + series, (2) axes + series, or (3) data + dataKeys",
    "tags": [
      "chart",
      "radar",
      "spider",
      "multivariate",
      "comparison",
      "data-visualization"
    ],
    "props": {},
    "interfaces": {
      "RadarChartPropsOld": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "data": {
          "type": "Array<{ subject: string; [key: string]: string | number; }>",
          "description": "Data for radar chart (Recharts format)",
          "optional": false
        },
        "dataKeys": {
          "type": "Array<{ key: string; name?: string; color?: string; }>",
          "description": "Data keys to plot",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "showGrid": {
          "type": "boolean",
          "description": "Show grid",
          "optional": true
        }
      },
      "RadarChartPropsNew": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "axes": {
          "type": "Array<{ name: string; domain?: [ number, number ]; }>",
          "description": "Axes definitions with names and domains",
          "optional": false
        },
        "series": {
          "type": "Array<{ name: string; data: number[]; color?: string; }>",
          "description": "Series data with values for each axis",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "showGrid": {
          "type": "boolean",
          "description": "Show grid",
          "optional": true
        }
      },
      "RadarChartPropsIndicator": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "indicator": {
          "type": "Array<{ name: string; max: number; min?: number; }>",
          "description": "Indicator definitions (alternative to axes)",
          "optional": false
        },
        "series": {
          "type": "Array<{ name: string; value: number[]; color?: string; }>",
          "description": "Series data with values or objects",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "showGrid": {
          "type": "boolean",
          "description": "Show grid",
          "optional": true
        }
      }
    }
  },
  "radial-bar-chart": {
    "name": "radial-bar-chart",
    "category": "charts",
    "fileName": "RadialBarChart",
    "description": "Radial bar chart for visualizing data in a circular layout with concentric bars",
    "tags": [
      "chart",
      "radial",
      "circular",
      "progress",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "series": {
        "type": "string",
        "description": "Series data for radial bars",
        "required": true,
        "tsType": "Array<{ name: string; value: number; color?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "RadialBarChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "series": {
          "type": "Array<{ name: string; value: number; color?: string; }>",
          "description": "Series data for radial bars",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "sankey-chart": {
    "name": "sankey-chart",
    "category": "charts",
    "fileName": "SankeyChart",
    "description": "Sankey diagram for visualizing flow between nodes (rendered as table with bars)",
    "tags": [
      "chart",
      "sankey",
      "flow",
      "network",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "nodes": {
        "type": "string",
        "description": "Node definitions",
        "required": true,
        "tsType": "Array<{ name: string; }>"
      },
      "links": {
        "type": "string",
        "description": "Link/flow definitions",
        "required": true,
        "tsType": "Array<{ source: number | string; // Node index or name target: number | string; // Node index or name value: number; }>"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "SankeyChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "nodes": {
          "type": "Array<{ name: string; }>",
          "description": "Node definitions",
          "optional": false
        },
        "links": {
          "type": "Array<{ source: number | string; // Node index or name target: number | string; // Node index or name value: number; }>",
          "description": "Link/flow definitions",
          "optional": false
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "scatter-chart": {
    "name": "scatter-chart",
    "category": "charts",
    "fileName": "ScatterChart",
    "description": "Scatter chart for visualizing correlation between two variables with customizable markers",
    "tags": [
      "chart",
      "scatter",
      "correlation",
      "xy-plot",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis configuration",
        "required": false,
        "tsType": "Array<{ min?: number; max?: number; label?: string; }>"
      },
      "yAxis": {
        "type": "string",
        "description": "Y-axis configuration",
        "required": false,
        "tsType": "Array<{ min?: number; max?: number; label?: string; }>"
      },
      "series": {
        "type": "string",
        "description": "Series data for scatter points",
        "required": true,
        "tsType": "Array<{ data: Array<{ x: number; y: number; id?: string | number; }> | Array<[ number, number ]>; label?: string; color?: string; markerSize?: number; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "grid": {
        "type": "boolean",
        "description": "Show grid lines",
        "required": false,
        "tsType": "{ vertical?: boolean; horizontal?: boolean; }"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      }
    },
    "interfaces": {
      "ScatterChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "xAxis": {
          "type": "Array<{ min?: number; max?: number; label?: string; }>",
          "description": "X-axis configuration",
          "optional": true
        },
        "yAxis": {
          "type": "Array<{ min?: number; max?: number; label?: string; }>",
          "description": "Y-axis configuration",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: Array<{ x: number; y: number; id?: string | number; }> | Array<[ number, number ]>; label?: string; color?: string; markerSize?: number; }>",
          "description": "Series data for scatter points",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "grid": {
          "type": "{ vertical?: boolean; horizontal?: boolean; }",
          "description": "Show grid lines",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        }
      }
    }
  },
  "sparkline-chart": {
    "name": "sparkline-chart",
    "category": "charts",
    "fileName": "SparklineChart",
    "description": "Compact sparkline chart for displaying trends in small spaces, perfect for dashboards",
    "tags": [
      "chart",
      "sparkline",
      "mini",
      "trend",
      "compact",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "number",
        "description": "Data points",
        "required": true,
        "tsType": "number[]"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "color": {
        "type": "string",
        "description": "Line color",
        "required": false,
        "tsType": "string"
      },
      "area": {
        "type": "boolean",
        "description": "Show area under the line",
        "required": false,
        "tsType": "boolean"
      },
      "showTooltip": {
        "type": "boolean",
        "description": "Show tooltip",
        "required": false,
        "tsType": "boolean"
      },
      "curve": {
        "type": "'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'",
        "description": "Curve type",
        "required": false,
        "tsType": "'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'"
      }
    },
    "interfaces": {
      "SparklineChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "data": {
          "type": "number[]",
          "description": "Data points",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "color": {
          "type": "string",
          "description": "Line color",
          "optional": true
        },
        "area": {
          "type": "boolean",
          "description": "Show area under the line",
          "optional": true
        },
        "showTooltip": {
          "type": "boolean",
          "description": "Show tooltip",
          "optional": true
        },
        "curve": {
          "type": "'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'",
          "description": "Curve type",
          "optional": true
        }
      }
    }
  },
  "stacked-area-chart": {
    "name": "stacked-area-chart",
    "category": "charts",
    "fileName": "StackedAreaChart",
    "description": "Stacked area chart",
    "tags": [
      "chart"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "any[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "StackedAreaChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "any[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "stacked-bar-chart-v2": {
    "name": "stacked-bar-chart-v2",
    "category": "charts",
    "fileName": "StackedBarChart",
    "description": "Stacked bar variant",
    "tags": [
      "chart"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "any[]"
      },
      "width": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "StackedBarChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "any[]",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "height": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "time-series-chart": {
    "name": "time-series-chart",
    "category": "charts",
    "fileName": "TimeSeriesChart",
    "description": "Time series line chart for visualizing data over time with multiple series support",
    "tags": [
      "chart",
      "time-series",
      "line",
      "temporal",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "series": {
        "type": "string",
        "description": "Series data with time-based data points",
        "required": true,
        "tsType": "Array<{ name?: string; color?: string; data: Array<[ number, number ]>; // [timestamp, value] pairs }>"
      },
      "xAxis": {
        "type": "object",
        "description": "X-axis configuration",
        "required": false,
        "tsType": "{ type: 'time'; }"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "grid": {
        "type": "boolean",
        "description": "Show grid lines",
        "required": false,
        "tsType": "{ vertical?: boolean; horizontal?: boolean; }"
      },
      "legend": {
        "type": "boolean",
        "description": "Show legend",
        "required": false,
        "tsType": "boolean"
      },
      "margin": {
        "type": "number",
        "description": "Margin around chart",
        "required": false,
        "tsType": "{ top?: number; right?: number; bottom?: number; left?: number; }"
      }
    },
    "interfaces": {
      "TimeSeriesChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "series": {
          "type": "Array<{ name?: string; color?: string; data: Array<[ number, number ]>; // [timestamp, value] pairs }>",
          "description": "Series data with time-based data points",
          "optional": false
        },
        "xAxis": {
          "type": "{ type: 'time'; }",
          "description": "X-axis configuration",
          "optional": true
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "grid": {
          "type": "{ vertical?: boolean; horizontal?: boolean; }",
          "description": "Show grid lines",
          "optional": true
        },
        "legend": {
          "type": "boolean",
          "description": "Show legend",
          "optional": true
        },
        "margin": {
          "type": "{ top?: number; right?: number; bottom?: number; left?: number; }",
          "description": "Margin around chart",
          "optional": true
        }
      }
    }
  },
  "treemap-chart": {
    "name": "treemap-chart",
    "category": "charts",
    "fileName": "TreeMapChart",
    "description": "Tree map chart for displaying hierarchical data with nested rectangles proportional to values",
    "tags": [
      "chart",
      "treemap",
      "hierarchy",
      "nested",
      "proportional",
      "data-visualization"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "string",
        "description": "Hierarchical data - can be direct data or series format",
        "required": false,
        "tsType": "Array<{ name: string; size: number; children?: Array<{ name: string; size: number; }>; }>"
      },
      "series": {
        "type": "string",
        "description": "Series format data (alternative to data prop)",
        "required": false,
        "tsType": "Array<{ data: Array<{ name: string; value: number; children?: Array<{ name: string; value: number; }>; }>; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      },
      "colors": {
        "type": "string",
        "description": "Color scheme",
        "required": false,
        "tsType": "string[]"
      },
      "showLabels": {
        "type": "boolean",
        "description": "Show labels",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "TreeMapChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "data": {
          "type": "Array<{ name: string; size: number; children?: Array<{ name: string; size: number; }>; }>",
          "description": "Hierarchical data - can be direct data or series format",
          "optional": true
        },
        "series": {
          "type": "Array<{ data: Array<{ name: string; value: number; children?: Array<{ name: string; value: number; }>; }>; }>",
          "description": "Series format data (alternative to data prop)",
          "optional": true
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        },
        "colors": {
          "type": "string[]",
          "description": "Color scheme",
          "optional": true
        },
        "showLabels": {
          "type": "boolean",
          "description": "Show labels",
          "optional": true
        }
      }
    }
  },
  "waterfall-chart": {
    "name": "waterfall-chart",
    "category": "charts",
    "fileName": "WaterfallChart",
    "description": "Waterfall chart for cumulative impact visualization. Shows increases, decreases, and totals.",
    "tags": [
      "chart",
      "waterfall",
      "cumulative",
      "financial"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Chart title",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Chart description",
        "required": false,
        "tsType": "string"
      },
      "xAxis": {
        "type": "string",
        "description": "X-axis categories",
        "required": false,
        "tsType": "{ data: string[]; }"
      },
      "series": {
        "type": "string",
        "description": "Series data with waterfall values",
        "required": true,
        "tsType": "Array<{ name?: string; data: (number | { value: number; isTotal?: boolean; })[]; type?: string; }>"
      },
      "width": {
        "type": "number",
        "description": "Chart width",
        "required": false,
        "tsType": "number"
      },
      "height": {
        "type": "number",
        "description": "Chart height",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "WaterfallChartProps": {
        "title": {
          "type": "string",
          "description": "Chart title",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Chart description",
          "optional": true
        },
        "xAxis": {
          "type": "{ data: string[]; }",
          "description": "X-axis categories",
          "optional": true
        },
        "series": {
          "type": "Array<{ name?: string; data: (number | { value: number; isTotal?: boolean; })[]; type?: string; }>",
          "description": "Series data with waterfall values",
          "optional": false
        },
        "width": {
          "type": "number",
          "description": "Chart width",
          "optional": true
        },
        "height": {
          "type": "number",
          "description": "Chart height",
          "optional": true
        }
      }
    }
  },
  "avatar": {
    "name": "avatar",
    "category": "data-display",
    "fileName": "Avatar",
    "description": "User avatar with status indicators, badges, and multiple sizes",
    "tags": [
      "avatar",
      "user",
      "profile",
      "status",
      "badge",
      "image"
    ],
    "props": {
      "src": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "alt": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "name": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "size": {
        "type": "AvatarSize",
        "description": "",
        "required": false,
        "tsType": "AvatarSize"
      },
      "variant": {
        "type": "AvatarVariant",
        "description": "",
        "required": false,
        "tsType": "AvatarVariant"
      },
      "status": {
        "type": "AvatarStatus",
        "description": "",
        "required": false,
        "tsType": "AvatarStatus"
      },
      "badge": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "fallbackIcon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "AvatarProps": {
        "src": {
          "type": "string",
          "optional": true
        },
        "alt": {
          "type": "string",
          "optional": true
        },
        "name": {
          "type": "string",
          "optional": true
        },
        "size": {
          "type": "AvatarSize",
          "optional": true
        },
        "variant": {
          "type": "AvatarVariant",
          "optional": true
        },
        "status": {
          "type": "AvatarStatus",
          "optional": true
        },
        "badge": {
          "type": "string | number",
          "optional": true
        },
        "fallbackIcon": {
          "type": "string",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "badge": {
    "name": "badge",
    "category": "data-display",
    "fileName": "Badge",
    "description": "Status badge with count/text support and multiple variants",
    "tags": [
      "badge",
      "status",
      "label",
      "count",
      "notification"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "variant": {
        "type": "BadgeVariant",
        "description": "",
        "required": false,
        "tsType": "BadgeVariant"
      },
      "size": {
        "type": "BadgeSize",
        "description": "",
        "required": false,
        "tsType": "BadgeSize"
      },
      "count": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showDot": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "max": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "BadgeProps": {
        "label": {
          "type": "string",
          "optional": false
        },
        "variant": {
          "type": "BadgeVariant",
          "optional": true
        },
        "size": {
          "type": "BadgeSize",
          "optional": true
        },
        "count": {
          "type": "number",
          "optional": true
        },
        "showDot": {
          "type": "boolean",
          "optional": true
        },
        "max": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "calendar": {
    "name": "calendar",
    "category": "data-display",
    "fileName": "Calendar",
    "description": "Interactive calendar with event support and date selection",
    "tags": [
      "calendar",
      "date",
      "events",
      "schedule",
      "picker"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "events": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "CalendarEvent[]"
      },
      "view": {
        "type": "CalendarView",
        "description": "",
        "required": false,
        "tsType": "CalendarView"
      },
      "selectedDate": {
        "type": "Date",
        "description": "",
        "required": false,
        "tsType": "Date"
      },
      "onDateSelect": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(date: Date) => void"
      },
      "onEventClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(event: CalendarEvent) => void"
      },
      "minDate": {
        "type": "Date",
        "description": "",
        "required": false,
        "tsType": "Date"
      },
      "maxDate": {
        "type": "Date",
        "description": "",
        "required": false,
        "tsType": "Date"
      }
    },
    "interfaces": {
      "CalendarEvent": {
        "id": {
          "type": "string",
          "optional": false
        },
        "date": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": false
        },
        "color": {
          "type": "string",
          "optional": true
        }
      },
      "CalendarProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "events": {
          "type": "CalendarEvent[]",
          "optional": true
        },
        "view": {
          "type": "CalendarView",
          "optional": true
        },
        "selectedDate": {
          "type": "Date",
          "optional": true
        },
        "onDateSelect": {
          "type": "(date: Date) => void",
          "optional": true
        },
        "onEventClick": {
          "type": "(event: CalendarEvent) => void",
          "optional": true
        },
        "minDate": {
          "type": "Date",
          "optional": true
        },
        "maxDate": {
          "type": "Date",
          "optional": true
        }
      }
    }
  },
  "chip": {
    "name": "chip",
    "category": "data-display",
    "fileName": "Chip",
    "description": "Removable chips/tags with icons and multiple variants",
    "tags": [
      "chip",
      "tag",
      "label",
      "removable",
      "badge"
    ],
    "props": {
      "chips": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "ChipData[]"
      },
      "variant": {
        "type": "ChipVariant",
        "description": "",
        "required": false,
        "tsType": "ChipVariant"
      },
      "color": {
        "type": "ChipColor",
        "description": "",
        "required": false,
        "tsType": "ChipColor"
      },
      "size": {
        "type": "ChipSize",
        "description": "",
        "required": false,
        "tsType": "ChipSize"
      },
      "deletable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onDelete": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(id: string) => void"
      },
      "onClick": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(id: string) => void"
      }
    },
    "interfaces": {
      "ChipData": {
        "id": {
          "type": "string",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "icon": {
          "type": "string",
          "optional": true
        }
      },
      "ChipProps": {
        "chips": {
          "type": "ChipData[]",
          "optional": false
        },
        "variant": {
          "type": "ChipVariant",
          "optional": true
        },
        "color": {
          "type": "ChipColor",
          "optional": true
        },
        "size": {
          "type": "ChipSize",
          "optional": true
        },
        "deletable": {
          "type": "boolean",
          "optional": true
        },
        "onDelete": {
          "type": "(id: string) => void",
          "optional": true
        },
        "onClick": {
          "type": "(id: string) => void",
          "optional": true
        }
      }
    }
  },
  "data-grid": {
    "name": "data-grid",
    "category": "data-display",
    "fileName": "DataGrid",
    "description": "Advanced data grid with sorting, filtering, pagination, and selection",
    "tags": [
      "grid",
      "table",
      "data",
      "sort",
      "filter",
      "pagination",
      "editable"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "columns": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "Column[]"
      },
      "rows": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "Row[]"
      },
      "selectable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "multiSelect": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "editable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "pagination": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "pageSize": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "onRowClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(row: Row) => void"
      },
      "onRowEdit": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(row: Row) => void"
      },
      "onRowSelect": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "(selectedRows: Row[]) => void"
      }
    },
    "interfaces": {
      "Column": {
        "id": {
          "type": "string",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "sortable": {
          "type": "boolean",
          "optional": true
        },
        "filterable": {
          "type": "boolean",
          "optional": true
        },
        "type": {
          "type": "'text' | 'number' | 'date' | 'boolean'",
          "optional": true
        }
      },
      "Row": {
        "id": {
          "type": "string",
          "optional": false
        }
      },
      "DataGridProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "columns": {
          "type": "Column[]",
          "optional": false
        },
        "rows": {
          "type": "Row[]",
          "optional": false
        },
        "selectable": {
          "type": "boolean",
          "optional": true
        },
        "multiSelect": {
          "type": "boolean",
          "optional": true
        },
        "editable": {
          "type": "boolean",
          "optional": true
        },
        "pagination": {
          "type": "boolean",
          "optional": true
        },
        "pageSize": {
          "type": "number",
          "optional": true
        },
        "onRowClick": {
          "type": "(row: Row) => void",
          "optional": true
        },
        "onRowEdit": {
          "type": "(row: Row) => void",
          "optional": true
        },
        "onRowSelect": {
          "type": "(selectedRows: Row[]) => void",
          "optional": true
        }
      }
    }
  },
  "data-table": {
    "name": "data-table",
    "category": "data-display",
    "fileName": "DataTable",
    "description": "Advanced data table with sorting, filtering, and search functionality",
    "tags": [
      "table",
      "data",
      "grid",
      "sort",
      "search",
      "filter"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "columns": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string[]"
      },
      "rows": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "(string | number)[][]"
      },
      "sortable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "searchable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "DataTableProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "columns": {
          "type": "string[]",
          "optional": false
        },
        "rows": {
          "type": "(string | number)[][]",
          "optional": false
        },
        "sortable": {
          "type": "boolean",
          "optional": true
        },
        "searchable": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "gantt": {
    "name": "gantt",
    "category": "data-display",
    "fileName": "Gantt",
    "description": "Project timeline visualization with task dependencies and progress",
    "tags": [
      "gantt",
      "timeline",
      "project",
      "schedule",
      "tasks",
      "planning"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "tasks": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "GanttTask[]"
      },
      "onTaskClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(task: GanttTask) => void"
      },
      "viewMode": {
        "type": "'day' | 'week' | 'month'",
        "description": "",
        "required": false,
        "tsType": "'day' | 'week' | 'month'"
      }
    },
    "interfaces": {
      "GanttTask": {
        "id": {
          "type": "string",
          "optional": false
        },
        "name": {
          "type": "string",
          "optional": false
        },
        "startDate": {
          "type": "string",
          "optional": false
        },
        "endDate": {
          "type": "string",
          "optional": false
        },
        "progress": {
          "type": "number",
          "optional": false
        },
        "dependencies": {
          "type": "string[]",
          "optional": true
        },
        "assignee": {
          "type": "string",
          "optional": true
        },
        "color": {
          "type": "string",
          "optional": true
        }
      },
      "GanttProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "tasks": {
          "type": "GanttTask[]",
          "optional": false
        },
        "onTaskClick": {
          "type": "(task: GanttTask) => void",
          "optional": true
        },
        "viewMode": {
          "type": "'day' | 'week' | 'month'",
          "optional": true
        }
      }
    }
  },
  "kanban": {
    "name": "kanban",
    "category": "data-display",
    "fileName": "Kanban",
    "description": "Drag-and-drop kanban board with columns and cards",
    "tags": [
      "kanban",
      "board",
      "cards",
      "workflow",
      "drag-drop",
      "agile"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "columns": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "KanbanColumn[]"
      },
      "onCardClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(card: KanbanCard) => void"
      },
      "onCardMove": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(cardId: string, fromColumn: string, toColumn: string) => void"
      }
    },
    "interfaces": {
      "KanbanCard": {
        "id": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": false
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "assignee": {
          "type": "string",
          "optional": true
        },
        "avatar": {
          "type": "string",
          "optional": true
        },
        "tags": {
          "type": "string[]",
          "optional": true
        },
        "priority": {
          "type": "'low' | 'medium' | 'high'",
          "optional": true
        },
        "dueDate": {
          "type": "string",
          "optional": true
        }
      },
      "KanbanColumn": {
        "id": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": false
        },
        "cards": {
          "type": "KanbanCard[]",
          "optional": false
        },
        "limit": {
          "type": "number",
          "optional": true
        },
        "color": {
          "type": "string",
          "optional": true
        }
      },
      "KanbanProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "columns": {
          "type": "KanbanColumn[]",
          "optional": false
        },
        "onCardClick": {
          "type": "(card: KanbanCard) => void",
          "optional": true
        },
        "onCardMove": {
          "type": "(cardId: string, fromColumn: string, toColumn: string) => void",
          "optional": true
        }
      }
    }
  },
  "list": {
    "name": "list",
    "category": "data-display",
    "fileName": "List",
    "description": "Flexible list component with selection, icons, and various layouts",
    "tags": [
      "list",
      "items",
      "selection",
      "avatar",
      "menu"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "ListItemData[]"
      },
      "variant": {
        "type": "ListVariant",
        "description": "",
        "required": false,
        "tsType": "ListVariant"
      },
      "density": {
        "type": "ListDensity",
        "description": "",
        "required": false,
        "tsType": "ListDensity"
      },
      "selectable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "multiSelect": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "selectedIds": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string[]"
      },
      "onSelect": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(ids: string[]) => void"
      },
      "onItemClick": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(id: string) => void"
      }
    },
    "interfaces": {
      "ListItemData": {
        "id": {
          "type": "string",
          "optional": false
        },
        "primary": {
          "type": "string",
          "optional": false
        },
        "secondary": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "avatar": {
          "type": "string",
          "optional": true
        },
        "action": {
          "type": "React.ReactNode",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        }
      },
      "ListProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "items": {
          "type": "ListItemData[]",
          "optional": false
        },
        "variant": {
          "type": "ListVariant",
          "optional": true
        },
        "density": {
          "type": "ListDensity",
          "optional": true
        },
        "selectable": {
          "type": "boolean",
          "optional": true
        },
        "multiSelect": {
          "type": "boolean",
          "optional": true
        },
        "selectedIds": {
          "type": "string[]",
          "optional": true
        },
        "onSelect": {
          "type": "(ids: string[]) => void",
          "optional": true
        },
        "onItemClick": {
          "type": "(id: string) => void",
          "optional": true
        }
      }
    }
  },
  "list-item": {
    "name": "list-item",
    "category": "data-display",
    "fileName": "ListItem",
    "description": "Individual list item with rich content support",
    "tags": [
      "list",
      "item",
      "menu",
      "avatar",
      "badge"
    ],
    "props": {
      "primary": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "secondary": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "tertiary": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "icon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "avatar": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "badge": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "variant": {
        "type": "ListItemVariant",
        "description": "",
        "required": false,
        "tsType": "ListItemVariant"
      },
      "size": {
        "type": "ListItemSize",
        "description": "",
        "required": false,
        "tsType": "ListItemSize"
      },
      "selected": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "action": {
        "type": "React.ReactNode",
        "description": "",
        "required": false,
        "tsType": "React.ReactNode"
      },
      "leftContent": {
        "type": "React.ReactNode",
        "description": "",
        "required": false,
        "tsType": "React.ReactNode"
      },
      "rightContent": {
        "type": "React.ReactNode",
        "description": "",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "ListItemProps": {
        "primary": {
          "type": "string",
          "optional": false
        },
        "secondary": {
          "type": "string",
          "optional": true
        },
        "tertiary": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "avatar": {
          "type": "string",
          "optional": true
        },
        "badge": {
          "type": "string | number",
          "optional": true
        },
        "variant": {
          "type": "ListItemVariant",
          "optional": true
        },
        "size": {
          "type": "ListItemSize",
          "optional": true
        },
        "selected": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        },
        "action": {
          "type": "React.ReactNode",
          "optional": true
        },
        "leftContent": {
          "type": "React.ReactNode",
          "optional": true
        },
        "rightContent": {
          "type": "React.ReactNode",
          "optional": true
        }
      }
    }
  },
  "mind-map": {
    "name": "mind-map",
    "category": "data-display",
    "fileName": "MindMap",
    "description": "Interactive mind map visualization with expandable nodes",
    "tags": [
      "mindmap",
      "diagram",
      "visualization",
      "hierarchy",
      "brainstorm"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "MindMapNode",
        "description": "",
        "required": true,
        "tsType": "MindMapNode"
      },
      "onNodeClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(node: MindMapNode) => void"
      },
      "layout": {
        "type": "'radial' | 'tree'",
        "description": "",
        "required": false,
        "tsType": "'radial' | 'tree'"
      }
    },
    "interfaces": {
      "MindMapNode": {
        "id": {
          "type": "string",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "children": {
          "type": "MindMapNode[]",
          "optional": true
        },
        "color": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        }
      },
      "MindMapProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "MindMapNode",
          "optional": false
        },
        "onNodeClick": {
          "type": "(node: MindMapNode) => void",
          "optional": true
        },
        "layout": {
          "type": "'radial' | 'tree'",
          "optional": true
        }
      }
    }
  },
  "org-chart": {
    "name": "org-chart",
    "category": "data-display",
    "fileName": "OrgChart",
    "description": "Organizational hierarchy chart with employee details",
    "tags": [
      "organization",
      "chart",
      "hierarchy",
      "team",
      "structure",
      "employees"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "OrgNode",
        "description": "",
        "required": true,
        "tsType": "OrgNode"
      },
      "onNodeClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(node: OrgNode) => void"
      },
      "showDetails": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "OrgNode": {
        "id": {
          "type": "string",
          "optional": false
        },
        "name": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": false
        },
        "avatar": {
          "type": "string",
          "optional": true
        },
        "email": {
          "type": "string",
          "optional": true
        },
        "phone": {
          "type": "string",
          "optional": true
        },
        "department": {
          "type": "string",
          "optional": true
        },
        "children": {
          "type": "OrgNode[]",
          "optional": true
        }
      },
      "OrgChartProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "OrgNode",
          "optional": false
        },
        "onNodeClick": {
          "type": "(node: OrgNode) => void",
          "optional": true
        },
        "showDetails": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "timeline": {
    "name": "timeline",
    "category": "data-display",
    "fileName": "Timeline",
    "description": "Vertical and horizontal timeline with status indicators",
    "tags": [
      "timeline",
      "chronological",
      "history",
      "steps",
      "progress"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "TimelineItem[]"
      },
      "orientation": {
        "type": "TimelineOrientation",
        "description": "",
        "required": false,
        "tsType": "TimelineOrientation"
      },
      "align": {
        "type": "TimelineAlign",
        "description": "",
        "required": false,
        "tsType": "TimelineAlign"
      },
      "showConnector": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "TimelineItem": {
        "id": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": false
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "timestamp": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "status": {
          "type": "ItemStatus",
          "optional": true
        },
        "content": {
          "type": "React.ReactNode",
          "optional": true
        }
      },
      "TimelineProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "items": {
          "type": "TimelineItem[]",
          "optional": false
        },
        "orientation": {
          "type": "TimelineOrientation",
          "optional": true
        },
        "align": {
          "type": "TimelineAlign",
          "optional": true
        },
        "showConnector": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "tree-view": {
    "name": "tree-view",
    "category": "data-display",
    "fileName": "TreeView",
    "description": "Hierarchical tree view with expand/collapse and selection",
    "tags": [
      "tree",
      "hierarchy",
      "folder",
      "nested",
      "expandable"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "data": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "TreeNode[]"
      },
      "defaultExpandAll": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "selectable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "multiSelect": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showLines": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onNodeClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(node: TreeNode) => void"
      },
      "onNodeSelect": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "(selectedNodes: TreeNode[]) => void"
      }
    },
    "interfaces": {
      "TreeNode": {
        "id": {
          "type": "string",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "children": {
          "type": "TreeNode[]",
          "optional": true
        },
        "metadata": {
          "type": "Record<string, any>",
          "optional": true
        }
      },
      "TreeViewProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "data": {
          "type": "TreeNode[]",
          "optional": false
        },
        "defaultExpandAll": {
          "type": "boolean",
          "optional": true
        },
        "selectable": {
          "type": "boolean",
          "optional": true
        },
        "multiSelect": {
          "type": "boolean",
          "optional": true
        },
        "showLines": {
          "type": "boolean",
          "optional": true
        },
        "onNodeClick": {
          "type": "(node: TreeNode) => void",
          "optional": true
        },
        "onNodeSelect": {
          "type": "(selectedNodes: TreeNode[]) => void",
          "optional": true
        }
      }
    }
  },
  "virtualized-table": {
    "name": "virtualized-table",
    "category": "data-display",
    "fileName": "VirtualizedTable",
    "description": "High-performance table with virtual scrolling for large datasets",
    "tags": [
      "table",
      "virtual",
      "performance",
      "large-data",
      "scroll",
      "optimized"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "columns": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "Column[]"
      },
      "rows": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "Row[]"
      },
      "rowHeight": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "overscan": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "onRowClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(row: Row) => void"
      },
      "stickyHeader": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "Column": {
        "id": {
          "type": "string",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "width": {
          "type": "number",
          "optional": true
        },
        "align": {
          "type": "'left' | 'center' | 'right'",
          "optional": true
        },
        "render": {
          "type": "(value: any, row: Row) => React.ReactNode",
          "optional": true
        }
      },
      "Row": {
        "id": {
          "type": "string",
          "optional": false
        }
      },
      "VirtualizedTableProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "columns": {
          "type": "Column[]",
          "optional": false
        },
        "rows": {
          "type": "Row[]",
          "optional": false
        },
        "rowHeight": {
          "type": "number",
          "optional": true
        },
        "overscan": {
          "type": "number",
          "optional": true
        },
        "onRowClick": {
          "type": "(row: Row) => void",
          "optional": true
        },
        "stickyHeader": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "autocomplete": {
    "name": "autocomplete",
    "category": "inputs",
    "fileName": "Autocomplete",
    "description": "Autocomplete input with dropdown suggestions, keyboard navigation, and filtering. Supports custom options and validation.",
    "tags": [
      "ui",
      "input",
      "form",
      "autocomplete",
      "search",
      "suggestions"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "options": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "AutocompleteOption[]"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "AutocompleteOption[]"
      },
      "suggestions": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "AutocompleteOption[]"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "filterOnType": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "caseSensitive": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string | number) => void"
      },
      "onInputChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(inputValue: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "AutocompleteOption": {
        "value": {
          "type": "string | number",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        }
      },
      "AutocompleteProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string | number",
          "optional": true
        },
        "defaultValue": {
          "type": "string | number",
          "optional": true
        },
        "options": {
          "type": "AutocompleteOption[]",
          "optional": true
        },
        "items": {
          "type": "AutocompleteOption[]",
          "optional": true
        },
        "suggestions": {
          "type": "AutocompleteOption[]",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "filterOnType": {
          "type": "boolean",
          "optional": true
        },
        "caseSensitive": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string | number) => void",
          "optional": true
        },
        "onInputChange": {
          "type": "(inputValue: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "checkbox": {
    "name": "checkbox",
    "category": "inputs",
    "fileName": "Checkbox",
    "description": "Checkbox input component with customizable colors, sizes, and validation. Supports labels and helper text.",
    "tags": [
      "ui",
      "input",
      "form",
      "checkbox",
      "toggle"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "checked": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "defaultChecked": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "onChange": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "(checked: boolean) => void"
      }
    },
    "interfaces": {
      "CheckboxProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "text": {
          "type": "string",
          "optional": true
        },
        "checked": {
          "type": "boolean",
          "optional": true
        },
        "defaultChecked": {
          "type": "boolean",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "onChange": {
          "type": "(checked: boolean) => void",
          "optional": true
        }
      }
    }
  },
  "color-picker": {
    "name": "color-picker",
    "category": "inputs",
    "fileName": "ColorPicker",
    "description": "Color picker with preview, text input, and preset color palette. Supports hex color values and validation.",
    "tags": [
      "ui",
      "input",
      "form",
      "color",
      "picker",
      "palette"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showPreview": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showInput": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "presetColors": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string[]"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "ColorPickerProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "showPreview": {
          "type": "boolean",
          "optional": true
        },
        "showInput": {
          "type": "boolean",
          "optional": true
        },
        "presetColors": {
          "type": "string[]",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "date-picker": {
    "name": "date-picker",
    "category": "inputs",
    "fileName": "DatePicker",
    "description": "Date picker component with calendar icon, min/max date validation, and various styling options.",
    "tags": [
      "ui",
      "input",
      "form",
      "date",
      "calendar"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "min": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "max": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showCalendarIcon": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "DatePickerProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "min": {
          "type": "string",
          "optional": true
        },
        "max": {
          "type": "string",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "showCalendarIcon": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "datetime-picker": {
    "name": "datetime-picker",
    "category": "inputs",
    "fileName": "DateTimePicker",
    "description": "DateTime picker component for selecting both date and time with validation and styling options.",
    "tags": [
      "ui",
      "input",
      "form",
      "datetime",
      "calendar",
      "time"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "min": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "max": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showIcon": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "DateTimePickerProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "min": {
          "type": "string",
          "optional": true
        },
        "max": {
          "type": "string",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "showIcon": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "file-picker": {
    "name": "file-picker",
    "category": "inputs",
    "fileName": "FilePicker",
    "description": "File upload component with drag-and-drop support, file validation, size limits, and preview. Supports single or multiple files.",
    "tags": [
      "ui",
      "input",
      "form",
      "file",
      "upload",
      "drag-drop"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "accept": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "multiple": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "maxSize": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "maxFiles": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showFileList": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "dragAndDrop": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'button' | 'dropzone'",
        "description": "",
        "required": false,
        "tsType": "'button' | 'dropzone'"
      },
      "onChange": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "(files: FileList | null) => void"
      },
      "onError": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(error: string) => void"
      }
    },
    "interfaces": {
      "FilePickerProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "accept": {
          "type": "string",
          "optional": true
        },
        "multiple": {
          "type": "boolean",
          "optional": true
        },
        "maxSize": {
          "type": "number",
          "optional": true
        },
        "maxFiles": {
          "type": "number",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "showFileList": {
          "type": "boolean",
          "optional": true
        },
        "dragAndDrop": {
          "type": "boolean",
          "optional": true
        },
        "variant": {
          "type": "'button' | 'dropzone'",
          "optional": true
        },
        "onChange": {
          "type": "(files: FileList | null) => void",
          "optional": true
        },
        "onError": {
          "type": "(error: string) => void",
          "optional": true
        }
      }
    }
  },
  "multi-select": {
    "name": "multi-select",
    "category": "inputs",
    "fileName": "MultiSelect",
    "description": "Multi-select dropdown with checkboxes, tags display, and max selection limit. Supports validation and styling variants.",
    "tags": [
      "ui",
      "input",
      "form",
      "select",
      "multiselect",
      "dropdown"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<string | number>"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<string | number>"
      },
      "options": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "MultiSelectOption[]"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "MultiSelectOption[]"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "maxSelections": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showCheckboxes": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: Array<string | number>) => void"
      }
    },
    "interfaces": {
      "MultiSelectOption": {
        "value": {
          "type": "string | number",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        }
      },
      "MultiSelectProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "Array<string | number>",
          "optional": true
        },
        "defaultValue": {
          "type": "Array<string | number>",
          "optional": true
        },
        "options": {
          "type": "MultiSelectOption[]",
          "optional": true
        },
        "items": {
          "type": "MultiSelectOption[]",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "maxSelections": {
          "type": "number",
          "optional": true
        },
        "showCheckboxes": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: Array<string | number>) => void",
          "optional": true
        }
      }
    }
  },
  "otp-input": {
    "name": "otp-input",
    "category": "inputs",
    "fileName": "OTPInput",
    "description": "OTP (One-Time Password) input with auto-focus, paste support, and keyboard navigation. Supports masking and validation.",
    "tags": [
      "ui",
      "input",
      "form",
      "otp",
      "verification",
      "code"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "length": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "type": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "'number' | 'text'"
      },
      "mask": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "autoFocus": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onComplete": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      }
    },
    "interfaces": {
      "OTPInputProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "length": {
          "type": "number",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "type": {
          "type": "'number' | 'text'",
          "optional": true
        },
        "mask": {
          "type": "boolean",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "autoFocus": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onComplete": {
          "type": "(value: string) => void",
          "optional": true
        }
      }
    }
  },
  "radio": {
    "name": "radio",
    "category": "inputs",
    "fileName": "Radio",
    "description": "Radio button group component with customizable colors, sizes, and orientations. Supports validation and helper text.",
    "tags": [
      "ui",
      "input",
      "form",
      "radio",
      "selection"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "name": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "options": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "RadioOption[]"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "RadioOption[]"
      },
      "choices": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "RadioOption[]"
      },
      "orientation": {
        "type": "'horizontal' | 'vertical'",
        "description": "",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string | number) => void"
      }
    },
    "interfaces": {
      "RadioOption": {
        "value": {
          "type": "string | number",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        }
      },
      "RadioProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "name": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string | number",
          "optional": true
        },
        "defaultValue": {
          "type": "string | number",
          "optional": true
        },
        "options": {
          "type": "RadioOption[]",
          "optional": true
        },
        "items": {
          "type": "RadioOption[]",
          "optional": true
        },
        "choices": {
          "type": "RadioOption[]",
          "optional": true
        },
        "orientation": {
          "type": "'horizontal' | 'vertical'",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "onChange": {
          "type": "(value: string | number) => void",
          "optional": true
        }
      }
    }
  },
  "range-slider": {
    "name": "range-slider",
    "category": "inputs",
    "fileName": "RangeSlider",
    "description": "Dual-handle range slider for selecting a range between min and max values. Supports steps, colors, and value display.",
    "tags": [
      "ui",
      "input",
      "form",
      "slider",
      "range",
      "dual"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "[ number, number ]"
      },
      "defaultValue": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "[ number, number ]"
      },
      "min": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "max": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "step": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showValues": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showLabels": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onChange": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(value: [ number, number ]) => void"
      },
      "onChangeCommitted": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(value: [ number, number ]) => void"
      }
    },
    "interfaces": {
      "RangeSliderProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "[ number, number ]",
          "optional": true
        },
        "defaultValue": {
          "type": "[ number, number ]",
          "optional": true
        },
        "min": {
          "type": "number",
          "optional": true
        },
        "max": {
          "type": "number",
          "optional": true
        },
        "step": {
          "type": "number",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "showValues": {
          "type": "boolean",
          "optional": true
        },
        "showLabels": {
          "type": "boolean",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "onChange": {
          "type": "(value: [ number, number ]) => void",
          "optional": true
        },
        "onChangeCommitted": {
          "type": "(value: [ number, number ]) => void",
          "optional": true
        }
      }
    }
  },
  "rating": {
    "name": "rating",
    "category": "inputs",
    "fileName": "Rating",
    "description": "Rating component with customizable icons (star, heart, circle), precision, and max value. Supports hover effects and validation.",
    "tags": [
      "ui",
      "input",
      "form",
      "rating",
      "stars",
      "review"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "defaultValue": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "max": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "precision": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "readOnly": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'warning' | 'error'"
      },
      "icon": {
        "type": "'star' | 'heart' | 'circle'",
        "description": "",
        "required": false,
        "tsType": "'star' | 'heart' | 'circle'"
      },
      "showValue": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(value: number) => void"
      }
    },
    "interfaces": {
      "RatingProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "number",
          "optional": true
        },
        "defaultValue": {
          "type": "number",
          "optional": true
        },
        "max": {
          "type": "number",
          "optional": true
        },
        "precision": {
          "type": "number",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "readOnly": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'warning' | 'error'",
          "optional": true
        },
        "icon": {
          "type": "'star' | 'heart' | 'circle'",
          "optional": true
        },
        "showValue": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: number) => void",
          "optional": true
        }
      }
    }
  },
  "rich-text-editor": {
    "name": "rich-text-editor",
    "category": "inputs",
    "fileName": "RichTextEditor",
    "description": "Rich text editor with formatting toolbar, text alignment, lists, and basic styling options. Supports HTML content.",
    "tags": [
      "ui",
      "input",
      "form",
      "editor",
      "richtext",
      "wysiwyg"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "minHeight": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "maxHeight": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showToolbar": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      }
    },
    "interfaces": {
      "RichTextEditorProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "minHeight": {
          "type": "string",
          "optional": true
        },
        "maxHeight": {
          "type": "string",
          "optional": true
        },
        "showToolbar": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        }
      }
    }
  },
  "search-input": {
    "name": "search-input",
    "category": "inputs",
    "fileName": "SearchInput",
    "description": "Search input component with clear button, loading state, and search icon. Supports Enter key to search.",
    "tags": [
      "ui",
      "input",
      "form",
      "search",
      "filter"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "loading": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showClearButton": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onSearch": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onClear": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "SearchInputProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "loading": {
          "type": "boolean",
          "optional": true
        },
        "showClearButton": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onSearch": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onClear": {
          "type": "() => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "select": {
    "name": "select",
    "category": "inputs",
    "fileName": "Select",
    "description": "Select dropdown component with options, validation, and styling variants. Supports labels and helper text.",
    "tags": [
      "ui",
      "input",
      "form",
      "select",
      "dropdown"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "options": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "SelectOption[]"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "SelectOption[]"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string | number) => void"
      }
    },
    "interfaces": {
      "SelectOption": {
        "value": {
          "type": "string | number",
          "optional": false
        },
        "label": {
          "type": "string",
          "optional": false
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        }
      },
      "SelectProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string | number",
          "optional": true
        },
        "defaultValue": {
          "type": "string | number",
          "optional": true
        },
        "options": {
          "type": "SelectOption[]",
          "optional": true
        },
        "items": {
          "type": "SelectOption[]",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "onChange": {
          "type": "(value: string | number) => void",
          "optional": true
        }
      }
    }
  },
  "slider": {
    "name": "slider",
    "category": "inputs",
    "fileName": "Slider",
    "description": "Range slider component with customizable min/max values, steps, marks, and colors. Supports validation and real-time value display.",
    "tags": [
      "ui",
      "input",
      "form",
      "slider",
      "range"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "defaultValue": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "min": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "max": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "step": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showValue": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showMarks": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "marks": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<{ value: number; label: string; }>"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onChange": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(value: number) => void"
      },
      "onChangeCommitted": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(value: number) => void"
      }
    },
    "interfaces": {
      "SliderProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "number",
          "optional": true
        },
        "defaultValue": {
          "type": "number",
          "optional": true
        },
        "min": {
          "type": "number",
          "optional": true
        },
        "max": {
          "type": "number",
          "optional": true
        },
        "step": {
          "type": "number",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "showValue": {
          "type": "boolean",
          "optional": true
        },
        "showMarks": {
          "type": "boolean",
          "optional": true
        },
        "marks": {
          "type": "Array<{ value: number; label: string; }>",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "onChange": {
          "type": "(value: number) => void",
          "optional": true
        },
        "onChangeCommitted": {
          "type": "(value: number) => void",
          "optional": true
        }
      }
    }
  },
  "switch": {
    "name": "switch",
    "category": "inputs",
    "fileName": "Switch",
    "description": "Toggle switch component with customizable colors, sizes, and label positioning. Modern on/off control.",
    "tags": [
      "ui",
      "input",
      "form",
      "switch",
      "toggle"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "checked": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "defaultChecked": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "labelPosition": {
        "type": "'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'left' | 'right'"
      },
      "onChange": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "(checked: boolean) => void"
      }
    },
    "interfaces": {
      "SwitchProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "text": {
          "type": "string",
          "optional": true
        },
        "checked": {
          "type": "boolean",
          "optional": true
        },
        "defaultChecked": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "labelPosition": {
          "type": "'left' | 'right'",
          "optional": true
        },
        "onChange": {
          "type": "(checked: boolean) => void",
          "optional": true
        }
      }
    }
  },
  "tag-input": {
    "name": "tag-input",
    "category": "inputs",
    "fileName": "TagInput",
    "description": "Tag input component for adding and removing tags with keyboard support, validation, and max limits. Supports custom separators.",
    "tags": [
      "ui",
      "input",
      "form",
      "tags",
      "chips",
      "labels"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string[]"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string[]"
      },
      "tags": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string[]"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "maxTags": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "allowDuplicates": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "separator": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | RegExp"
      },
      "validateTag": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(tag: string) => boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(tags: string[]) => void"
      },
      "onAdd": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(tag: string) => void"
      },
      "onRemove": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(tag: string) => void"
      }
    },
    "interfaces": {
      "TagInputProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string[]",
          "optional": true
        },
        "defaultValue": {
          "type": "string[]",
          "optional": true
        },
        "tags": {
          "type": "string[]",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "maxTags": {
          "type": "number",
          "optional": true
        },
        "allowDuplicates": {
          "type": "boolean",
          "optional": true
        },
        "separator": {
          "type": "string | RegExp",
          "optional": true
        },
        "validateTag": {
          "type": "(tag: string) => boolean",
          "optional": true
        },
        "onChange": {
          "type": "(tags: string[]) => void",
          "optional": true
        },
        "onAdd": {
          "type": "(tag: string) => void",
          "optional": true
        },
        "onRemove": {
          "type": "(tag: string) => void",
          "optional": true
        }
      }
    }
  },
  "text-area": {
    "name": "text-area",
    "category": "inputs",
    "fileName": "TextArea",
    "description": "Multi-line text input component with auto-resize, character count, and validation. Supports various styles and sizes.",
    "tags": [
      "ui",
      "input",
      "form",
      "textarea",
      "multiline"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "rows": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "minRows": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "maxRows": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "readOnly": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "maxLength": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showCharCount": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "autoResize": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "TextAreaProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "rows": {
          "type": "number",
          "optional": true
        },
        "minRows": {
          "type": "number",
          "optional": true
        },
        "maxRows": {
          "type": "number",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "readOnly": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "maxLength": {
          "type": "number",
          "optional": true
        },
        "showCharCount": {
          "type": "boolean",
          "optional": true
        },
        "autoResize": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "text-field": {
    "name": "text-field",
    "category": "inputs",
    "fileName": "TextField",
    "description": "Text input field with support for labels, validation, prefixes, suffixes, and various styles. Supports multiple input types.",
    "tags": [
      "ui",
      "input",
      "form",
      "text",
      "field"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "placeholder": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "type": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "'text' | 'email' | 'password' | 'number' | 'url' | 'tel'"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "readOnly": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "prefix": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "suffix": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "icon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "TextFieldProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "placeholder": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "type": {
          "type": "'text' | 'email' | 'password' | 'number' | 'url' | 'tel'",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "readOnly": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "prefix": {
          "type": "string",
          "optional": true
        },
        "suffix": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "time-picker": {
    "name": "time-picker",
    "category": "inputs",
    "fileName": "TimePicker",
    "description": "Time picker component with clock icon, min/max time validation, and step support.",
    "tags": [
      "ui",
      "input",
      "form",
      "time",
      "clock"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "value": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "defaultValue": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "min": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "max": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "step": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "variant": {
        "type": "'outlined' | 'filled' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'outlined' | 'filled' | 'standard'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "required": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "error": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "helperText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "errorMessage": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "showClockIcon": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onChange": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "(value: string) => void"
      },
      "onBlur": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onFocus": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "TimePickerProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "optional": true
        },
        "min": {
          "type": "string",
          "optional": true
        },
        "max": {
          "type": "string",
          "optional": true
        },
        "step": {
          "type": "number",
          "optional": true
        },
        "variant": {
          "type": "'outlined' | 'filled' | 'standard'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "required": {
          "type": "boolean",
          "optional": true
        },
        "error": {
          "type": "boolean",
          "optional": true
        },
        "helperText": {
          "type": "string",
          "optional": true
        },
        "errorMessage": {
          "type": "string",
          "optional": true
        },
        "showClockIcon": {
          "type": "boolean",
          "optional": true
        },
        "onChange": {
          "type": "(value: string) => void",
          "optional": true
        },
        "onBlur": {
          "type": "() => void",
          "optional": true
        },
        "onFocus": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "accordion": {
    "name": "accordion",
    "category": "layout",
    "fileName": "Accordion",
    "description": "Expandable accordion component with customizable items, icons, and support for single or multiple expanded sections.",
    "tags": [
      "layout",
      "accordion",
      "expandable",
      "collapsible"
    ],
    "props": {
      "items": {
        "type": "array",
        "description": "Accordion items",
        "required": false,
        "tsType": "AccordionItem[]"
      },
      "multiple": {
        "type": "boolean",
        "description": "Allow multiple items to be expanded at once",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'bordered' | 'elevated'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'bordered' | 'elevated'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Size variant",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "AccordionItem": {
        "title": {
          "type": "string",
          "description": "Title of the accordion item",
          "optional": false
        },
        "content": {
          "type": "string",
          "description": "Content or children of the accordion item",
          "optional": true
        },
        "defaultExpanded": {
          "type": "boolean",
          "description": "Whether this item is initially expanded",
          "optional": true
        },
        "icon": {
          "type": "string",
          "description": "Icon to display (optional)",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Children components",
          "optional": true
        }
      },
      "AccordionProps": {
        "items": {
          "type": "AccordionItem[]",
          "description": "Accordion items",
          "optional": true
        },
        "multiple": {
          "type": "boolean",
          "description": "Allow multiple items to be expanded at once",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'bordered' | 'elevated'",
          "description": "Variant style",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Size variant",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "appbar": {
    "name": "appbar",
    "category": "layout",
    "fileName": "AppBar",
    "description": "Top application bar with title, subtitle, logo, and customizable action buttons.",
    "tags": [
      "layout",
      "navigation",
      "appbar",
      "header",
      "toolbar"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Title text",
        "required": false,
        "tsType": "string"
      },
      "subtitle": {
        "type": "string",
        "description": "Subtitle text",
        "required": false,
        "tsType": "string"
      },
      "logo": {
        "type": "string",
        "description": "Logo/icon",
        "required": false,
        "tsType": "string"
      },
      "actions": {
        "type": "array",
        "description": "Action buttons",
        "required": false,
        "tsType": "ActionButton[]"
      },
      "position": {
        "type": "'static' | 'fixed' | 'sticky'",
        "description": "Position",
        "required": false,
        "tsType": "'static' | 'fixed' | 'sticky'"
      },
      "variant": {
        "type": "'default' | 'elevated' | 'transparent'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'elevated' | 'transparent'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Size",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "ActionButton": {
        "label": {
          "type": "string",
          "description": "Label for the action",
          "optional": false
        },
        "icon": {
          "type": "string",
          "description": "Icon for the action",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "description": "Click handler",
          "optional": true
        }
      },
      "AppBarProps": {
        "title": {
          "type": "string",
          "description": "Title text",
          "optional": true
        },
        "subtitle": {
          "type": "string",
          "description": "Subtitle text",
          "optional": true
        },
        "logo": {
          "type": "string",
          "description": "Logo/icon",
          "optional": true
        },
        "actions": {
          "type": "ActionButton[]",
          "description": "Action buttons",
          "optional": true
        },
        "position": {
          "type": "'static' | 'fixed' | 'sticky'",
          "description": "Position",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'elevated' | 'transparent'",
          "description": "Variant style",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Size",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "bottom-navigation": {
    "name": "bottom-navigation",
    "category": "layout",
    "fileName": "BottomNavigation",
    "description": "Bottom navigation bar for mobile-friendly navigation with icons and optional labels.",
    "tags": [
      "layout",
      "navigation",
      "bottom-nav",
      "mobile",
      "footer"
    ],
    "props": {
      "items": {
        "type": "array",
        "description": "Navigation items",
        "required": false,
        "tsType": "NavigationItem[]"
      },
      "defaultValue": {
        "type": "string",
        "description": "Default selected value",
        "required": false,
        "tsType": "string"
      },
      "showLabels": {
        "type": "boolean",
        "description": "Show labels",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'elevated'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'elevated'"
      },
      "activeColor": {
        "type": "'primary' | 'accent' | 'secondary'",
        "description": "Color when active",
        "required": false,
        "tsType": "'primary' | 'accent' | 'secondary'"
      }
    },
    "interfaces": {
      "NavigationItem": {
        "label": {
          "type": "string",
          "description": "Label for the nav item",
          "optional": false
        },
        "icon": {
          "type": "string",
          "description": "Icon for the nav item",
          "optional": true
        },
        "value": {
          "type": "string",
          "description": "Value identifier",
          "optional": false
        },
        "badge": {
          "type": "number",
          "description": "Badge count",
          "optional": true
        }
      },
      "BottomNavigationProps": {
        "items": {
          "type": "NavigationItem[]",
          "description": "Navigation items",
          "optional": true
        },
        "defaultValue": {
          "type": "string",
          "description": "Default selected value",
          "optional": true
        },
        "showLabels": {
          "type": "boolean",
          "description": "Show labels",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'elevated'",
          "description": "Variant style",
          "optional": true
        },
        "activeColor": {
          "type": "'primary' | 'accent' | 'secondary'",
          "description": "Color when active",
          "optional": true
        }
      }
    }
  },
  "breadcrumbs": {
    "name": "breadcrumbs",
    "category": "layout",
    "fileName": "Breadcrumbs",
    "description": "Navigation breadcrumb trail showing the current location within a hierarchy, with customizable separators and collapse options.",
    "tags": [
      "navigation",
      "breadcrumbs",
      "layout",
      "hierarchy"
    ],
    "props": {
      "items": {
        "type": "array",
        "description": "Array of breadcrumb items",
        "required": false,
        "tsType": "BreadcrumbItem[]"
      },
      "separator": {
        "type": "'slash' | 'chevron' | 'arrow' | 'dot'",
        "description": "Separator between breadcrumbs",
        "required": false,
        "tsType": "'slash' | 'chevron' | 'arrow' | 'dot'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Size variant",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "maxItems": {
        "type": "number",
        "description": "Maximum items to show before collapsing",
        "required": false,
        "tsType": "number"
      },
      "showHome": {
        "type": "boolean",
        "description": "Show home icon",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "BreadcrumbItem": {
        "label": {
          "type": "string",
          "description": "Label for the breadcrumb",
          "optional": false
        },
        "href": {
          "type": "string",
          "description": "URL/path for the breadcrumb",
          "optional": true
        },
        "icon": {
          "type": "string",
          "description": "Icon for the breadcrumb",
          "optional": true
        }
      },
      "BreadcrumbsProps": {
        "items": {
          "type": "BreadcrumbItem[]",
          "description": "Array of breadcrumb items",
          "optional": true
        },
        "separator": {
          "type": "'slash' | 'chevron' | 'arrow' | 'dot'",
          "description": "Separator between breadcrumbs",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Size variant",
          "optional": true
        },
        "maxItems": {
          "type": "number",
          "description": "Maximum items to show before collapsing",
          "optional": true
        },
        "showHome": {
          "type": "boolean",
          "description": "Show home icon",
          "optional": true
        }
      }
    }
  },
  "container": {
    "name": "container",
    "category": "layout",
    "fileName": "Container",
    "description": "Centered container with configurable max-width, padding, and optional background/border/shadow styling.",
    "tags": [
      "layout",
      "container",
      "wrapper",
      "responsive"
    ],
    "props": {
      "maxWidth": {
        "type": "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'",
        "description": "Maximum width of the container",
        "required": false,
        "tsType": "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'"
      },
      "padding": {
        "type": "'none' | 'small' | 'medium' | 'large'",
        "description": "Padding inside the container",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large'"
      },
      "center": {
        "type": "boolean",
        "description": "Center the container horizontally",
        "required": false,
        "tsType": "boolean"
      },
      "background": {
        "type": "boolean",
        "description": "Add background",
        "required": false,
        "tsType": "boolean"
      },
      "border": {
        "type": "boolean",
        "description": "Add border",
        "required": false,
        "tsType": "boolean"
      },
      "shadow": {
        "type": "boolean",
        "description": "Add shadow",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "ContainerProps": {
        "maxWidth": {
          "type": "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'",
          "description": "Maximum width of the container",
          "optional": true
        },
        "padding": {
          "type": "'none' | 'small' | 'medium' | 'large'",
          "description": "Padding inside the container",
          "optional": true
        },
        "center": {
          "type": "boolean",
          "description": "Center the container horizontally",
          "optional": true
        },
        "background": {
          "type": "boolean",
          "description": "Add background",
          "optional": true
        },
        "border": {
          "type": "boolean",
          "description": "Add border",
          "optional": true
        },
        "shadow": {
          "type": "boolean",
          "description": "Add shadow",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "divider": {
    "name": "divider",
    "category": "layout",
    "fileName": "Divider",
    "description": "Visual separator with optional label, supporting horizontal and vertical orientations with customizable styles.",
    "tags": [
      "layout",
      "divider",
      "separator",
      "hr"
    ],
    "props": {
      "orientation": {
        "type": "'horizontal' | 'vertical'",
        "description": "Orientation of the divider",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      },
      "label": {
        "type": "string",
        "description": "Optional label text",
        "required": false,
        "tsType": "string"
      },
      "labelPosition": {
        "type": "'left' | 'center' | 'right'",
        "description": "Label position",
        "required": false,
        "tsType": "'left' | 'center' | 'right'"
      },
      "variant": {
        "type": "'solid' | 'dashed' | 'dotted'",
        "description": "Variant style",
        "required": false,
        "tsType": "'solid' | 'dashed' | 'dotted'"
      },
      "thickness": {
        "type": "'thin' | 'medium' | 'thick'",
        "description": "Thickness",
        "required": false,
        "tsType": "'thin' | 'medium' | 'thick'"
      },
      "spacing": {
        "type": "'none' | 'small' | 'medium' | 'large'",
        "description": "Spacing around the divider",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large'"
      },
      "color": {
        "type": "'default' | 'primary' | 'secondary'",
        "description": "Color variant",
        "required": false,
        "tsType": "'default' | 'primary' | 'secondary'"
      }
    },
    "interfaces": {
      "DividerProps": {
        "orientation": {
          "type": "'horizontal' | 'vertical'",
          "description": "Orientation of the divider",
          "optional": true
        },
        "label": {
          "type": "string",
          "description": "Optional label text",
          "optional": true
        },
        "labelPosition": {
          "type": "'left' | 'center' | 'right'",
          "description": "Label position",
          "optional": true
        },
        "variant": {
          "type": "'solid' | 'dashed' | 'dotted'",
          "description": "Variant style",
          "optional": true
        },
        "thickness": {
          "type": "'thin' | 'medium' | 'thick'",
          "description": "Thickness",
          "optional": true
        },
        "spacing": {
          "type": "'none' | 'small' | 'medium' | 'large'",
          "description": "Spacing around the divider",
          "optional": true
        },
        "color": {
          "type": "'default' | 'primary' | 'secondary'",
          "description": "Color variant",
          "optional": true
        }
      }
    }
  },
  "drawer": {
    "name": "drawer",
    "category": "layout",
    "fileName": "Drawer",
    "description": "Side drawer/panel that slides in from any edge, with customizable size and optional backdrop.",
    "tags": [
      "layout",
      "navigation",
      "drawer",
      "panel",
      "sidebar"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Title of the drawer",
        "required": false,
        "tsType": "string"
      },
      "position": {
        "type": "'left' | 'right' | 'top' | 'bottom'",
        "description": "Position of the drawer",
        "required": false,
        "tsType": "'left' | 'right' | 'top' | 'bottom'"
      },
      "defaultOpen": {
        "type": "boolean",
        "description": "Default open state",
        "required": false,
        "tsType": "boolean"
      },
      "size": {
        "type": "'small' | 'medium' | 'large' | 'full'",
        "description": "Width (for left/right) or height (for top/bottom)",
        "required": false,
        "tsType": "'small' | 'medium' | 'large' | 'full'"
      },
      "variant": {
        "type": "'default' | 'elevated' | 'overlay'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'elevated' | 'overlay'"
      },
      "backdrop": {
        "type": "boolean",
        "description": "Show backdrop",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "DrawerProps": {
        "title": {
          "type": "string",
          "description": "Title of the drawer",
          "optional": true
        },
        "position": {
          "type": "'left' | 'right' | 'top' | 'bottom'",
          "description": "Position of the drawer",
          "optional": true
        },
        "defaultOpen": {
          "type": "boolean",
          "description": "Default open state",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large' | 'full'",
          "description": "Width (for left/right) or height (for top/bottom)",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'elevated' | 'overlay'",
          "description": "Variant style",
          "optional": true
        },
        "backdrop": {
          "type": "boolean",
          "description": "Show backdrop",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "flexbox": {
    "name": "flexbox",
    "category": "layout",
    "fileName": "Flexbox",
    "description": "Flexible box layout with full control over direction, justify, align, gap, and wrap properties.",
    "tags": [
      "layout",
      "flex",
      "flexbox",
      "responsive"
    ],
    "props": {
      "direction": {
        "type": "'row' | 'row-reverse' | 'column' | 'column-reverse'",
        "description": "Flex direction",
        "required": false,
        "tsType": "'row' | 'row-reverse' | 'column' | 'column-reverse'"
      },
      "justify": {
        "type": "'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'",
        "description": "Justify content",
        "required": false,
        "tsType": "'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'"
      },
      "align": {
        "type": "'start' | 'end' | 'center' | 'baseline' | 'stretch'",
        "description": "Align items",
        "required": false,
        "tsType": "'start' | 'end' | 'center' | 'baseline' | 'stretch'"
      },
      "gap": {
        "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
        "description": "Gap between items",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large' | 'xlarge'"
      },
      "wrap": {
        "type": "'nowrap' | 'wrap' | 'wrap-reverse'",
        "description": "Wrap items",
        "required": false,
        "tsType": "'nowrap' | 'wrap' | 'wrap-reverse'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "Full width",
        "required": false,
        "tsType": "boolean"
      },
      "fullHeight": {
        "type": "boolean",
        "description": "Full height",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "FlexboxProps": {
        "direction": {
          "type": "'row' | 'row-reverse' | 'column' | 'column-reverse'",
          "description": "Flex direction",
          "optional": true
        },
        "justify": {
          "type": "'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'",
          "description": "Justify content",
          "optional": true
        },
        "align": {
          "type": "'start' | 'end' | 'center' | 'baseline' | 'stretch'",
          "description": "Align items",
          "optional": true
        },
        "gap": {
          "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
          "description": "Gap between items",
          "optional": true
        },
        "wrap": {
          "type": "'nowrap' | 'wrap' | 'wrap-reverse'",
          "description": "Wrap items",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "description": "Full width",
          "optional": true
        },
        "fullHeight": {
          "type": "boolean",
          "description": "Full height",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "grid": {
    "name": "grid",
    "category": "layout",
    "fileName": "Grid",
    "description": "Responsive grid system with configurable columns, gap, and alignment. Supports auto-fit for dynamic column sizing.",
    "tags": [
      "layout",
      "grid",
      "responsive",
      "container"
    ],
    "props": {
      "columns": {
        "type": "1 | 2 | 3 | 4 | 5 | 6 | 12",
        "description": "Number of columns in the grid",
        "required": false,
        "tsType": "1 | 2 | 3 | 4 | 5 | 6 | 12"
      },
      "gap": {
        "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
        "description": "Gap between grid items",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large' | 'xlarge'"
      },
      "responsive": {
        "type": "boolean",
        "description": "Responsive behavior",
        "required": false,
        "tsType": "boolean"
      },
      "alignItems": {
        "type": "'start' | 'center' | 'end' | 'stretch'",
        "description": "Alignment of items",
        "required": false,
        "tsType": "'start' | 'center' | 'end' | 'stretch'"
      },
      "justifyItems": {
        "type": "'start' | 'center' | 'end' | 'stretch'",
        "description": "Justify content",
        "required": false,
        "tsType": "'start' | 'center' | 'end' | 'stretch'"
      },
      "autoFit": {
        "type": "boolean",
        "description": "Auto-fit columns (responsive)",
        "required": false,
        "tsType": "boolean"
      },
      "minColumnWidth": {
        "type": "string",
        "description": "Minimum column width for auto-fit",
        "required": false,
        "tsType": "string"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "GridProps": {
        "columns": {
          "type": "1 | 2 | 3 | 4 | 5 | 6 | 12",
          "description": "Number of columns in the grid",
          "optional": true
        },
        "gap": {
          "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
          "description": "Gap between grid items",
          "optional": true
        },
        "responsive": {
          "type": "boolean",
          "description": "Responsive behavior",
          "optional": true
        },
        "alignItems": {
          "type": "'start' | 'center' | 'end' | 'stretch'",
          "description": "Alignment of items",
          "optional": true
        },
        "justifyItems": {
          "type": "'start' | 'center' | 'end' | 'stretch'",
          "description": "Justify content",
          "optional": true
        },
        "autoFit": {
          "type": "boolean",
          "description": "Auto-fit columns (responsive)",
          "optional": true
        },
        "minColumnWidth": {
          "type": "string",
          "description": "Minimum column width for auto-fit",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "masonry": {
    "name": "masonry",
    "category": "layout",
    "fileName": "Masonry",
    "description": "Masonry grid layout that distributes items across columns with dynamic heights, perfect for image galleries and card layouts.",
    "tags": [
      "layout",
      "masonry",
      "grid",
      "gallery",
      "responsive"
    ],
    "props": {
      "columns": {
        "type": "2 | 3 | 4 | 5 | 6",
        "description": "Number of columns",
        "required": false,
        "tsType": "2 | 3 | 4 | 5 | 6"
      },
      "gap": {
        "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
        "description": "Gap between items",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large' | 'xlarge'"
      },
      "responsive": {
        "type": "boolean",
        "description": "Responsive behavior",
        "required": false,
        "tsType": "boolean"
      },
      "breakAt": {
        "type": "number",
        "description": "Breakpoint configuration for responsive columns",
        "required": false,
        "tsType": "{ default?: number; sm?: number; md?: number; lg?: number; xl?: number; }"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "MasonryProps": {
        "columns": {
          "type": "2 | 3 | 4 | 5 | 6",
          "description": "Number of columns",
          "optional": true
        },
        "gap": {
          "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
          "description": "Gap between items",
          "optional": true
        },
        "responsive": {
          "type": "boolean",
          "description": "Responsive behavior",
          "optional": true
        },
        "breakAt": {
          "type": "{ default?: number; sm?: number; md?: number; lg?: number; xl?: number; }",
          "description": "Breakpoint configuration for responsive columns",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "section": {
    "name": "section",
    "category": "layout",
    "fileName": "Section",
    "description": "Content section with optional header, title, subtitle, and customizable styling for organizing page content.",
    "tags": [
      "layout",
      "section",
      "container",
      "content"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Section title",
        "required": false,
        "tsType": "string"
      },
      "subtitle": {
        "type": "string",
        "description": "Section subtitle",
        "required": false,
        "tsType": "string"
      },
      "icon": {
        "type": "string",
        "description": "Section header icon",
        "required": false,
        "tsType": "string"
      },
      "padding": {
        "type": "'none' | 'small' | 'medium' | 'large'",
        "description": "Padding inside the section",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large'"
      },
      "variant": {
        "type": "'default' | 'bordered' | 'elevated' | 'filled'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'bordered' | 'elevated' | 'filled'"
      },
      "background": {
        "type": "'default' | 'surface' | 'elevated' | 'accent'",
        "description": "Background color",
        "required": false,
        "tsType": "'default' | 'surface' | 'elevated' | 'accent'"
      },
      "divider": {
        "type": "boolean",
        "description": "Show divider after header",
        "required": false,
        "tsType": "boolean"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "Full width section",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "SectionProps": {
        "title": {
          "type": "string",
          "description": "Section title",
          "optional": true
        },
        "subtitle": {
          "type": "string",
          "description": "Section subtitle",
          "optional": true
        },
        "icon": {
          "type": "string",
          "description": "Section header icon",
          "optional": true
        },
        "padding": {
          "type": "'none' | 'small' | 'medium' | 'large'",
          "description": "Padding inside the section",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'bordered' | 'elevated' | 'filled'",
          "description": "Variant style",
          "optional": true
        },
        "background": {
          "type": "'default' | 'surface' | 'elevated' | 'accent'",
          "description": "Background color",
          "optional": true
        },
        "divider": {
          "type": "boolean",
          "description": "Show divider after header",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "description": "Full width section",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "sidebar": {
    "name": "sidebar",
    "category": "layout",
    "fileName": "Sidebar",
    "description": "Sidebar navigation with nested items, badges, icons, and collapsible functionality.",
    "tags": [
      "layout",
      "navigation",
      "sidebar",
      "menu",
      "nav"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Title of the sidebar",
        "required": false,
        "tsType": "string"
      },
      "logo": {
        "type": "string",
        "description": "Logo/icon",
        "required": false,
        "tsType": "string"
      },
      "items": {
        "type": "array",
        "description": "Navigation items",
        "required": false,
        "tsType": "NavItem[]"
      },
      "width": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Width",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "collapsible": {
        "type": "boolean",
        "description": "Collapsible sidebar",
        "required": false,
        "tsType": "boolean"
      },
      "defaultCollapsed": {
        "type": "boolean",
        "description": "Default collapsed state",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'elevated' | 'bordered'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'elevated' | 'bordered'"
      },
      "position": {
        "type": "'fixed' | 'sticky' | 'static'",
        "description": "Position",
        "required": false,
        "tsType": "'fixed' | 'sticky' | 'static'"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "NavItem": {
        "label": {
          "type": "string",
          "description": "Label for the nav item",
          "optional": false
        },
        "icon": {
          "type": "string",
          "description": "Icon for the nav item",
          "optional": true
        },
        "href": {
          "type": "string",
          "description": "URL/path",
          "optional": true
        },
        "active": {
          "type": "boolean",
          "description": "Active state",
          "optional": true
        },
        "badge": {
          "type": "number",
          "description": "Badge count",
          "optional": true
        },
        "children": {
          "type": "NavItem[]",
          "description": "Nested items",
          "optional": true
        }
      },
      "SidebarProps": {
        "title": {
          "type": "string",
          "description": "Title of the sidebar",
          "optional": true
        },
        "logo": {
          "type": "string",
          "description": "Logo/icon",
          "optional": true
        },
        "items": {
          "type": "NavItem[]",
          "description": "Navigation items",
          "optional": true
        },
        "width": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Width",
          "optional": true
        },
        "collapsible": {
          "type": "boolean",
          "description": "Collapsible sidebar",
          "optional": true
        },
        "defaultCollapsed": {
          "type": "boolean",
          "description": "Default collapsed state",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'elevated' | 'bordered'",
          "description": "Variant style",
          "optional": true
        },
        "position": {
          "type": "'fixed' | 'sticky' | 'static'",
          "description": "Position",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "spacer": {
    "name": "spacer",
    "category": "layout",
    "fileName": "Spacer",
    "description": "Flexible spacing component for adding vertical or horizontal space between elements, with optional visual indicators.",
    "tags": [
      "layout",
      "spacer",
      "spacing",
      "margin",
      "padding"
    ],
    "props": {
      "size": {
        "type": "'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'custom'",
        "description": "Size of the spacer",
        "required": false,
        "tsType": "'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'custom'"
      },
      "customSize": {
        "type": "number",
        "description": "Custom size in pixels (when size is 'custom')",
        "required": false,
        "tsType": "number"
      },
      "orientation": {
        "type": "'horizontal' | 'vertical'",
        "description": "Orientation",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      },
      "flexible": {
        "type": "boolean",
        "description": "Flexible spacer (grows to fill available space)",
        "required": false,
        "tsType": "boolean"
      },
      "showIndicator": {
        "type": "boolean",
        "description": "Show visual indicator (for debugging/demo)",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "SpacerProps": {
        "size": {
          "type": "'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'custom'",
          "description": "Size of the spacer",
          "optional": true
        },
        "customSize": {
          "type": "number",
          "description": "Custom size in pixels (when size is 'custom')",
          "optional": true
        },
        "orientation": {
          "type": "'horizontal' | 'vertical'",
          "description": "Orientation",
          "optional": true
        },
        "flexible": {
          "type": "boolean",
          "description": "Flexible spacer (grows to fill available space)",
          "optional": true
        },
        "showIndicator": {
          "type": "boolean",
          "description": "Show visual indicator (for debugging/demo)",
          "optional": true
        }
      }
    }
  },
  "stack": {
    "name": "stack",
    "category": "layout",
    "fileName": "Stack",
    "description": "Vertical or horizontal stacking layout with configurable spacing, alignment, and optional dividers between items.",
    "tags": [
      "layout",
      "stack",
      "flex",
      "container"
    ],
    "props": {
      "direction": {
        "type": "'vertical' | 'horizontal'",
        "description": "Stack direction",
        "required": false,
        "tsType": "'vertical' | 'horizontal'"
      },
      "spacing": {
        "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
        "description": "Spacing between items",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large' | 'xlarge'"
      },
      "align": {
        "type": "'start' | 'center' | 'end' | 'stretch'",
        "description": "Alignment of items along the cross axis",
        "required": false,
        "tsType": "'start' | 'center' | 'end' | 'stretch'"
      },
      "justify": {
        "type": "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
        "description": "Justification of items along the main axis",
        "required": false,
        "tsType": "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'"
      },
      "wrap": {
        "type": "boolean",
        "description": "Wrap items to next line",
        "required": false,
        "tsType": "boolean"
      },
      "divider": {
        "type": "boolean",
        "description": "Divider between items",
        "required": false,
        "tsType": "boolean"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "Full width",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "array",
        "description": "Child components",
        "required": false,
        "tsType": "ComponentSpec[]"
      },
      "renderChild": {
        "type": "function",
        "description": "Function to render child components",
        "required": false,
        "tsType": "(child: ComponentSpec) => React.ReactNode"
      }
    },
    "interfaces": {
      "StackProps": {
        "direction": {
          "type": "'vertical' | 'horizontal'",
          "description": "Stack direction",
          "optional": true
        },
        "spacing": {
          "type": "'none' | 'small' | 'medium' | 'large' | 'xlarge'",
          "description": "Spacing between items",
          "optional": true
        },
        "align": {
          "type": "'start' | 'center' | 'end' | 'stretch'",
          "description": "Alignment of items along the cross axis",
          "optional": true
        },
        "justify": {
          "type": "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          "description": "Justification of items along the main axis",
          "optional": true
        },
        "wrap": {
          "type": "boolean",
          "description": "Wrap items to next line",
          "optional": true
        },
        "divider": {
          "type": "boolean",
          "description": "Divider between items",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "description": "Full width",
          "optional": true
        },
        "children": {
          "type": "ComponentSpec[]",
          "description": "Child components",
          "optional": true
        },
        "renderChild": {
          "type": "(child: ComponentSpec) => React.ReactNode",
          "description": "Function to render child components",
          "optional": true
        }
      }
    }
  },
  "stepper": {
    "name": "stepper",
    "category": "layout",
    "fileName": "Stepper",
    "description": "Step-by-step progress indicator showing workflow stages, supporting both horizontal and vertical orientations.",
    "tags": [
      "layout",
      "stepper",
      "progress",
      "wizard",
      "navigation"
    ],
    "props": {
      "steps": {
        "type": "array",
        "description": "Array of steps",
        "required": false,
        "tsType": "Step[]"
      },
      "activeStep": {
        "type": "number",
        "description": "Current active step index",
        "required": false,
        "tsType": "number"
      },
      "orientation": {
        "type": "'horizontal' | 'vertical'",
        "description": "Orientation",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      },
      "showNumbers": {
        "type": "boolean",
        "description": "Show step numbers",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'outlined' | 'simple'",
        "description": "Variant style",
        "required": false,
        "tsType": "'default' | 'outlined' | 'simple'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Size",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      }
    },
    "interfaces": {
      "Step": {
        "label": {
          "type": "string",
          "description": "Label for the step",
          "optional": false
        },
        "description": {
          "type": "string",
          "description": "Description for the step",
          "optional": true
        },
        "icon": {
          "type": "string",
          "description": "Icon for the step",
          "optional": true
        },
        "status": {
          "type": "'pending' | 'active' | 'completed' | 'error'",
          "description": "Step status",
          "optional": true
        }
      },
      "StepperProps": {
        "steps": {
          "type": "Step[]",
          "description": "Array of steps",
          "optional": true
        },
        "activeStep": {
          "type": "number",
          "description": "Current active step index",
          "optional": true
        },
        "orientation": {
          "type": "'horizontal' | 'vertical'",
          "description": "Orientation",
          "optional": true
        },
        "showNumbers": {
          "type": "boolean",
          "description": "Show step numbers",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'outlined' | 'simple'",
          "description": "Variant style",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Size",
          "optional": true
        }
      }
    }
  },
  "button": {
    "name": "button",
    "category": "navigation",
    "fileName": "Button",
    "description": "Interactive button component with multiple variants and sizes",
    "tags": [
      "ui",
      "interactive",
      "navigation"
    ],
    "props": {
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "disabled": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "icon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "iconPosition": {
        "type": "'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'left' | 'right'"
      },
      "fullWidth": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "ButtonProps": {
        "label": {
          "type": "string",
          "optional": true
        },
        "text": {
          "type": "string",
          "optional": true
        },
        "variant": {
          "type": "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "iconPosition": {
          "type": "'left' | 'right'",
          "optional": true
        },
        "fullWidth": {
          "type": "boolean",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "menu": {
    "name": "menu",
    "category": "navigation",
    "fileName": "Menu",
    "description": "Menu component with dropdown support. Use trigger prop for dropdown menus. Supports icons, dividers, danger variants, and multiple positions.",
    "tags": [
      "ui",
      "navigation",
      "interactive",
      "dropdown",
      "menu",
      "actions"
    ],
    "props": {
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "MenuItem[]"
      },
      "menuItems": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "MenuItem[]"
      },
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "trigger": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "triggerVariant": {
        "type": "'primary' | 'secondary' | 'ghost'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'ghost'"
      },
      "position": {
        "type": "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'",
        "description": "",
        "required": false,
        "tsType": "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'"
      },
      "closeOnSelect": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'compact' | 'bordered'",
        "description": "",
        "required": false,
        "tsType": "'default' | 'compact' | 'bordered'"
      }
    },
    "interfaces": {
      "MenuItem": {
        "label": {
          "type": "string",
          "optional": false
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        },
        "divider": {
          "type": "boolean",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'danger'",
          "optional": true
        }
      },
      "MenuProps": {
        "items": {
          "type": "MenuItem[]",
          "optional": true
        },
        "menuItems": {
          "type": "MenuItem[]",
          "optional": true
        },
        "title": {
          "type": "string",
          "optional": true
        },
        "trigger": {
          "type": "string",
          "optional": true
        },
        "triggerVariant": {
          "type": "'primary' | 'secondary' | 'ghost'",
          "optional": true
        },
        "position": {
          "type": "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'",
          "optional": true
        },
        "closeOnSelect": {
          "type": "boolean",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'compact' | 'bordered'",
          "optional": true
        }
      }
    }
  },
  "pagination": {
    "name": "pagination",
    "category": "navigation",
    "fileName": "Pagination",
    "description": "Page pagination component with customizable controls and variants",
    "tags": [
      "ui",
      "navigation",
      "interactive"
    ],
    "props": {
      "totalPages": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "pageCount": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "currentPage": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "defaultPage": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showFirstLast": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showPrevNext": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "siblingCount": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "variant": {
        "type": "'default' | 'outlined' | 'rounded'",
        "description": "",
        "required": false,
        "tsType": "'default' | 'outlined' | 'rounded'"
      },
      "onChange": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(page: number) => void"
      }
    },
    "interfaces": {
      "PaginationProps": {
        "totalPages": {
          "type": "number",
          "optional": true
        },
        "pageCount": {
          "type": "number",
          "optional": true
        },
        "currentPage": {
          "type": "number",
          "optional": true
        },
        "defaultPage": {
          "type": "number",
          "optional": true
        },
        "showFirstLast": {
          "type": "boolean",
          "optional": true
        },
        "showPrevNext": {
          "type": "boolean",
          "optional": true
        },
        "siblingCount": {
          "type": "number",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'outlined' | 'rounded'",
          "optional": true
        },
        "onChange": {
          "type": "(page: number) => void",
          "optional": true
        }
      }
    }
  },
  "tabs": {
    "name": "tabs",
    "category": "navigation",
    "fileName": "Tabs",
    "description": "Tabbed navigation component with multiple variants and orientation support",
    "tags": [
      "ui",
      "navigation",
      "interactive"
    ],
    "props": {
      "tabs": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "Tab[]"
      },
      "items": {
        "type": "array",
        "description": "",
        "required": false,
        "tsType": "Tab[]"
      },
      "defaultTab": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "variant": {
        "type": "'default' | 'pills' | 'underline'",
        "description": "",
        "required": false,
        "tsType": "'default' | 'pills' | 'underline'"
      },
      "orientation": {
        "type": "'horizontal' | 'vertical'",
        "description": "",
        "required": false,
        "tsType": "'horizontal' | 'vertical'"
      }
    },
    "interfaces": {
      "Tab": {
        "label": {
          "type": "string",
          "optional": false
        },
        "value": {
          "type": "string",
          "optional": true
        },
        "content": {
          "type": "string",
          "optional": true
        },
        "disabled": {
          "type": "boolean",
          "optional": true
        }
      },
      "TabsProps": {
        "tabs": {
          "type": "Tab[]",
          "optional": true
        },
        "items": {
          "type": "Tab[]",
          "optional": true
        },
        "defaultTab": {
          "type": "string | number",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'pills' | 'underline'",
          "optional": true
        },
        "orientation": {
          "type": "'horizontal' | 'vertical'",
          "optional": true
        }
      }
    }
  },
  "alert": {
    "name": "alert",
    "category": "feedback",
    "fileName": "Alert",
    "description": "Alert message component with multiple severity levels and variants",
    "tags": [
      "ui",
      "feedback",
      "notification"
    ],
    "props": {
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "severity": {
        "type": "'info' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'info' | 'success' | 'warning' | 'error'"
      },
      "variant": {
        "type": "'filled' | 'outlined' | 'standard'",
        "description": "",
        "required": false,
        "tsType": "'filled' | 'outlined' | 'standard'"
      },
      "icon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "closable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onClose": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "AlertProps": {
        "message": {
          "type": "string",
          "optional": true
        },
        "title": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "severity": {
          "type": "'info' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "variant": {
          "type": "'filled' | 'outlined' | 'standard'",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "closable": {
          "type": "boolean",
          "optional": true
        },
        "onClose": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "backdrop": {
    "name": "backdrop",
    "category": "feedback",
    "fileName": "Backdrop",
    "description": "Backdrop overlay component for modals and dialogs. Provides a darkened, optionally blurred background layer with customizable opacity.",
    "tags": [
      "ui",
      "feedback",
      "backdrop",
      "overlay",
      "modal",
      "background"
    ],
    "props": {
      "open": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "isOpen": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "visible": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "opacity": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "blur": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "blurAmount": {
        "type": "'none' | 'sm' | 'md' | 'lg' | 'xl'",
        "description": "",
        "required": false,
        "tsType": "'none' | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "onClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onClose": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "",
        "required": false,
        "tsType": "React.ReactNode"
      },
      "content": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "BackdropProps": {
        "open": {
          "type": "boolean",
          "optional": true
        },
        "isOpen": {
          "type": "boolean",
          "optional": true
        },
        "visible": {
          "type": "boolean",
          "optional": true
        },
        "opacity": {
          "type": "number",
          "optional": true
        },
        "blur": {
          "type": "boolean",
          "optional": true
        },
        "blurAmount": {
          "type": "'none' | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        },
        "onClose": {
          "type": "() => void",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "optional": true
        },
        "content": {
          "type": "string",
          "optional": true
        },
        "message": {
          "type": "string",
          "optional": true
        }
      }
    }
  },
  "circular-progress": {
    "name": "circular-progress",
    "category": "feedback",
    "fileName": "CircularProgress",
    "description": "Circular progress indicator with customizable size, color, and value display. Supports determinate and indeterminate modes.",
    "tags": [
      "ui",
      "feedback",
      "progress",
      "loading",
      "spinner",
      "circular"
    ],
    "props": {
      "value": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "percentage": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "progress": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "variant": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "thickness": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showValue": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "indeterminate": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "CircularProgressProps": {
        "value": {
          "type": "number",
          "optional": true
        },
        "percentage": {
          "type": "number",
          "optional": true
        },
        "progress": {
          "type": "number",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "variant": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "thickness": {
          "type": "number",
          "optional": true
        },
        "showValue": {
          "type": "boolean",
          "optional": true
        },
        "label": {
          "type": "string",
          "optional": true
        },
        "indeterminate": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "linear-progress": {
    "name": "linear-progress",
    "category": "feedback",
    "fileName": "LinearProgress",
    "description": "Linear progress bar with customizable colors, sizes, and animations. Supports determinate, indeterminate, striped, and animated variants.",
    "tags": [
      "ui",
      "feedback",
      "progress",
      "loading",
      "bar",
      "linear"
    ],
    "props": {
      "value": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "percentage": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "progress": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "max": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "variant": {
        "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'success' | 'warning' | 'error'"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "showValue": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "indeterminate": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "striped": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "animated": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "LinearProgressProps": {
        "value": {
          "type": "number",
          "optional": true
        },
        "percentage": {
          "type": "number",
          "optional": true
        },
        "progress": {
          "type": "number",
          "optional": true
        },
        "max": {
          "type": "number",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "variant": {
          "type": "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "optional": true
        },
        "showValue": {
          "type": "boolean",
          "optional": true
        },
        "label": {
          "type": "string",
          "optional": true
        },
        "indeterminate": {
          "type": "boolean",
          "optional": true
        },
        "striped": {
          "type": "boolean",
          "optional": true
        },
        "animated": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "modal": {
    "name": "modal",
    "category": "feedback",
    "fileName": "Modal",
    "description": "Modal dialog component with customizable size, header, content, and actions. Includes backdrop and close functionality.",
    "tags": [
      "ui",
      "feedback",
      "dialog",
      "overlay",
      "popup"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "open": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "isOpen": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "visible": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "size": {
        "type": "'small' | 'medium' | 'large' | 'fullscreen'",
        "description": "",
        "required": false,
        "tsType": "'small' | 'medium' | 'large' | 'fullscreen'"
      },
      "showCloseButton": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "closable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onClose": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "footer": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "actions": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "Array<{ label: string; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger'; }>"
      }
    },
    "interfaces": {
      "ModalProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "content": {
          "type": "string",
          "optional": true
        },
        "message": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "open": {
          "type": "boolean",
          "optional": true
        },
        "isOpen": {
          "type": "boolean",
          "optional": true
        },
        "visible": {
          "type": "boolean",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large' | 'fullscreen'",
          "optional": true
        },
        "showCloseButton": {
          "type": "boolean",
          "optional": true
        },
        "closable": {
          "type": "boolean",
          "optional": true
        },
        "onClose": {
          "type": "() => void",
          "optional": true
        },
        "footer": {
          "type": "string",
          "optional": true
        },
        "actions": {
          "type": "Array<{ label: string; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger'; }>",
          "optional": true
        }
      }
    }
  },
  "notification": {
    "name": "notification",
    "category": "feedback",
    "fileName": "Notification",
    "description": "Notification alert component for displaying rich notifications with title, message, icon, and optional actions.",
    "tags": [
      "ui",
      "feedback",
      "notification",
      "alert",
      "message",
      "toast"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "type": {
        "type": "'info' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'info' | 'success' | 'warning' | 'error'"
      },
      "severity": {
        "type": "'info' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'info' | 'success' | 'warning' | 'error'"
      },
      "icon": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "position": {
        "type": "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        "description": "",
        "required": false,
        "tsType": "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'"
      },
      "duration": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "autoHide": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "closable": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "onClose": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "action": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "{ label: string; onClick?: () => void; }"
      }
    },
    "interfaces": {
      "NotificationProps": {
        "title": {
          "type": "string",
          "optional": true
        },
        "message": {
          "type": "string",
          "optional": true
        },
        "text": {
          "type": "string",
          "optional": true
        },
        "content": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "type": {
          "type": "'info' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "severity": {
          "type": "'info' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "icon": {
          "type": "string",
          "optional": true
        },
        "position": {
          "type": "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
          "optional": true
        },
        "duration": {
          "type": "number",
          "optional": true
        },
        "autoHide": {
          "type": "boolean",
          "optional": true
        },
        "closable": {
          "type": "boolean",
          "optional": true
        },
        "onClose": {
          "type": "() => void",
          "optional": true
        },
        "action": {
          "type": "{ label: string; onClick?: () => void; }",
          "optional": true
        }
      }
    }
  },
  "popover": {
    "name": "popover",
    "category": "feedback",
    "fileName": "Popover",
    "description": "Popover component for displaying rich contextual content on click. Attach to any element via label/trigger prop. Supports titles, positioning, and arrows.",
    "tags": [
      "ui",
      "feedback",
      "popover",
      "menu",
      "dropdown",
      "overlay",
      "help"
    ],
    "props": {
      "content": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "trigger": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "position": {
        "type": "'top' | 'bottom' | 'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'top' | 'bottom' | 'left' | 'right'"
      },
      "placement": {
        "type": "'top' | 'bottom' | 'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'top' | 'bottom' | 'left' | 'right'"
      },
      "arrow": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "closeOnClick": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "PopoverProps": {
        "content": {
          "type": "string",
          "optional": true
        },
        "text": {
          "type": "string",
          "optional": true
        },
        "message": {
          "type": "string",
          "optional": true
        },
        "title": {
          "type": "string",
          "optional": true
        },
        "trigger": {
          "type": "string",
          "optional": true
        },
        "label": {
          "type": "string",
          "optional": true
        },
        "position": {
          "type": "'top' | 'bottom' | 'left' | 'right'",
          "optional": true
        },
        "placement": {
          "type": "'top' | 'bottom' | 'left' | 'right'",
          "optional": true
        },
        "arrow": {
          "type": "boolean",
          "optional": true
        },
        "closeOnClick": {
          "type": "boolean",
          "optional": true
        }
      }
    }
  },
  "skeleton": {
    "name": "skeleton",
    "category": "feedback",
    "fileName": "Skeleton",
    "description": "Loading skeleton component for content placeholders. Supports text, circular, rectangular, and rounded variants with pulse and wave animations.",
    "tags": [
      "ui",
      "feedback",
      "loading",
      "skeleton",
      "placeholder",
      "shimmer"
    ],
    "props": {
      "variant": {
        "type": "'text' | 'circular' | 'rectangular' | 'rounded'",
        "description": "",
        "required": false,
        "tsType": "'text' | 'circular' | 'rectangular' | 'rounded'"
      },
      "type": {
        "type": "'text' | 'circular' | 'rectangular' | 'rounded'",
        "description": "",
        "required": false,
        "tsType": "'text' | 'circular' | 'rectangular' | 'rounded'"
      },
      "width": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "height": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string | number"
      },
      "count": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "lines": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "animation": {
        "type": "'pulse' | 'wave' | 'none'",
        "description": "",
        "required": false,
        "tsType": "'pulse' | 'wave' | 'none'"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "SkeletonProps": {
        "variant": {
          "type": "'text' | 'circular' | 'rectangular' | 'rounded'",
          "optional": true
        },
        "type": {
          "type": "'text' | 'circular' | 'rectangular' | 'rounded'",
          "optional": true
        },
        "width": {
          "type": "string | number",
          "optional": true
        },
        "height": {
          "type": "string | number",
          "optional": true
        },
        "count": {
          "type": "number",
          "optional": true
        },
        "lines": {
          "type": "number",
          "optional": true
        },
        "animation": {
          "type": "'pulse' | 'wave' | 'none'",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        }
      }
    }
  },
  "tooltip": {
    "name": "tooltip",
    "category": "feedback",
    "fileName": "Tooltip",
    "description": "Tooltip component that displays contextual information on hover. Attach to any element via label prop. Supports multiple positions, variants, and optional arrows.",
    "tags": [
      "ui",
      "feedback",
      "tooltip",
      "hint",
      "popover",
      "help"
    ],
    "props": {
      "text": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "message": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "label": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "buttonText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "triggerText": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "children": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "position": {
        "type": "'top' | 'bottom' | 'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'top' | 'bottom' | 'left' | 'right'"
      },
      "placement": {
        "type": "'top' | 'bottom' | 'left' | 'right'",
        "description": "",
        "required": false,
        "tsType": "'top' | 'bottom' | 'left' | 'right'"
      },
      "variant": {
        "type": "'dark' | 'light' | 'info' | 'success' | 'warning' | 'error'",
        "description": "",
        "required": false,
        "tsType": "'dark' | 'light' | 'info' | 'success' | 'warning' | 'error'"
      },
      "arrow": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "delay": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "TooltipProps": {
        "text": {
          "type": "string",
          "optional": true
        },
        "content": {
          "type": "string",
          "optional": true
        },
        "message": {
          "type": "string",
          "optional": true
        },
        "label": {
          "type": "string",
          "optional": true
        },
        "buttonText": {
          "type": "string",
          "optional": true
        },
        "triggerText": {
          "type": "string",
          "optional": true
        },
        "children": {
          "type": "string",
          "optional": true
        },
        "position": {
          "type": "'top' | 'bottom' | 'left' | 'right'",
          "optional": true
        },
        "placement": {
          "type": "'top' | 'bottom' | 'left' | 'right'",
          "optional": true
        },
        "variant": {
          "type": "'dark' | 'light' | 'info' | 'success' | 'warning' | 'error'",
          "optional": true
        },
        "arrow": {
          "type": "boolean",
          "optional": true
        },
        "delay": {
          "type": "number",
          "optional": true
        }
      }
    }
  },
  "avatar-group": {
    "name": "avatar-group",
    "category": "surfaces",
    "fileName": "AvatarGroup",
    "description": "Display a group of user avatars with overflow handling and customizable appearance",
    "tags": [
      "avatar",
      "group",
      "users",
      "team",
      "members",
      "profile"
    ],
    "props": {
      "avatars": {
        "type": "array",
        "description": "Array of avatar objects",
        "required": true,
        "tsType": "Avatar[]"
      },
      "max": {
        "type": "number",
        "description": "Maximum number of avatars to display before showing \"+N\"",
        "required": false,
        "tsType": "number"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Size variant",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "label": {
        "type": "string",
        "description": "Optional label/title",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "Avatar": {
        "name": {
          "type": "string",
          "description": "User's name or identifier",
          "optional": true
        },
        "label": {
          "type": "string",
          "description": "Alternative: label can be used for initials",
          "optional": true
        },
        "alt": {
          "type": "string",
          "description": "Alternative: alt can be used as name",
          "optional": true
        },
        "src": {
          "type": "string",
          "description": "Avatar image URL",
          "optional": true
        },
        "initials": {
          "type": "string",
          "description": "Fallback initials (auto-generated from name if not provided)",
          "optional": true
        },
        "color": {
          "type": "string",
          "description": "Avatar color variant",
          "optional": true
        }
      },
      "AvatarGroupProps": {
        "avatars": {
          "type": "Avatar[]",
          "description": "Array of avatar objects",
          "optional": false
        },
        "max": {
          "type": "number",
          "description": "Maximum number of avatars to display before showing \"+N\"",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Size variant",
          "optional": true
        },
        "label": {
          "type": "string",
          "description": "Optional label/title",
          "optional": true
        }
      }
    }
  },
  "callout": {
    "name": "callout",
    "category": "surfaces",
    "fileName": "Callout",
    "description": "Attention-grabbing callout box for important information, warnings, tips, and notes",
    "tags": [
      "callout",
      "alert",
      "info",
      "notice",
      "banner",
      "message"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Callout title",
        "required": false,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "Main content/message",
        "required": true,
        "tsType": "string"
      },
      "variant": {
        "type": "'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'",
        "description": "Visual variant",
        "required": false,
        "tsType": "'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'"
      },
      "showIcon": {
        "type": "boolean",
        "description": "Show icon",
        "required": false,
        "tsType": "boolean"
      },
      "dismissible": {
        "type": "boolean",
        "description": "Make dismissible",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "CalloutProps": {
        "title": {
          "type": "string",
          "description": "Callout title",
          "optional": true
        },
        "content": {
          "type": "string",
          "description": "Main content/message",
          "optional": false
        },
        "variant": {
          "type": "'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'",
          "description": "Visual variant",
          "optional": true
        },
        "showIcon": {
          "type": "boolean",
          "description": "Show icon",
          "optional": true
        },
        "dismissible": {
          "type": "boolean",
          "description": "Make dismissible",
          "optional": true
        }
      }
    }
  },
  "feature": {
    "name": "feature",
    "category": "surfaces",
    "fileName": "Feature",
    "description": "Feature highlight card with icon, title, description, and optional link",
    "tags": [
      "feature",
      "card",
      "highlight",
      "showcase",
      "benefits",
      "icon"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Feature title",
        "required": true,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Feature description",
        "required": true,
        "tsType": "string"
      },
      "icon": {
        "type": "'star' | 'zap' | 'shield' | 'heart' | 'trending' | 'check' | 'sparkles' | 'award'",
        "description": "Icon name",
        "required": false,
        "tsType": "'star' | 'zap' | 'shield' | 'heart' | 'trending' | 'check' | 'sparkles' | 'award'"
      },
      "iconColor": {
        "type": "'primary' | 'cyan' | 'purple' | 'pink' | 'success'",
        "description": "Icon color variant",
        "required": false,
        "tsType": "'primary' | 'cyan' | 'purple' | 'pink' | 'success'"
      },
      "orientation": {
        "type": "'vertical' | 'horizontal'",
        "description": "Layout orientation",
        "required": false,
        "tsType": "'vertical' | 'horizontal'"
      },
      "link": {
        "type": "string",
        "description": "Optional link URL",
        "required": false,
        "tsType": "string"
      },
      "linkText": {
        "type": "string",
        "description": "Optional link text",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "FeatureProps": {
        "title": {
          "type": "string",
          "description": "Feature title",
          "optional": false
        },
        "description": {
          "type": "string",
          "description": "Feature description",
          "optional": false
        },
        "icon": {
          "type": "'star' | 'zap' | 'shield' | 'heart' | 'trending' | 'check' | 'sparkles' | 'award'",
          "description": "Icon name",
          "optional": true
        },
        "iconColor": {
          "type": "'primary' | 'cyan' | 'purple' | 'pink' | 'success'",
          "description": "Icon color variant",
          "optional": true
        },
        "orientation": {
          "type": "'vertical' | 'horizontal'",
          "description": "Layout orientation",
          "optional": true
        },
        "link": {
          "type": "string",
          "description": "Optional link URL",
          "optional": true
        },
        "linkText": {
          "type": "string",
          "description": "Optional link text",
          "optional": true
        }
      }
    }
  },
  "frame": {
    "name": "frame",
    "category": "surfaces",
    "fileName": "Frame",
    "description": "Customizable frame container with various border styles, padding, and background options",
    "tags": [
      "frame",
      "container",
      "border",
      "box",
      "wrapper",
      "panel"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Frame title",
        "required": false,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "Content to display inside the frame",
        "required": false,
        "tsType": "string"
      },
      "borderStyle": {
        "type": "'solid' | 'dashed' | 'dotted' | 'double' | 'none'",
        "description": "Border style",
        "required": false,
        "tsType": "'solid' | 'dashed' | 'dotted' | 'double' | 'none'"
      },
      "borderWidth": {
        "type": "'thin' | 'normal' | 'thick'",
        "description": "Border width",
        "required": false,
        "tsType": "'thin' | 'normal' | 'thick'"
      },
      "padding": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Padding size",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "background": {
        "type": "'transparent' | 'dark' | 'light' | 'gradient'",
        "description": "Background variant",
        "required": false,
        "tsType": "'transparent' | 'dark' | 'light' | 'gradient'"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "Optional children (for nested components)",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "FrameProps": {
        "title": {
          "type": "string",
          "description": "Frame title",
          "optional": true
        },
        "content": {
          "type": "string",
          "description": "Content to display inside the frame",
          "optional": true
        },
        "borderStyle": {
          "type": "'solid' | 'dashed' | 'dotted' | 'double' | 'none'",
          "description": "Border style",
          "optional": true
        },
        "borderWidth": {
          "type": "'thin' | 'normal' | 'thick'",
          "description": "Border width",
          "optional": true
        },
        "padding": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Padding size",
          "optional": true
        },
        "background": {
          "type": "'transparent' | 'dark' | 'light' | 'gradient'",
          "description": "Background variant",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "description": "Optional children (for nested components)",
          "optional": true
        }
      }
    }
  },
  "hero": {
    "name": "hero",
    "category": "surfaces",
    "fileName": "Hero",
    "description": "Hero section for landing pages with title, subtitle, description, and CTA buttons",
    "tags": [
      "hero",
      "banner",
      "landing",
      "header",
      "cta",
      "showcase"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Main headline",
        "required": true,
        "tsType": "string"
      },
      "subtitle": {
        "type": "string",
        "description": "Supporting subtitle/tagline",
        "required": false,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description text",
        "required": false,
        "tsType": "string"
      },
      "backgroundStyle": {
        "type": "'gradient' | 'solid' | 'image'",
        "description": "Background style",
        "required": false,
        "tsType": "'gradient' | 'solid' | 'image'"
      },
      "backgroundImage": {
        "type": "string",
        "description": "Background image URL (if backgroundStyle is 'image')",
        "required": false,
        "tsType": "string"
      },
      "buttons": {
        "type": "array",
        "description": "Call-to-action buttons",
        "required": false,
        "tsType": "HeroButton[]"
      },
      "align": {
        "type": "'left' | 'center'",
        "description": "Text alignment",
        "required": false,
        "tsType": "'left' | 'center'"
      },
      "size": {
        "type": "'normal' | 'large'",
        "description": "Size variant",
        "required": false,
        "tsType": "'normal' | 'large'"
      }
    },
    "interfaces": {
      "HeroButton": {
        "label": {
          "type": "string",
          "optional": false
        },
        "variant": {
          "type": "'primary' | 'secondary' | 'outline'",
          "optional": true
        },
        "icon": {
          "type": "'arrow' | 'play' | 'none'",
          "optional": true
        },
        "action": {
          "type": "string",
          "optional": true
        }
      },
      "HeroProps": {
        "title": {
          "type": "string",
          "description": "Main headline",
          "optional": false
        },
        "subtitle": {
          "type": "string",
          "description": "Supporting subtitle/tagline",
          "optional": true
        },
        "description": {
          "type": "string",
          "description": "Optional description text",
          "optional": true
        },
        "backgroundStyle": {
          "type": "'gradient' | 'solid' | 'image'",
          "description": "Background style",
          "optional": true
        },
        "backgroundImage": {
          "type": "string",
          "description": "Background image URL (if backgroundStyle is 'image')",
          "optional": true
        },
        "buttons": {
          "type": "HeroButton[]",
          "description": "Call-to-action buttons",
          "optional": true
        },
        "align": {
          "type": "'left' | 'center'",
          "description": "Text alignment",
          "optional": true
        },
        "size": {
          "type": "'normal' | 'large'",
          "description": "Size variant",
          "optional": true
        }
      }
    }
  },
  "insight-card": {
    "name": "insight-card",
    "category": "surfaces",
    "fileName": "InsightCard",
    "description": "Card component for displaying key insights, findings, and metrics with visual indicators",
    "tags": [
      "card",
      "insight",
      "metric",
      "summary",
      "kpi"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Card title",
        "required": true,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Description or insight text",
        "required": true,
        "tsType": "string"
      },
      "variant": {
        "type": "'info' | 'success' | 'warning' | 'error' | 'neutral'",
        "description": "Visual variant/type",
        "required": false,
        "tsType": "'info' | 'success' | 'warning' | 'error' | 'neutral'"
      },
      "metric": {
        "type": "string",
        "description": "Optional metric to display",
        "required": false,
        "tsType": "{ value: string | number; label: string; trend?: 'up' | 'down' | 'neutral'; trendValue?: string; }"
      },
      "showIcon": {
        "type": "boolean",
        "description": "Show icon",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "InsightCardProps": {
        "title": {
          "type": "string",
          "description": "Card title",
          "optional": false
        },
        "description": {
          "type": "string",
          "description": "Description or insight text",
          "optional": false
        },
        "variant": {
          "type": "'info' | 'success' | 'warning' | 'error' | 'neutral'",
          "description": "Visual variant/type",
          "optional": true
        },
        "metric": {
          "type": "{ value: string | number; label: string; trend?: 'up' | 'down' | 'neutral'; trendValue?: string; }",
          "description": "Optional metric to display",
          "optional": true
        },
        "showIcon": {
          "type": "boolean",
          "description": "Show icon",
          "optional": true
        }
      }
    }
  },
  "panel": {
    "name": "panel",
    "category": "surfaces",
    "fileName": "Panel",
    "description": "Panel container with header, content, optional footer, and collapsible functionality. Supports visual variants, elevation, emphasis, and semantic tones.",
    "tags": [
      "panel",
      "container",
      "collapsible",
      "accordion",
      "section",
      "card"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Panel header/title",
        "required": true,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "Panel content",
        "required": false,
        "tsType": "string"
      },
      "footer": {
        "type": "string",
        "description": "Footer content",
        "required": false,
        "tsType": "string"
      },
      "collapsible": {
        "type": "boolean",
        "description": "Make panel collapsible",
        "required": false,
        "tsType": "boolean"
      },
      "defaultCollapsed": {
        "type": "boolean",
        "description": "Default collapsed state (only applies if collapsible)",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "SurfaceVariant",
        "description": "Surface variant for visual hierarchy",
        "required": false,
        "tsType": "SurfaceVariant"
      },
      "elevation": {
        "type": "ElevationLevel",
        "description": "Elevation level for depth",
        "required": false,
        "tsType": "ElevationLevel"
      },
      "emphasis": {
        "type": "EmphasisLevel",
        "description": "Visual emphasis level",
        "required": false,
        "tsType": "EmphasisLevel"
      },
      "tone": {
        "type": "ToneVariant",
        "description": "Semantic tone",
        "required": false,
        "tsType": "ToneVariant"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "Optional children (for nested components)",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "PanelProps": {
        "title": {
          "type": "string",
          "description": "Panel header/title",
          "optional": false
        },
        "content": {
          "type": "string",
          "description": "Panel content",
          "optional": true
        },
        "footer": {
          "type": "string",
          "description": "Footer content",
          "optional": true
        },
        "collapsible": {
          "type": "boolean",
          "description": "Make panel collapsible",
          "optional": true
        },
        "defaultCollapsed": {
          "type": "boolean",
          "description": "Default collapsed state (only applies if collapsible)",
          "optional": true
        },
        "variant": {
          "type": "SurfaceVariant",
          "description": "Surface variant for visual hierarchy",
          "optional": true
        },
        "elevation": {
          "type": "ElevationLevel",
          "description": "Elevation level for depth",
          "optional": true
        },
        "emphasis": {
          "type": "EmphasisLevel",
          "description": "Visual emphasis level",
          "optional": true
        },
        "tone": {
          "type": "ToneVariant",
          "description": "Semantic tone",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "description": "Optional children (for nested components)",
          "optional": true
        }
      }
    }
  },
  "paper": {
    "name": "paper",
    "category": "surfaces",
    "fileName": "Paper",
    "description": "Material Design-inspired elevated surface with customizable shadow, padding, and styling",
    "tags": [
      "paper",
      "surface",
      "card",
      "container",
      "elevation",
      "material"
    ],
    "props": {
      "content": {
        "type": "string",
        "description": "Content to display",
        "required": false,
        "tsType": "string"
      },
      "elevation": {
        "type": "0 | 1 | 2 | 3 | 4",
        "description": "Elevation level (affects shadow depth)",
        "required": false,
        "tsType": "0 | 1 | 2 | 3 | 4"
      },
      "padding": {
        "type": "'none' | 'small' | 'medium' | 'large'",
        "description": "Padding size",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large'"
      },
      "rounded": {
        "type": "'none' | 'small' | 'medium' | 'large' | 'full'",
        "description": "Border radius",
        "required": false,
        "tsType": "'none' | 'small' | 'medium' | 'large' | 'full'"
      },
      "variant": {
        "type": "'default' | 'outlined' | 'filled'",
        "description": "Background variant",
        "required": false,
        "tsType": "'default' | 'outlined' | 'filled'"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "Optional children (for nested components)",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "PaperProps": {
        "content": {
          "type": "string",
          "description": "Content to display",
          "optional": true
        },
        "elevation": {
          "type": "0 | 1 | 2 | 3 | 4",
          "description": "Elevation level (affects shadow depth)",
          "optional": true
        },
        "padding": {
          "type": "'none' | 'small' | 'medium' | 'large'",
          "description": "Padding size",
          "optional": true
        },
        "rounded": {
          "type": "'none' | 'small' | 'medium' | 'large' | 'full'",
          "description": "Border radius",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'outlined' | 'filled'",
          "description": "Background variant",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "description": "Optional children (for nested components)",
          "optional": true
        }
      }
    }
  },
  "summary-card": {
    "name": "summary-card",
    "category": "surfaces",
    "fileName": "SummaryCard",
    "description": "Card component for displaying multiple summary metrics in various layouts. Supports visual variants, elevation, emphasis, and semantic tones.",
    "tags": [
      "card",
      "summary",
      "metrics",
      "kpi",
      "dashboard"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Card title",
        "required": true,
        "tsType": "string"
      },
      "description": {
        "type": "string",
        "description": "Optional description",
        "required": false,
        "tsType": "string"
      },
      "items": {
        "type": "string",
        "description": "Summary items",
        "required": true,
        "tsType": "Array<{ label: string; value: string | number; change?: string; changeType?: 'positive' | 'negative' | 'neutral'; subtext?: string; }>"
      },
      "layout": {
        "type": "'vertical' | 'horizontal' | 'grid'",
        "description": "Layout orientation",
        "required": false,
        "tsType": "'vertical' | 'horizontal' | 'grid'"
      },
      "columns": {
        "type": "2 | 3 | 4",
        "description": "Number of columns for grid layout",
        "required": false,
        "tsType": "2 | 3 | 4"
      },
      "variant": {
        "type": "SurfaceVariant",
        "description": "Surface variant for visual hierarchy",
        "required": false,
        "tsType": "SurfaceVariant"
      },
      "elevation": {
        "type": "ElevationLevel",
        "description": "Elevation level for depth",
        "required": false,
        "tsType": "ElevationLevel"
      },
      "emphasis": {
        "type": "EmphasisLevel",
        "description": "Visual emphasis level",
        "required": false,
        "tsType": "EmphasisLevel"
      },
      "tone": {
        "type": "ToneVariant",
        "description": "Semantic tone",
        "required": false,
        "tsType": "ToneVariant"
      }
    },
    "interfaces": {
      "SummaryCardProps": {
        "title": {
          "type": "string",
          "description": "Card title",
          "optional": false
        },
        "description": {
          "type": "string",
          "description": "Optional description",
          "optional": true
        },
        "items": {
          "type": "Array<{ label: string; value: string | number; change?: string; changeType?: 'positive' | 'negative' | 'neutral'; subtext?: string; }>",
          "description": "Summary items",
          "optional": false
        },
        "layout": {
          "type": "'vertical' | 'horizontal' | 'grid'",
          "description": "Layout orientation",
          "optional": true
        },
        "columns": {
          "type": "2 | 3 | 4",
          "description": "Number of columns for grid layout",
          "optional": true
        },
        "variant": {
          "type": "SurfaceVariant",
          "description": "Surface variant for visual hierarchy",
          "optional": true
        },
        "elevation": {
          "type": "ElevationLevel",
          "description": "Elevation level for depth",
          "optional": true
        },
        "emphasis": {
          "type": "EmphasisLevel",
          "description": "Visual emphasis level",
          "optional": true
        },
        "tone": {
          "type": "ToneVariant",
          "description": "Semantic tone",
          "optional": true
        }
      }
    }
  },
  "text": {
    "name": "text",
    "category": "surfaces",
    "fileName": "Text",
    "description": "Text component for displaying explanations, descriptions, and narrative content",
    "tags": [
      "text",
      "typography",
      "content",
      "explanation"
    ],
    "props": {
      "content": {
        "type": "string",
        "description": "Text content to display",
        "required": true,
        "tsType": "string"
      },
      "variant": {
        "type": "'body' | 'caption' | 'subtitle' | 'heading'",
        "description": "Visual variant",
        "required": false,
        "tsType": "'body' | 'caption' | 'subtitle' | 'heading'"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'muted' | 'accent'",
        "description": "Color variant",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'muted' | 'accent'"
      },
      "align": {
        "type": "'left' | 'center' | 'right'",
        "description": "Text alignment",
        "required": false,
        "tsType": "'left' | 'center' | 'right'"
      },
      "markdown": {
        "type": "boolean",
        "description": "Enable markdown-style formatting",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "TextProps": {
        "content": {
          "type": "string",
          "description": "Text content to display",
          "optional": false
        },
        "variant": {
          "type": "'body' | 'caption' | 'subtitle' | 'heading'",
          "description": "Visual variant",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'muted' | 'accent'",
          "description": "Color variant",
          "optional": true
        },
        "align": {
          "type": "'left' | 'center' | 'right'",
          "description": "Text alignment",
          "optional": true
        },
        "markdown": {
          "type": "boolean",
          "description": "Enable markdown-style formatting",
          "optional": true
        }
      }
    }
  },
  "well": {
    "name": "well",
    "category": "surfaces",
    "fileName": "Well",
    "description": "Inset container with shadow-inner effect for displaying recessed content",
    "tags": [
      "well",
      "container",
      "inset",
      "recessed",
      "box",
      "panel"
    ],
    "props": {
      "content": {
        "type": "string",
        "description": "Content to display",
        "required": false,
        "tsType": "string"
      },
      "size": {
        "type": "'small' | 'medium' | 'large'",
        "description": "Well size",
        "required": false,
        "tsType": "'small' | 'medium' | 'large'"
      },
      "title": {
        "type": "string",
        "description": "Optional title",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'default' | 'info' | 'warning' | 'success'",
        "description": "Visual variant",
        "required": false,
        "tsType": "'default' | 'info' | 'warning' | 'success'"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "Optional children (for nested components)",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "WellProps": {
        "content": {
          "type": "string",
          "description": "Content to display",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Well size",
          "optional": true
        },
        "title": {
          "type": "string",
          "description": "Optional title",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'info' | 'warning' | 'success'",
          "description": "Visual variant",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "description": "Optional children (for nested components)",
          "optional": true
        }
      }
    }
  },
  "audio": {
    "name": "audio",
    "category": "media",
    "fileName": "Audio",
    "description": "Audio player component with playback controls, seek functionality, volume control, waveform visualization, and multiple display variants including compact and full modes with cover art.",
    "tags": [
      "ui",
      "media",
      "audio",
      "player",
      "music",
      "controls"
    ],
    "props": {
      "src": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "title": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "artist": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "album": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "coverArt": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "autoPlay": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "loop": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "variant": {
        "type": "'default' | 'compact' | 'full'",
        "description": "",
        "required": false,
        "tsType": "'default' | 'compact' | 'full'"
      },
      "showWaveform": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onPlay": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onPause": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onEnded": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onTimeUpdate": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(currentTime: number) => void"
      }
    },
    "interfaces": {
      "AudioProps": {
        "src": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": true
        },
        "artist": {
          "type": "string",
          "optional": true
        },
        "album": {
          "type": "string",
          "optional": true
        },
        "coverArt": {
          "type": "string",
          "optional": true
        },
        "autoPlay": {
          "type": "boolean",
          "optional": true
        },
        "loop": {
          "type": "boolean",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'compact' | 'full'",
          "optional": true
        },
        "showWaveform": {
          "type": "boolean",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        },
        "onPlay": {
          "type": "() => void",
          "optional": true
        },
        "onPause": {
          "type": "() => void",
          "optional": true
        },
        "onEnded": {
          "type": "() => void",
          "optional": true
        },
        "onTimeUpdate": {
          "type": "(currentTime: number) => void",
          "optional": true
        }
      }
    }
  },
  "carousel": {
    "name": "carousel",
    "category": "media",
    "fileName": "Carousel",
    "description": "Image carousel/slider component with navigation arrows, indicators, thumbnails, auto-play functionality, touch/swipe support, and multiple transition effects including slide, fade, and zoom.",
    "tags": [
      "ui",
      "media",
      "carousel",
      "slider",
      "images",
      "gallery"
    ],
    "props": {
      "images": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "CarouselImage[]"
      },
      "autoPlay": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "interval": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "number"
      },
      "showIndicators": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showArrows": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showThumbnails": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "infinite": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "aspectRatio": {
        "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
        "description": "",
        "required": false,
        "tsType": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'"
      },
      "transition": {
        "type": "'slide' | 'fade' | 'zoom'",
        "description": "",
        "required": false,
        "tsType": "'slide' | 'fade' | 'zoom'"
      },
      "rounded": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onSlideChange": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(index: number) => void"
      }
    },
    "interfaces": {
      "CarouselImage": {
        "src": {
          "type": "string",
          "optional": false
        },
        "alt": {
          "type": "string",
          "optional": false
        },
        "caption": {
          "type": "string",
          "optional": true
        },
        "link": {
          "type": "string",
          "optional": true
        }
      },
      "CarouselProps": {
        "images": {
          "type": "CarouselImage[]",
          "optional": false
        },
        "autoPlay": {
          "type": "boolean",
          "optional": true
        },
        "interval": {
          "type": "number",
          "optional": true
        },
        "showIndicators": {
          "type": "boolean",
          "optional": true
        },
        "showArrows": {
          "type": "boolean",
          "optional": true
        },
        "showThumbnails": {
          "type": "boolean",
          "optional": true
        },
        "infinite": {
          "type": "boolean",
          "optional": true
        },
        "aspectRatio": {
          "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
          "optional": true
        },
        "transition": {
          "type": "'slide' | 'fade' | 'zoom'",
          "optional": true
        },
        "rounded": {
          "type": "boolean | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        },
        "onSlideChange": {
          "type": "(index: number) => void",
          "optional": true
        }
      }
    }
  },
  "gallery": {
    "name": "gallery",
    "category": "media",
    "fileName": "Gallery",
    "description": "Photo gallery component with grid/masonry/justified layouts, integrated lightbox modal, category filtering, hover effects, lazy loading, and responsive column layouts.",
    "tags": [
      "ui",
      "media",
      "gallery",
      "images",
      "lightbox",
      "grid"
    ],
    "props": {
      "images": {
        "type": "array",
        "description": "",
        "required": true,
        "tsType": "GalleryImage[]"
      },
      "columns": {
        "type": "2 | 3 | 4 | 5 | 6",
        "description": "",
        "required": false,
        "tsType": "2 | 3 | 4 | 5 | 6"
      },
      "gap": {
        "type": "'sm' | 'md' | 'lg'",
        "description": "",
        "required": false,
        "tsType": "'sm' | 'md' | 'lg'"
      },
      "variant": {
        "type": "'grid' | 'masonry' | 'justified'",
        "description": "",
        "required": false,
        "tsType": "'grid' | 'masonry' | 'justified'"
      },
      "lightbox": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "showCaptions": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "filterCategories": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "aspectRatio": {
        "type": "'16:9' | '4:3' | '1:1' | 'auto'",
        "description": "",
        "required": false,
        "tsType": "'16:9' | '4:3' | '1:1' | 'auto'"
      },
      "rounded": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "hoverEffect": {
        "type": "'zoom' | 'fade' | 'lift' | 'none'",
        "description": "",
        "required": false,
        "tsType": "'zoom' | 'fade' | 'lift' | 'none'"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onImageClick": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(image: GalleryImage, index: number) => void"
      }
    },
    "interfaces": {
      "GalleryImage": {
        "src": {
          "type": "string",
          "optional": false
        },
        "alt": {
          "type": "string",
          "optional": false
        },
        "title": {
          "type": "string",
          "optional": true
        },
        "description": {
          "type": "string",
          "optional": true
        },
        "thumbnail": {
          "type": "string",
          "optional": true
        },
        "category": {
          "type": "string",
          "optional": true
        }
      },
      "GalleryProps": {
        "images": {
          "type": "GalleryImage[]",
          "optional": false
        },
        "columns": {
          "type": "2 | 3 | 4 | 5 | 6",
          "optional": true
        },
        "gap": {
          "type": "'sm' | 'md' | 'lg'",
          "optional": true
        },
        "variant": {
          "type": "'grid' | 'masonry' | 'justified'",
          "optional": true
        },
        "lightbox": {
          "type": "boolean",
          "optional": true
        },
        "showCaptions": {
          "type": "boolean",
          "optional": true
        },
        "filterCategories": {
          "type": "boolean",
          "optional": true
        },
        "aspectRatio": {
          "type": "'16:9' | '4:3' | '1:1' | 'auto'",
          "optional": true
        },
        "rounded": {
          "type": "boolean | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "hoverEffect": {
          "type": "'zoom' | 'fade' | 'lift' | 'none'",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        },
        "onImageClick": {
          "type": "(image: GalleryImage, index: number) => void",
          "optional": true
        }
      }
    }
  },
  "image": {
    "name": "image",
    "category": "media",
    "fileName": "Image",
    "description": "Image display component with lazy loading, fallback support, zoom functionality, loading states, and various styling options including aspect ratios, borders, shadows, and filters.",
    "tags": [
      "ui",
      "media",
      "image",
      "lazy-load",
      "responsive"
    ],
    "props": {
      "src": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "alt": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "width": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "number | string"
      },
      "height": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "number | string"
      },
      "fallbackSrc": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "lazyLoad": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "objectFit": {
        "type": "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'",
        "description": "",
        "required": false,
        "tsType": "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'"
      },
      "rounded": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'full' | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "border": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "shadow": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "zoom": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "overlay": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "caption": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "aspectRatio": {
        "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
        "description": "",
        "required": false,
        "tsType": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'"
      },
      "grayscale": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "blur": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onLoad": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onError": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onClick": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      }
    },
    "interfaces": {
      "ImageProps": {
        "src": {
          "type": "string",
          "optional": false
        },
        "alt": {
          "type": "string",
          "optional": false
        },
        "width": {
          "type": "number | string",
          "optional": true
        },
        "height": {
          "type": "number | string",
          "optional": true
        },
        "fallbackSrc": {
          "type": "string",
          "optional": true
        },
        "lazyLoad": {
          "type": "boolean",
          "optional": true
        },
        "objectFit": {
          "type": "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'",
          "optional": true
        },
        "rounded": {
          "type": "boolean | 'full' | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "border": {
          "type": "boolean",
          "optional": true
        },
        "shadow": {
          "type": "boolean | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "zoom": {
          "type": "boolean",
          "optional": true
        },
        "overlay": {
          "type": "string",
          "optional": true
        },
        "caption": {
          "type": "string",
          "optional": true
        },
        "aspectRatio": {
          "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
          "optional": true
        },
        "grayscale": {
          "type": "boolean",
          "optional": true
        },
        "blur": {
          "type": "boolean",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        },
        "onLoad": {
          "type": "() => void",
          "optional": true
        },
        "onError": {
          "type": "() => void",
          "optional": true
        },
        "onClick": {
          "type": "() => void",
          "optional": true
        }
      }
    }
  },
  "video": {
    "name": "video",
    "category": "media",
    "fileName": "Video",
    "description": "Video player component with custom controls, play/pause, seek, volume control, fullscreen support, and multiple control variants.",
    "tags": [
      "ui",
      "media",
      "video",
      "player",
      "controls"
    ],
    "props": {
      "src": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "poster": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "width": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "number | string"
      },
      "height": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "number | string"
      },
      "autoPlay": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "loop": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "muted": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "controls": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean"
      },
      "controlsVariant": {
        "type": "'default' | 'minimal' | 'full'",
        "description": "",
        "required": false,
        "tsType": "'default' | 'minimal' | 'full'"
      },
      "aspectRatio": {
        "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
        "description": "",
        "required": false,
        "tsType": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'"
      },
      "rounded": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "shadow": {
        "type": "boolean",
        "description": "",
        "required": false,
        "tsType": "boolean | 'sm' | 'md' | 'lg' | 'xl'"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      },
      "onPlay": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onPause": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onEnded": {
        "type": "function",
        "description": "",
        "required": false,
        "tsType": "() => void"
      },
      "onTimeUpdate": {
        "type": "number",
        "description": "",
        "required": false,
        "tsType": "(currentTime: number) => void"
      }
    },
    "interfaces": {
      "VideoProps": {
        "src": {
          "type": "string",
          "optional": false
        },
        "poster": {
          "type": "string",
          "optional": true
        },
        "width": {
          "type": "number | string",
          "optional": true
        },
        "height": {
          "type": "number | string",
          "optional": true
        },
        "autoPlay": {
          "type": "boolean",
          "optional": true
        },
        "loop": {
          "type": "boolean",
          "optional": true
        },
        "muted": {
          "type": "boolean",
          "optional": true
        },
        "controls": {
          "type": "boolean",
          "optional": true
        },
        "controlsVariant": {
          "type": "'default' | 'minimal' | 'full'",
          "optional": true
        },
        "aspectRatio": {
          "type": "'16:9' | '4:3' | '1:1' | '21:9' | 'auto'",
          "optional": true
        },
        "rounded": {
          "type": "boolean | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "shadow": {
          "type": "boolean | 'sm' | 'md' | 'lg' | 'xl'",
          "optional": true
        },
        "className": {
          "type": "string",
          "optional": true
        },
        "onPlay": {
          "type": "() => void",
          "optional": true
        },
        "onPause": {
          "type": "() => void",
          "optional": true
        },
        "onEnded": {
          "type": "() => void",
          "optional": true
        },
        "onTimeUpdate": {
          "type": "(currentTime: number) => void",
          "optional": true
        }
      }
    }
  },
  "chat": {
    "name": "chat",
    "category": "advanced",
    "fileName": "Chat",
    "description": "Chat interface with messages, avatars, timestamps, and input field",
    "tags": [
      "chat",
      "messaging",
      "conversation",
      "messages",
      "communication"
    ],
    "props": {
      "messages": {
        "type": "array",
        "description": "Array of messages",
        "required": true,
        "tsType": "Message[]"
      },
      "title": {
        "type": "string",
        "description": "Chat title",
        "required": false,
        "tsType": "string"
      },
      "showInput": {
        "type": "boolean",
        "description": "Show input field",
        "required": false,
        "tsType": "boolean"
      },
      "inputPlaceholder": {
        "type": "string",
        "description": "Input placeholder",
        "required": false,
        "tsType": "string"
      },
      "maxHeight": {
        "type": "number",
        "description": "Max height for scrollable area",
        "required": false,
        "tsType": "number"
      }
    },
    "interfaces": {
      "Message": {
        "text": {
          "type": "string",
          "description": "Message text",
          "optional": false
        },
        "sender": {
          "type": "'user' | 'bot' | 'system'",
          "description": "Sender: user or bot",
          "optional": false
        },
        "timestamp": {
          "type": "string",
          "description": "Timestamp",
          "optional": true
        },
        "name": {
          "type": "string",
          "description": "Sender's name",
          "optional": true
        },
        "avatar": {
          "type": "string",
          "description": "Avatar URL",
          "optional": true
        }
      },
      "ChatProps": {
        "messages": {
          "type": "Message[]",
          "description": "Array of messages",
          "optional": false
        },
        "title": {
          "type": "string",
          "description": "Chat title",
          "optional": true
        },
        "showInput": {
          "type": "boolean",
          "description": "Show input field",
          "optional": true
        },
        "inputPlaceholder": {
          "type": "string",
          "description": "Input placeholder",
          "optional": true
        },
        "maxHeight": {
          "type": "number",
          "description": "Max height for scrollable area",
          "optional": true
        }
      }
    }
  },
  "code-block": {
    "name": "code-block",
    "category": "advanced",
    "fileName": "CodeBlock",
    "description": "Code block display with syntax highlighting, line numbers, and copy functionality",
    "tags": [
      "code",
      "syntax",
      "programming",
      "snippet",
      "developer",
      "monospace"
    ],
    "props": {
      "code": {
        "type": "string",
        "description": "Code content to display",
        "required": true,
        "tsType": "string"
      },
      "language": {
        "type": "'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'other'",
        "description": "Programming language",
        "required": false,
        "tsType": "'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'other'"
      },
      "showLineNumbers": {
        "type": "boolean",
        "description": "Show line numbers",
        "required": false,
        "tsType": "boolean"
      },
      "showCopyButton": {
        "type": "boolean",
        "description": "Show copy button",
        "required": false,
        "tsType": "boolean"
      },
      "title": {
        "type": "string",
        "description": "Optional title/filename",
        "required": false,
        "tsType": "string"
      },
      "maxHeight": {
        "type": "number",
        "description": "Maximum height (scrollable)",
        "required": false,
        "tsType": "number"
      },
      "theme": {
        "type": "'dark' | 'light'",
        "description": "Theme variant",
        "required": false,
        "tsType": "'dark' | 'light'"
      }
    },
    "interfaces": {
      "CodeBlockProps": {
        "code": {
          "type": "string",
          "description": "Code content to display",
          "optional": false
        },
        "language": {
          "type": "'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'other'",
          "description": "Programming language",
          "optional": true
        },
        "showLineNumbers": {
          "type": "boolean",
          "description": "Show line numbers",
          "optional": true
        },
        "showCopyButton": {
          "type": "boolean",
          "description": "Show copy button",
          "optional": true
        },
        "title": {
          "type": "string",
          "description": "Optional title/filename",
          "optional": true
        },
        "maxHeight": {
          "type": "number",
          "description": "Maximum height (scrollable)",
          "optional": true
        },
        "theme": {
          "type": "'dark' | 'light'",
          "description": "Theme variant",
          "optional": true
        }
      }
    }
  },
  "dashboard": {
    "name": "dashboard",
    "category": "advanced",
    "fileName": "Dashboard",
    "description": "Dashboard layout with customizable widget grid and responsive design",
    "tags": [
      "dashboard",
      "analytics",
      "metrics",
      "widgets",
      "grid",
      "statistics"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Dashboard title",
        "required": false,
        "tsType": "string"
      },
      "widgets": {
        "type": "array",
        "description": "Array of widget configurations",
        "required": true,
        "tsType": "Widget[]"
      },
      "columns": {
        "type": "2 | 3 | 4",
        "description": "Grid layout columns",
        "required": false,
        "tsType": "2 | 3 | 4"
      },
      "compact": {
        "type": "boolean",
        "description": "Compact mode (smaller spacing)",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "Widget": {
        "id": {
          "type": "string",
          "description": "Widget ID",
          "optional": false
        },
        "title": {
          "type": "string",
          "description": "Widget title",
          "optional": false
        },
        "value": {
          "type": "string | number",
          "description": "Widget value/metric",
          "optional": false
        },
        "subtitle": {
          "type": "string",
          "description": "Optional subtitle or description",
          "optional": true
        },
        "change": {
          "type": "string",
          "description": "Change percentage",
          "optional": true
        },
        "changeType": {
          "type": "'positive' | 'negative' | 'neutral'",
          "description": "Change type",
          "optional": true
        },
        "icon": {
          "type": "'activity' | 'trending' | 'users' | 'dollar' | 'chart'",
          "description": "Icon name",
          "optional": true
        },
        "size": {
          "type": "'small' | 'medium' | 'large'",
          "description": "Widget size",
          "optional": true
        }
      },
      "DashboardProps": {
        "title": {
          "type": "string",
          "description": "Dashboard title",
          "optional": true
        },
        "widgets": {
          "type": "Widget[]",
          "description": "Array of widget configurations",
          "optional": false
        },
        "columns": {
          "type": "2 | 3 | 4",
          "description": "Grid layout columns",
          "optional": true
        },
        "compact": {
          "type": "boolean",
          "description": "Compact mode (smaller spacing)",
          "optional": true
        }
      }
    }
  },
  "loading-spinner": {
    "name": "loading-spinner",
    "category": "advanced",
    "fileName": "LoadingSpinner",
    "description": "Customizable loading spinner with multiple styles, sizes, and colors",
    "tags": [
      "loading",
      "spinner",
      "loader",
      "progress",
      "waiting",
      "animation"
    ],
    "props": {
      "size": {
        "type": "'small' | 'medium' | 'large' | 'xlarge'",
        "description": "Size variant",
        "required": false,
        "tsType": "'small' | 'medium' | 'large' | 'xlarge'"
      },
      "color": {
        "type": "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'",
        "description": "Color variant",
        "required": false,
        "tsType": "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'"
      },
      "variant": {
        "type": "'spin' | 'pulse' | 'dots' | 'bars'",
        "description": "Spinner style/animation",
        "required": false,
        "tsType": "'spin' | 'pulse' | 'dots' | 'bars'"
      },
      "label": {
        "type": "string",
        "description": "Optional loading text",
        "required": false,
        "tsType": "string"
      },
      "centered": {
        "type": "boolean",
        "description": "Center in container",
        "required": false,
        "tsType": "boolean"
      },
      "fullScreen": {
        "type": "boolean",
        "description": "Full screen overlay",
        "required": false,
        "tsType": "boolean"
      }
    },
    "interfaces": {
      "LoadingSpinnerProps": {
        "size": {
          "type": "'small' | 'medium' | 'large' | 'xlarge'",
          "description": "Size variant",
          "optional": true
        },
        "color": {
          "type": "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'",
          "description": "Color variant",
          "optional": true
        },
        "variant": {
          "type": "'spin' | 'pulse' | 'dots' | 'bars'",
          "description": "Spinner style/animation",
          "optional": true
        },
        "label": {
          "type": "string",
          "description": "Optional loading text",
          "optional": true
        },
        "centered": {
          "type": "boolean",
          "description": "Center in container",
          "optional": true
        },
        "fullScreen": {
          "type": "boolean",
          "description": "Full screen overlay",
          "optional": true
        }
      }
    }
  },
  "markdown": {
    "name": "markdown",
    "category": "advanced",
    "fileName": "Markdown",
    "description": "Full-featured markdown renderer with support for headings, lists, tables, code blocks, and more",
    "tags": [
      "markdown",
      "text",
      "content",
      "documentation"
    ],
    "props": {
      "content": {
        "type": "string",
        "description": "",
        "required": true,
        "tsType": "string"
      },
      "className": {
        "type": "string",
        "description": "",
        "required": false,
        "tsType": "string"
      }
    },
    "interfaces": {
      "MarkdownProps": {
        "content": {
          "type": "string",
          "optional": false
        },
        "className": {
          "type": "string",
          "optional": true
        }
      }
    }
  },
  "widget": {
    "name": "widget",
    "category": "advanced",
    "fileName": "Widget",
    "description": "Versatile widget container with header, content, footer, and interactive controls",
    "tags": [
      "widget",
      "container",
      "panel",
      "card",
      "module",
      "component"
    ],
    "props": {
      "title": {
        "type": "string",
        "description": "Widget title",
        "required": true,
        "tsType": "string"
      },
      "content": {
        "type": "string",
        "description": "Widget content",
        "required": false,
        "tsType": "string"
      },
      "variant": {
        "type": "'default' | 'compact' | 'highlighted'",
        "description": "Widget type/variant",
        "required": false,
        "tsType": "'default' | 'compact' | 'highlighted'"
      },
      "footer": {
        "type": "string",
        "description": "Footer content",
        "required": false,
        "tsType": "string"
      },
      "showActions": {
        "type": "boolean",
        "description": "Show header actions",
        "required": false,
        "tsType": "boolean"
      },
      "collapsible": {
        "type": "boolean",
        "description": "Allow collapse/expand",
        "required": false,
        "tsType": "boolean"
      },
      "defaultCollapsed": {
        "type": "boolean",
        "description": "Default collapsed state",
        "required": false,
        "tsType": "boolean"
      },
      "closeable": {
        "type": "boolean",
        "description": "Show close button",
        "required": false,
        "tsType": "boolean"
      },
      "children": {
        "type": "React.ReactNode",
        "description": "Optional children (for nested components)",
        "required": false,
        "tsType": "React.ReactNode"
      }
    },
    "interfaces": {
      "WidgetProps": {
        "title": {
          "type": "string",
          "description": "Widget title",
          "optional": false
        },
        "content": {
          "type": "string",
          "description": "Widget content",
          "optional": true
        },
        "variant": {
          "type": "'default' | 'compact' | 'highlighted'",
          "description": "Widget type/variant",
          "optional": true
        },
        "footer": {
          "type": "string",
          "description": "Footer content",
          "optional": true
        },
        "showActions": {
          "type": "boolean",
          "description": "Show header actions",
          "optional": true
        },
        "collapsible": {
          "type": "boolean",
          "description": "Allow collapse/expand",
          "optional": true
        },
        "defaultCollapsed": {
          "type": "boolean",
          "description": "Default collapsed state",
          "optional": true
        },
        "closeable": {
          "type": "boolean",
          "description": "Show close button",
          "optional": true
        },
        "children": {
          "type": "React.ReactNode",
          "description": "Optional children (for nested components)",
          "optional": true
        }
      }
    }
  }
};

const inputComponentNames = $input.all()[0]?.json?.componentNames;
console.log('Requested components:', inputComponentNames);

let componentNames = [];
if (typeof inputComponentNames === 'string') {
  componentNames = inputComponentNames
    .split(',')
    .map(name => name.trim())
    .filter(Boolean);
} else if (Array.isArray(inputComponentNames)) {
  componentNames = inputComponentNames;
} else {
  throw new Error('componentNames must be a string or array');
}

const schemas = {};
const notFound = [];

for (const componentName of componentNames) {
  if (components[componentName]) {
    schemas[componentName] = components[componentName];
  } else {
    notFound.push(componentName);
  }
}

let output = '';

if (Object.keys(schemas).length > 0) {
  output += '# Component Schemas\n\n';

  for (const [name, schema] of Object.entries(schemas)) {
    output += '## ' + name + '\n\n';
    output += '**Category:** ' + schema.category + '\n';
    output += '**Description:** ' + (schema.description || '') + '\n\n';

    output += '### Props\n\n';
    output += '| Property | Type | Required | Description |\n';
    output += '|----------|------|----------|-------------|\n';

    for (const [propName, prop] of Object.entries(schema.props)) {
      const required = prop.required ? 'Yes' : 'No';
      const type = prop.tsType || prop.type || 'unknown';
      const desc = prop.description || '';
      output += '| ' + propName + ' | `' + type + '` | ' + required + ' | ' + desc + ' |\n';
    }

    output += '\n';
  }
}

if (notFound.length > 0) {
  output += '\n⚠️ Components not found: ' + notFound.join(', ') + '\n';
}

return { output };
