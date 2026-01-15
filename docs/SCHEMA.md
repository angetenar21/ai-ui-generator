# Component JSON Schema Reference

This document provides the complete JSON schema reference for all components in the AI UI Generator.

**Last Updated**: 2026-01-14

## Table of Contents

- [Charts](#charts) (27 components)
- [Data-display](#data-display) (15 components)
- [Inputs](#inputs) (20 components)
- [Layout](#layout) (15 components)
- [Navigation](#navigation) (4 components)
- [Feedback](#feedback) (9 components)
- [Surfaces](#surfaces) (11 components)
- [Media](#media) (5 components)
- [Advanced](#advanced) (6 components)

---

## Charts

### area-chart

Area chart for visualizing cumulative data and trends over time with filled regions

**Tags**: chart, area, trend, cumulative, stacked, data-visualization

**Component Name**: `area-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| xAxis | `string` | No | X-axis data points |
| series | `string` | Yes | Series data for the areas |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| grid | `boolean` | No | Show grid lines |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |

#### JSON Schema

```json
{
  "name": "area-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "grid": false,
    "legend": false,
    "margin": 0
  }
}
```

---

### bar-chart

Bar chart for comparing categorical data with support for horizontal/vertical layout, stacked bars, visual variants, and color palettes

**Tags**: chart, bar, column, comparison, categorical, data-visualization

**Component Name**: `bar-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| xAxis | `string` | No | X-axis data (categories) |
| series | `string` | Yes | Series data for the bars |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| backgroundColor | `string` | No | Chart background color (plot area) |
| cardBackgroundColor | `string` | No | Card background color |
| layout | `'horizontal' | 'vertical'` | No | Layout orientation |
| grid | `boolean` | No | Show grid lines |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |
| variant | `SurfaceVariant` | No | Surface variant for visual hierarchy |
| elevation | `ElevationLevel` | No | Elevation level for depth |
| emphasis | `EmphasisLevel` | No | Visual emphasis level |
| palette | `ChartPaletteType` | No | Chart color palette |
| useGradient | `boolean` | No | Use gradient fills |

#### JSON Schema

```json
{
  "name": "bar-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "backgroundColor": "example",
    "cardBackgroundColor": "example",
    "layout": null,
    "grid": false,
    "legend": false,
    "margin": 0,
    "variant": null,
    "elevation": null,
    "emphasis": null,
    "palette": null,
    "useGradient": false
  }
}
```

---

### boxplot-chart

Box plot chart for statistical distribution. Shows min, Q1, median, Q3, and max values.

**Tags**: chart, boxplot, statistics, distribution

**Component Name**: `boxplot-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Chart description |
| xAxis | `string` | No | X-axis categories |
| series | `string` | Yes | Series data with box plot statistics |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "boxplot-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### bubble-chart

Bubble chart for visualizing three-dimensional data with x, y, and size dimensions

**Tags**: chart, bubble, scatter, 3d, correlation, data-visualization

**Component Name**: `bubble-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| series | `string` | Yes | Series data with bubble points |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "bubble-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "series": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### chord-chart

Chord diagram for showing relationships between nodes. Displayed as matrix table.

**Tags**: chart, chord, network, relationships, matrix

**Component Name**: `chord-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Chart description |
| nodes | `string` | Yes | Node definitions |
| matrix | `number` | Yes | Relationship matrix |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "chord-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "nodes": "example",
    "matrix": 0,
    "width": 0,
    "height": 0
  }
}
```

---

### composed-chart

Chart combining bar and line series with dual y-axes support

**Tags**: chart, composed, mixed, bar, line, dual-axis

**Component Name**: `composed-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| description | `string` | No |  |
| xAxis | `string` | No |  |
| yAxis | `string` | No |  |
| series | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |
| legend | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "composed-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "yAxis": "example",
    "series": [],
    "width": 0,
    "height": 0,
    "legend": false
  }
}
```

---

### donut-chart

Donut chart (pie chart with center hole) for displaying proportional data with optional center label

**Tags**: chart, donut, pie, proportion, percentage, data-visualization

**Component Name**: `donut-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| data | `string` | Yes | Series data for donut slices |
| innerRadius | `number` | No | Inner radius percentage (creates the donut hole) |
| outerRadius | `number` | No | Outer radius |
| paddingAngle | `number` | No | Padding angle between slices |
| cornerRadius | `number` | No | Corner radius for slices |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| legend | `boolean` | No | Show legend |
| centerLabel | `string` | No | Show center label |
| margin | `number` | No | Margin around chart |

#### JSON Schema

```json
{
  "name": "donut-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "data": "example",
    "innerRadius": 0,
    "outerRadius": 0,
    "paddingAngle": 0,
    "cornerRadius": 0,
    "width": 0,
    "height": 0,
    "legend": false,
    "centerLabel": "example",
    "margin": 0
  }
}
```

---

### funnel-chart

Funnel chart for conversion funnels

**Tags**: chart, funnel, conversion

**Component Name**: `funnel-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `string` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "funnel-chart",
  "templateProps": {
    "title": "example",
    "data": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### gauge-chart

Gauge chart for displaying a single value within a range, useful for KPIs and metrics

**Tags**: chart, gauge, meter, kpi, metric, data-visualization

**Component Name**: `gauge-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| value | `number` | No | Current value - can be direct number or from series |
| series | `string` | No | Series data format [{ data: [value], label?, colorStops? }] |
| valueMin | `number` | No | Minimum value |
| valueMax | `number` | No | Maximum value |
| startAngle | `number` | No | Start angle in degrees |
| endAngle | `number` | No | End angle in degrees |
| innerRadius | `string` | No | Inner radius percentage |
| outerRadius | `string` | No | Outer radius percentage |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| text | `string` | No | Value label text |
| color | `string` | No | Color of the gauge arc |

#### JSON Schema

```json
{
  "name": "gauge-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "value": 0,
    "series": "example",
    "valueMin": 0,
    "valueMax": 0,
    "startAngle": 0,
    "endAngle": 0,
    "innerRadius": "example",
    "outerRadius": "example",
    "width": 0,
    "height": 0,
    "text": "example",
    "color": "example"
  }
}
```

---

### grouped-bar-chart

Grouped bar chart

**Tags**: chart

**Component Name**: `grouped-bar-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| description | `string` | No |  |
| data | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "grouped-bar-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "data": [],
    "width": 0,
    "height": 0
  }
}
```

---

### heatmap-chart

Heat map visualization for 2D data density. Shows values with color intensity.

**Tags**: chart, heatmap, density, 2d

**Component Name**: `heatmap-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Chart description |
| xAxis | `string` | No | X-axis labels |
| yAxis | `string` | No | Y-axis labels |
| series | `string` | Yes | Series data with heatmap values |
| visualMap | `string` | No | Visual mapping configuration |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "heatmap-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "yAxis": "example",
    "series": "example",
    "visualMap": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### histogram-chart

Histogram for distribution visualization. Supports series format with [label, value] pairs.

**Tags**: chart, histogram, distribution, bar

**Component Name**: `histogram-chart`

#### Props

No props defined.

#### JSON Schema

```json
{
  "name": "histogram-chart",
  "templateProps": {
  }
}
```

---

### line-chart

Line chart for visualizing trends over time with support for multiple series, curves, areas, visual variants, and color palettes

**Tags**: chart, line, trend, time-series, data-visualization

**Component Name**: `line-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| xAxis | `string` | No | X-axis data points |
| series | `string` | Yes | Series data for the lines |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| backgroundColor | `string` | No | Chart background color (plot area) |
| cardBackgroundColor | `string` | No | Card background color |
| grid | `boolean` | No | Show grid lines |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |
| variant | `SurfaceVariant` | No | Surface variant for visual hierarchy |
| elevation | `ElevationLevel` | No | Elevation level for depth |
| emphasis | `EmphasisLevel` | No | Visual emphasis level |
| palette | `ChartPaletteType` | No | Chart color palette |
| useGradient | `boolean` | No | Use gradient fills for area charts |

#### JSON Schema

```json
{
  "name": "line-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "backgroundColor": "example",
    "cardBackgroundColor": "example",
    "grid": false,
    "legend": false,
    "margin": 0,
    "variant": null,
    "elevation": null,
    "emphasis": null,
    "palette": null,
    "useGradient": false
  }
}
```

---

### multi-axis-chart

Chart with multiple axes

**Tags**: chart

**Component Name**: `multi-axis-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "multi-axis-chart",
  "templateProps": {
    "title": "example",
    "data": [],
    "width": 0,
    "height": 0
  }
}
```

---

### multi-line-chart

Multiple line series

**Tags**: chart

**Component Name**: `multi-line-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "multi-line-chart",
  "templateProps": {
    "title": "example",
    "data": [],
    "width": 0,
    "height": 0
  }
}
```

---

### pie-chart

Pie chart for showing proportional data distribution with support for donut style and custom styling

**Tags**: chart, pie, donut, proportion, percentage, data-visualization

**Component Name**: `pie-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| series | `string` | Yes | Series data for pie slices |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |

#### JSON Schema

```json
{
  "name": "pie-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "legend": false,
    "margin": 0
  }
}
```

---

### polar-chart

Polar coordinate chart. Displays data in radial bar format.

**Tags**: chart, polar, radial, circular

**Component Name**: `polar-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Chart description |
| angleAxis | `string` | No | Angle axis configuration |
| radiusAxis | `any` | No | Radius axis configuration |
| series | `string` | Yes | Series data for polar chart |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "polar-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "angleAxis": "example",
    "radiusAxis": null,
    "series": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### radar-chart

Radar chart for comparing multiple variables across different categories. Supports three formats: (1) indicator + series, (2) axes + series, or (3) data + dataKeys

**Tags**: chart, radar, spider, multivariate, comparison, data-visualization

**Component Name**: `radar-chart`

#### Props

No props defined.

#### JSON Schema

```json
{
  "name": "radar-chart",
  "templateProps": {
  }
}
```

---

### radial-bar-chart

Radial bar chart for visualizing data in a circular layout with concentric bars

**Tags**: chart, radial, circular, progress, data-visualization

**Component Name**: `radial-bar-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| series | `string` | Yes | Series data for radial bars |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "radial-bar-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "series": "example",
    "width": 0,
    "height": 0
  }
}
```

---

### sankey-chart

Sankey diagram for visualizing flow between nodes (rendered as table with bars)

**Tags**: chart, sankey, flow, network, data-visualization

**Component Name**: `sankey-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| nodes | `string` | Yes | Node definitions |
| links | `string` | Yes | Link/flow definitions |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "sankey-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "nodes": "example",
    "links": "example",
    "height": 0
  }
}
```

---

### scatter-chart

Scatter chart for visualizing correlation between two variables with customizable markers

**Tags**: chart, scatter, correlation, xy-plot, data-visualization

**Component Name**: `scatter-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| xAxis | `string` | No | X-axis configuration |
| yAxis | `string` | No | Y-axis configuration |
| series | `string` | Yes | Series data for scatter points |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| grid | `boolean` | No | Show grid lines |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |

#### JSON Schema

```json
{
  "name": "scatter-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "yAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "grid": false,
    "legend": false,
    "margin": 0
  }
}
```

---

### sparkline-chart

Compact sparkline chart for displaying trends in small spaces, perfect for dashboards

**Tags**: chart, sparkline, mini, trend, compact, data-visualization

**Component Name**: `sparkline-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description |
| data | `number` | Yes | Data points |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| color | `string` | No | Line color |
| area | `boolean` | No | Show area under the line |
| showTooltip | `boolean` | No | Show tooltip |
| curve | `'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'` | No | Curve type |

#### JSON Schema

```json
{
  "name": "sparkline-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "data": 0,
    "width": 0,
    "height": 0,
    "color": "example",
    "area": false,
    "showTooltip": false,
    "curve": null
  }
}
```

---

### stacked-area-chart

Stacked area chart

**Tags**: chart

**Component Name**: `stacked-area-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "stacked-area-chart",
  "templateProps": {
    "title": "example",
    "data": [],
    "width": 0,
    "height": 0
  }
}
```

---

### stacked-bar-chart-v2

Stacked bar variant

**Tags**: chart

**Component Name**: `stacked-bar-chart-v2`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| description | `string` | No |  |
| data | `array` | Yes |  |
| width | `number` | No |  |
| height | `number` | No |  |

#### JSON Schema

```json
{
  "name": "stacked-bar-chart-v2",
  "templateProps": {
    "title": "example",
    "description": "example",
    "data": [],
    "width": 0,
    "height": 0
  }
}
```

---

### time-series-chart

Time series line chart for visualizing data over time with multiple series support

**Tags**: chart, time-series, line, temporal, data-visualization

**Component Name**: `time-series-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Optional description text |
| series | `string` | Yes | Series data with time-based data points |
| xAxis | `object` | No | X-axis configuration |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| grid | `boolean` | No | Show grid lines |
| legend | `boolean` | No | Show legend |
| margin | `number` | No | Margin around chart |

#### JSON Schema

```json
{
  "name": "time-series-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "series": "example",
    "xAxis": {},
    "width": 0,
    "height": 0,
    "grid": false,
    "legend": false,
    "margin": 0
  }
}
```

---

### treemap-chart

Tree map chart for displaying hierarchical data with nested rectangles proportional to values

**Tags**: chart, treemap, hierarchy, nested, proportional, data-visualization

**Component Name**: `treemap-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| data | `string` | No | Hierarchical data - can be direct data or series format |
| series | `string` | No | Series format data (alternative to data prop) |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |
| colors | `string` | No | Color scheme |
| showLabels | `boolean` | No | Show labels |

#### JSON Schema

```json
{
  "name": "treemap-chart",
  "templateProps": {
    "title": "example",
    "data": "example",
    "series": "example",
    "width": 0,
    "height": 0,
    "colors": "example",
    "showLabels": false
  }
}
```

---

### waterfall-chart

Waterfall chart for cumulative impact visualization. Shows increases, decreases, and totals.

**Tags**: chart, waterfall, cumulative, financial

**Component Name**: `waterfall-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Chart title |
| description | `string` | No | Chart description |
| xAxis | `string` | No | X-axis categories |
| series | `string` | Yes | Series data with waterfall values |
| width | `number` | No | Chart width |
| height | `number` | No | Chart height |

#### JSON Schema

```json
{
  "name": "waterfall-chart",
  "templateProps": {
    "title": "example",
    "description": "example",
    "xAxis": "example",
    "series": "example",
    "width": 0,
    "height": 0
  }
}
```

---

## Data-display

### avatar

User avatar with status indicators, badges, and multiple sizes

**Tags**: avatar, user, profile, status, badge, image

**Component Name**: `avatar`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| src | `string` | No |  |
| alt | `string` | No |  |
| name | `string` | No |  |
| size | `AvatarSize` | No |  |
| variant | `AvatarVariant` | No |  |
| status | `AvatarStatus` | No |  |
| badge | `string` | No |  |
| fallbackIcon | `string` | No |  |
| onClick | `function` | No |  |

#### JSON Schema

```json
{
  "name": "avatar",
  "templateProps": {
    "src": "example",
    "alt": "example",
    "name": "example",
    "size": null,
    "variant": null,
    "status": null,
    "badge": "example",
    "fallbackIcon": "example",
    "onClick": null
  }
}
```

---

### badge

Status badge with count/text support and multiple variants

**Tags**: badge, status, label, count, notification

**Component Name**: `badge`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | Yes |  |
| variant | `BadgeVariant` | No |  |
| size | `BadgeSize` | No |  |
| count | `number` | No |  |
| showDot | `boolean` | No |  |
| max | `number` | No |  |

#### JSON Schema

```json
{
  "name": "badge",
  "templateProps": {
    "label": "example",
    "variant": null,
    "size": null,
    "count": 0,
    "showDot": false,
    "max": 0
  }
}
```

---

### calendar

Interactive calendar with event support and date selection

**Tags**: calendar, date, events, schedule, picker

**Component Name**: `calendar`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| events | `array` | No |  |
| view | `CalendarView` | No |  |
| selectedDate | `Date` | No |  |
| onDateSelect | `function` | No |  |
| onEventClick | `function` | No |  |
| minDate | `Date` | No |  |
| maxDate | `Date` | No |  |

#### JSON Schema

```json
{
  "name": "calendar",
  "templateProps": {
    "title": "example",
    "events": [],
    "view": null,
    "selectedDate": null,
    "onDateSelect": null,
    "onEventClick": null,
    "minDate": null,
    "maxDate": null
  }
}
```

---

### chip

Removable chips/tags with icons and multiple variants

**Tags**: chip, tag, label, removable, badge

**Component Name**: `chip`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| chips | `array` | Yes |  |
| variant | `ChipVariant` | No |  |
| color | `ChipColor` | No |  |
| size | `ChipSize` | No |  |
| deletable | `boolean` | No |  |
| onDelete | `string` | No |  |
| onClick | `string` | No |  |

#### JSON Schema

```json
{
  "name": "chip",
  "templateProps": {
    "chips": [],
    "variant": null,
    "color": null,
    "size": null,
    "deletable": false,
    "onDelete": "example",
    "onClick": "example"
  }
}
```

---

### data-grid

Advanced data grid with sorting, filtering, pagination, and selection

**Tags**: grid, table, data, sort, filter, pagination, editable

**Component Name**: `data-grid`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| columns | `array` | Yes |  |
| rows | `array` | Yes |  |
| selectable | `boolean` | No |  |
| multiSelect | `boolean` | No |  |
| editable | `boolean` | No |  |
| pagination | `boolean` | No |  |
| pageSize | `number` | No |  |
| onRowClick | `function` | No |  |
| onRowEdit | `function` | No |  |
| onRowSelect | `array` | No |  |

#### JSON Schema

```json
{
  "name": "data-grid",
  "templateProps": {
    "title": "example",
    "columns": [],
    "rows": [],
    "selectable": false,
    "multiSelect": false,
    "editable": false,
    "pagination": false,
    "pageSize": 0,
    "onRowClick": null,
    "onRowEdit": null,
    "onRowSelect": []
  }
}
```

---

### data-table

Advanced data table with sorting, filtering, and search functionality

**Tags**: table, data, grid, sort, search, filter

**Component Name**: `data-table`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| columns | `string` | Yes |  |
| rows | `string` | Yes |  |
| sortable | `boolean` | No |  |
| searchable | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "data-table",
  "templateProps": {
    "title": "example",
    "columns": "example",
    "rows": "example",
    "sortable": false,
    "searchable": false
  }
}
```

---

### gantt

Project timeline visualization with task dependencies and progress

**Tags**: gantt, timeline, project, schedule, tasks, planning

**Component Name**: `gantt`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| tasks | `array` | Yes |  |
| onTaskClick | `function` | No |  |
| viewMode | `'day' | 'week' | 'month'` | No |  |

#### JSON Schema

```json
{
  "name": "gantt",
  "templateProps": {
    "title": "example",
    "tasks": [],
    "onTaskClick": null,
    "viewMode": null
  }
}
```

---

### kanban

Drag-and-drop kanban board with columns and cards

**Tags**: kanban, board, cards, workflow, drag-drop, agile

**Component Name**: `kanban`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| columns | `array` | Yes |  |
| onCardClick | `function` | No |  |
| onCardMove | `string` | No |  |

#### JSON Schema

```json
{
  "name": "kanban",
  "templateProps": {
    "title": "example",
    "columns": [],
    "onCardClick": null,
    "onCardMove": "example"
  }
}
```

---

### list

Flexible list component with selection, icons, and various layouts

**Tags**: list, items, selection, avatar, menu

**Component Name**: `list`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| items | `array` | Yes |  |
| variant | `ListVariant` | No |  |
| density | `ListDensity` | No |  |
| selectable | `boolean` | No |  |
| multiSelect | `boolean` | No |  |
| selectedIds | `string` | No |  |
| onSelect | `string` | No |  |
| onItemClick | `string` | No |  |

#### JSON Schema

```json
{
  "name": "list",
  "templateProps": {
    "title": "example",
    "items": [],
    "variant": null,
    "density": null,
    "selectable": false,
    "multiSelect": false,
    "selectedIds": "example",
    "onSelect": "example",
    "onItemClick": "example"
  }
}
```

---

### list-item

Individual list item with rich content support

**Tags**: list, item, menu, avatar, badge

**Component Name**: `list-item`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| primary | `string` | Yes |  |
| secondary | `string` | No |  |
| tertiary | `string` | No |  |
| icon | `string` | No |  |
| avatar | `string` | No |  |
| badge | `string` | No |  |
| variant | `ListItemVariant` | No |  |
| size | `ListItemSize` | No |  |
| selected | `boolean` | No |  |
| disabled | `boolean` | No |  |
| onClick | `function` | No |  |
| action | `React.ReactNode` | No |  |
| leftContent | `React.ReactNode` | No |  |
| rightContent | `React.ReactNode` | No |  |

#### JSON Schema

```json
{
  "name": "list-item",
  "templateProps": {
    "primary": "example",
    "secondary": "example",
    "tertiary": "example",
    "icon": "example",
    "avatar": "example",
    "badge": "example",
    "variant": null,
    "size": null,
    "selected": false,
    "disabled": false,
    "onClick": null,
    "action": null,
    "leftContent": null,
    "rightContent": null
  }
}
```

---

### mind-map

Interactive mind map visualization with expandable nodes

**Tags**: mindmap, diagram, visualization, hierarchy, brainstorm

**Component Name**: `mind-map`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `MindMapNode` | Yes |  |
| onNodeClick | `function` | No |  |
| layout | `'radial' | 'tree'` | No |  |

#### JSON Schema

```json
{
  "name": "mind-map",
  "templateProps": {
    "title": "example",
    "data": null,
    "onNodeClick": null,
    "layout": null
  }
}
```

---

### org-chart

Organizational hierarchy chart with employee details

**Tags**: organization, chart, hierarchy, team, structure, employees

**Component Name**: `org-chart`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `OrgNode` | Yes |  |
| onNodeClick | `function` | No |  |
| showDetails | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "org-chart",
  "templateProps": {
    "title": "example",
    "data": null,
    "onNodeClick": null,
    "showDetails": false
  }
}
```

---

### timeline

Vertical and horizontal timeline with status indicators

**Tags**: timeline, chronological, history, steps, progress

**Component Name**: `timeline`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| items | `array` | Yes |  |
| orientation | `TimelineOrientation` | No |  |
| align | `TimelineAlign` | No |  |
| showConnector | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "timeline",
  "templateProps": {
    "title": "example",
    "items": [],
    "orientation": null,
    "align": null,
    "showConnector": false
  }
}
```

---

### tree-view

Hierarchical tree view with expand/collapse and selection

**Tags**: tree, hierarchy, folder, nested, expandable

**Component Name**: `tree-view`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| data | `array` | Yes |  |
| defaultExpandAll | `boolean` | No |  |
| selectable | `boolean` | No |  |
| multiSelect | `boolean` | No |  |
| showLines | `boolean` | No |  |
| onNodeClick | `function` | No |  |
| onNodeSelect | `array` | No |  |

#### JSON Schema

```json
{
  "name": "tree-view",
  "templateProps": {
    "title": "example",
    "data": [],
    "defaultExpandAll": false,
    "selectable": false,
    "multiSelect": false,
    "showLines": false,
    "onNodeClick": null,
    "onNodeSelect": []
  }
}
```

---

### virtualized-table

High-performance table with virtual scrolling for large datasets

**Tags**: table, virtual, performance, large-data, scroll, optimized

**Component Name**: `virtualized-table`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| columns | `array` | Yes |  |
| rows | `array` | Yes |  |
| rowHeight | `number` | No |  |
| overscan | `number` | No |  |
| onRowClick | `function` | No |  |
| stickyHeader | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "virtualized-table",
  "templateProps": {
    "title": "example",
    "columns": [],
    "rows": [],
    "rowHeight": 0,
    "overscan": 0,
    "onRowClick": null,
    "stickyHeader": false
  }
}
```

---

## Inputs

### autocomplete

Autocomplete input with dropdown suggestions, keyboard navigation, and filtering. Supports custom options and validation.

**Tags**: ui, input, form, autocomplete, search, suggestions

**Component Name**: `autocomplete`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| options | `array` | No |  |
| items | `array` | No |  |
| suggestions | `array` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| filterOnType | `boolean` | No |  |
| caseSensitive | `boolean` | No |  |
| onChange | `string` | No |  |
| onInputChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "autocomplete",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "options": [],
    "items": [],
    "suggestions": [],
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "filterOnType": false,
    "caseSensitive": false,
    "onChange": "example",
    "onInputChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### checkbox

Checkbox input component with customizable colors, sizes, and validation. Supports labels and helper text.

**Tags**: ui, input, form, checkbox, toggle

**Component Name**: `checkbox`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| text | `string` | No |  |
| checked | `boolean` | No |  |
| defaultChecked | `boolean` | No |  |
| value | `string` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| onChange | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "checkbox",
  "templateProps": {
    "label": "example",
    "text": "example",
    "checked": false,
    "defaultChecked": false,
    "value": "example",
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "color": null,
    "size": null,
    "onChange": false
  }
}
```

---

### color-picker

Color picker with preview, text input, and preset color palette. Supports hex color values and validation.

**Tags**: ui, input, form, color, picker, palette

**Component Name**: `color-picker`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| showPreview | `boolean` | No |  |
| showInput | `boolean` | No |  |
| presetColors | `string` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "color-picker",
  "templateProps": {
    "label": "example",
    "value": "example",
    "defaultValue": "example",
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "showPreview": false,
    "showInput": false,
    "presetColors": "example",
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### date-picker

Date picker component with calendar icon, min/max date validation, and various styling options.

**Tags**: ui, input, form, date, calendar

**Component Name**: `date-picker`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| min | `string` | No |  |
| max | `string` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| showCalendarIcon | `boolean` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "date-picker",
  "templateProps": {
    "label": "example",
    "value": "example",
    "defaultValue": "example",
    "min": "example",
    "max": "example",
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "showCalendarIcon": false,
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### datetime-picker

DateTime picker component for selecting both date and time with validation and styling options.

**Tags**: ui, input, form, datetime, calendar, time

**Component Name**: `datetime-picker`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| min | `string` | No |  |
| max | `string` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| showIcon | `boolean` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "datetime-picker",
  "templateProps": {
    "label": "example",
    "value": "example",
    "defaultValue": "example",
    "min": "example",
    "max": "example",
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "showIcon": false,
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### file-picker

File upload component with drag-and-drop support, file validation, size limits, and preview. Supports single or multiple files.

**Tags**: ui, input, form, file, upload, drag-drop

**Component Name**: `file-picker`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| accept | `string` | No |  |
| multiple | `boolean` | No |  |
| maxSize | `number` | No |  |
| maxFiles | `number` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| showFileList | `boolean` | No |  |
| dragAndDrop | `boolean` | No |  |
| variant | `'button' | 'dropzone'` | No |  |
| onChange | `function` | No |  |
| onError | `string` | No |  |

#### JSON Schema

```json
{
  "name": "file-picker",
  "templateProps": {
    "label": "example",
    "accept": "example",
    "multiple": false,
    "maxSize": 0,
    "maxFiles": 0,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "showFileList": false,
    "dragAndDrop": false,
    "variant": null,
    "onChange": null,
    "onError": "example"
  }
}
```

---

### multi-select

Multi-select dropdown with checkboxes, tags display, and max selection limit. Supports validation and styling variants.

**Tags**: ui, input, form, select, multiselect, dropdown

**Component Name**: `multi-select`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| options | `array` | No |  |
| items | `array` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| maxSelections | `number` | No |  |
| showCheckboxes | `boolean` | No |  |
| onChange | `string` | No |  |

#### JSON Schema

```json
{
  "name": "multi-select",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "options": [],
    "items": [],
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "maxSelections": 0,
    "showCheckboxes": false,
    "onChange": "example"
  }
}
```

---

### otp-input

OTP (One-Time Password) input with auto-focus, paste support, and keyboard navigation. Supports masking and validation.

**Tags**: ui, input, form, otp, verification, code

**Component Name**: `otp-input`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| length | `number` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| type | `number` | No |  |
| mask | `boolean` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| autoFocus | `boolean` | No |  |
| onChange | `string` | No |  |
| onComplete | `string` | No |  |

#### JSON Schema

```json
{
  "name": "otp-input",
  "templateProps": {
    "label": "example",
    "length": 0,
    "value": "example",
    "defaultValue": "example",
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "type": 0,
    "mask": false,
    "size": null,
    "autoFocus": false,
    "onChange": "example",
    "onComplete": "example"
  }
}
```

---

### radio

Radio button group component with customizable colors, sizes, and orientations. Supports validation and helper text.

**Tags**: ui, input, form, radio, selection

**Component Name**: `radio`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| name | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| options | `array` | No |  |
| items | `array` | No |  |
| choices | `array` | No |  |
| orientation | `'horizontal' | 'vertical'` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| onChange | `string` | No |  |

#### JSON Schema

```json
{
  "name": "radio",
  "templateProps": {
    "label": "example",
    "name": "example",
    "value": "example",
    "defaultValue": "example",
    "options": [],
    "items": [],
    "choices": [],
    "orientation": null,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "color": null,
    "size": null,
    "onChange": "example"
  }
}
```

---

### range-slider

Dual-handle range slider for selecting a range between min and max values. Supports steps, colors, and value display.

**Tags**: ui, input, form, slider, range, dual

**Component Name**: `range-slider`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `number` | No |  |
| defaultValue | `number` | No |  |
| min | `number` | No |  |
| max | `number` | No |  |
| step | `number` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| showValues | `boolean` | No |  |
| showLabels | `boolean` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| helperText | `string` | No |  |
| error | `boolean` | No |  |
| errorMessage | `string` | No |  |
| onChange | `number` | No |  |
| onChangeCommitted | `number` | No |  |

#### JSON Schema

```json
{
  "name": "range-slider",
  "templateProps": {
    "label": "example",
    "value": 0,
    "defaultValue": 0,
    "min": 0,
    "max": 0,
    "step": 0,
    "disabled": false,
    "required": false,
    "showValues": false,
    "showLabels": false,
    "color": null,
    "size": null,
    "helperText": "example",
    "error": false,
    "errorMessage": "example",
    "onChange": 0,
    "onChangeCommitted": 0
  }
}
```

---

### rating

Rating component with customizable icons (star, heart, circle), precision, and max value. Supports hover effects and validation.

**Tags**: ui, input, form, rating, stars, review

**Component Name**: `rating`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `number` | No |  |
| defaultValue | `number` | No |  |
| max | `number` | No |  |
| precision | `number` | No |  |
| disabled | `boolean` | No |  |
| readOnly | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| color | `'primary' | 'secondary' | 'warning' | 'error'` | No |  |
| icon | `'star' | 'heart' | 'circle'` | No |  |
| showValue | `boolean` | No |  |
| onChange | `number` | No |  |

#### JSON Schema

```json
{
  "name": "rating",
  "templateProps": {
    "label": "example",
    "value": 0,
    "defaultValue": 0,
    "max": 0,
    "precision": 0,
    "disabled": false,
    "readOnly": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "size": null,
    "color": null,
    "icon": null,
    "showValue": false,
    "onChange": 0
  }
}
```

---

### rich-text-editor

Rich text editor with formatting toolbar, text alignment, lists, and basic styling options. Supports HTML content.

**Tags**: ui, input, form, editor, richtext, wysiwyg

**Component Name**: `rich-text-editor`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| placeholder | `string` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| minHeight | `string` | No |  |
| maxHeight | `string` | No |  |
| showToolbar | `boolean` | No |  |
| onChange | `string` | No |  |

#### JSON Schema

```json
{
  "name": "rich-text-editor",
  "templateProps": {
    "label": "example",
    "value": "example",
    "defaultValue": "example",
    "placeholder": "example",
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "minHeight": "example",
    "maxHeight": "example",
    "showToolbar": false,
    "onChange": "example"
  }
}
```

---

### search-input

Search input component with clear button, loading state, and search icon. Supports Enter key to search.

**Tags**: ui, input, form, search, filter

**Component Name**: `search-input`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| loading | `boolean` | No |  |
| showClearButton | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| onChange | `string` | No |  |
| onSearch | `string` | No |  |
| onClear | `function` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "search-input",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "loading": false,
    "showClearButton": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "onChange": "example",
    "onSearch": "example",
    "onClear": null,
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### select

Select dropdown component with options, validation, and styling variants. Supports labels and helper text.

**Tags**: ui, input, form, select, dropdown

**Component Name**: `select`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| options | `array` | No |  |
| items | `array` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| onChange | `string` | No |  |

#### JSON Schema

```json
{
  "name": "select",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "options": [],
    "items": [],
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "onChange": "example"
  }
}
```

---

### slider

Range slider component with customizable min/max values, steps, marks, and colors. Supports validation and real-time value display.

**Tags**: ui, input, form, slider, range

**Component Name**: `slider`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `number` | No |  |
| defaultValue | `number` | No |  |
| min | `number` | No |  |
| max | `number` | No |  |
| step | `number` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| showValue | `boolean` | No |  |
| showMarks | `boolean` | No |  |
| marks | `string` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| helperText | `string` | No |  |
| error | `boolean` | No |  |
| errorMessage | `string` | No |  |
| onChange | `number` | No |  |
| onChangeCommitted | `number` | No |  |

#### JSON Schema

```json
{
  "name": "slider",
  "templateProps": {
    "label": "example",
    "value": 0,
    "defaultValue": 0,
    "min": 0,
    "max": 0,
    "step": 0,
    "disabled": false,
    "required": false,
    "showValue": false,
    "showMarks": false,
    "marks": "example",
    "color": null,
    "size": null,
    "helperText": "example",
    "error": false,
    "errorMessage": "example",
    "onChange": 0,
    "onChangeCommitted": 0
  }
}
```

---

### switch

Toggle switch component with customizable colors, sizes, and label positioning. Modern on/off control.

**Tags**: ui, input, form, switch, toggle

**Component Name**: `switch`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| text | `string` | No |  |
| checked | `boolean` | No |  |
| defaultChecked | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| labelPosition | `'left' | 'right'` | No |  |
| onChange | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "switch",
  "templateProps": {
    "label": "example",
    "text": "example",
    "checked": false,
    "defaultChecked": false,
    "disabled": false,
    "required": false,
    "color": null,
    "size": null,
    "labelPosition": null,
    "onChange": false
  }
}
```

---

### tag-input

Tag input component for adding and removing tags with keyboard support, validation, and max limits. Supports custom separators.

**Tags**: ui, input, form, tags, chips, labels

**Component Name**: `tag-input`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| tags | `string` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| maxTags | `number` | No |  |
| allowDuplicates | `boolean` | No |  |
| separator | `string` | No |  |
| validateTag | `string` | No |  |
| onChange | `string` | No |  |
| onAdd | `string` | No |  |
| onRemove | `string` | No |  |

#### JSON Schema

```json
{
  "name": "tag-input",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "tags": "example",
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "maxTags": 0,
    "allowDuplicates": false,
    "separator": "example",
    "validateTag": "example",
    "onChange": "example",
    "onAdd": "example",
    "onRemove": "example"
  }
}
```

---

### text-area

Multi-line text input component with auto-resize, character count, and validation. Supports various styles and sizes.

**Tags**: ui, input, form, textarea, multiline

**Component Name**: `text-area`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| rows | `number` | No |  |
| minRows | `number` | No |  |
| maxRows | `number` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| readOnly | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| maxLength | `number` | No |  |
| showCharCount | `boolean` | No |  |
| autoResize | `boolean` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "text-area",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "rows": 0,
    "minRows": 0,
    "maxRows": 0,
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "readOnly": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "maxLength": 0,
    "showCharCount": false,
    "autoResize": false,
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### text-field

Text input field with support for labels, validation, prefixes, suffixes, and various styles. Supports multiple input types.

**Tags**: ui, input, form, text, field

**Component Name**: `text-field`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| placeholder | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| type | `number` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| readOnly | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| prefix | `string` | No |  |
| suffix | `string` | No |  |
| icon | `string` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "text-field",
  "templateProps": {
    "label": "example",
    "placeholder": "example",
    "value": "example",
    "defaultValue": "example",
    "type": 0,
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "readOnly": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "prefix": "example",
    "suffix": "example",
    "icon": "example",
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

### time-picker

Time picker component with clock icon, min/max time validation, and step support.

**Tags**: ui, input, form, time, clock

**Component Name**: `time-picker`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| value | `string` | No |  |
| defaultValue | `string` | No |  |
| min | `string` | No |  |
| max | `string` | No |  |
| step | `number` | No |  |
| variant | `'outlined' | 'filled' | 'standard'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| fullWidth | `boolean` | No |  |
| disabled | `boolean` | No |  |
| required | `boolean` | No |  |
| error | `boolean` | No |  |
| helperText | `string` | No |  |
| errorMessage | `string` | No |  |
| showClockIcon | `boolean` | No |  |
| onChange | `string` | No |  |
| onBlur | `function` | No |  |
| onFocus | `function` | No |  |

#### JSON Schema

```json
{
  "name": "time-picker",
  "templateProps": {
    "label": "example",
    "value": "example",
    "defaultValue": "example",
    "min": "example",
    "max": "example",
    "step": 0,
    "variant": null,
    "size": null,
    "fullWidth": false,
    "disabled": false,
    "required": false,
    "error": false,
    "helperText": "example",
    "errorMessage": "example",
    "showClockIcon": false,
    "onChange": "example",
    "onBlur": null,
    "onFocus": null
  }
}
```

---

## Layout

### accordion

Expandable accordion component with customizable items, icons, and support for single or multiple expanded sections.

**Tags**: layout, accordion, expandable, collapsible

**Component Name**: `accordion`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | `array` | No | Accordion items |
| multiple | `boolean` | No | Allow multiple items to be expanded at once |
| variant | `'default' | 'bordered' | 'elevated'` | No | Variant style |
| size | `'small' | 'medium' | 'large'` | No | Size variant |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "accordion",
  "templateProps": {
    "items": [],
    "multiple": false,
    "variant": null,
    "size": null,
    "renderChild": null
  }
}
```

---

### appbar

Top application bar with title, subtitle, logo, and customizable action buttons.

**Tags**: layout, navigation, appbar, header, toolbar

**Component Name**: `appbar`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Title text |
| subtitle | `string` | No | Subtitle text |
| logo | `string` | No | Logo/icon |
| actions | `array` | No | Action buttons |
| position | `'static' | 'fixed' | 'sticky'` | No | Position |
| variant | `'default' | 'elevated' | 'transparent'` | No | Variant style |
| size | `'small' | 'medium' | 'large'` | No | Size |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "appbar",
  "templateProps": {
    "title": "example",
    "subtitle": "example",
    "logo": "example",
    "actions": [],
    "position": null,
    "variant": null,
    "size": null,
    "children": [],
    "renderChild": null
  }
}
```

---

### bottom-navigation

Bottom navigation bar for mobile-friendly navigation with icons and optional labels.

**Tags**: layout, navigation, bottom-nav, mobile, footer

**Component Name**: `bottom-navigation`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | `array` | No | Navigation items |
| defaultValue | `string` | No | Default selected value |
| showLabels | `boolean` | No | Show labels |
| variant | `'default' | 'elevated'` | No | Variant style |
| activeColor | `'primary' | 'accent' | 'secondary'` | No | Color when active |

#### JSON Schema

```json
{
  "name": "bottom-navigation",
  "templateProps": {
    "items": [],
    "defaultValue": "example",
    "showLabels": false,
    "variant": null,
    "activeColor": null
  }
}
```

---

### breadcrumbs

Navigation breadcrumb trail showing the current location within a hierarchy, with customizable separators and collapse options.

**Tags**: navigation, breadcrumbs, layout, hierarchy

**Component Name**: `breadcrumbs`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | `array` | No | Array of breadcrumb items |
| separator | `'slash' | 'chevron' | 'arrow' | 'dot'` | No | Separator between breadcrumbs |
| size | `'small' | 'medium' | 'large'` | No | Size variant |
| maxItems | `number` | No | Maximum items to show before collapsing |
| showHome | `boolean` | No | Show home icon |

#### JSON Schema

```json
{
  "name": "breadcrumbs",
  "templateProps": {
    "items": [],
    "separator": null,
    "size": null,
    "maxItems": 0,
    "showHome": false
  }
}
```

---

### container

Centered container with configurable max-width, padding, and optional background/border/shadow styling.

**Tags**: layout, container, wrapper, responsive

**Component Name**: `container`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| maxWidth | `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` | No | Maximum width of the container |
| padding | `'none' | 'small' | 'medium' | 'large'` | No | Padding inside the container |
| center | `boolean` | No | Center the container horizontally |
| background | `boolean` | No | Add background |
| border | `boolean` | No | Add border |
| shadow | `boolean` | No | Add shadow |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "container",
  "templateProps": {
    "maxWidth": null,
    "padding": null,
    "center": false,
    "background": false,
    "border": false,
    "shadow": false,
    "children": [],
    "renderChild": null
  }
}
```

---

### divider

Visual separator with optional label, supporting horizontal and vertical orientations with customizable styles.

**Tags**: layout, divider, separator, hr

**Component Name**: `divider`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| orientation | `'horizontal' | 'vertical'` | No | Orientation of the divider |
| label | `string` | No | Optional label text |
| labelPosition | `'left' | 'center' | 'right'` | No | Label position |
| variant | `'solid' | 'dashed' | 'dotted'` | No | Variant style |
| thickness | `'thin' | 'medium' | 'thick'` | No | Thickness |
| spacing | `'none' | 'small' | 'medium' | 'large'` | No | Spacing around the divider |
| color | `'default' | 'primary' | 'secondary'` | No | Color variant |

#### JSON Schema

```json
{
  "name": "divider",
  "templateProps": {
    "orientation": null,
    "label": "example",
    "labelPosition": null,
    "variant": null,
    "thickness": null,
    "spacing": null,
    "color": null
  }
}
```

---

### drawer

Side drawer/panel that slides in from any edge, with customizable size and optional backdrop.

**Tags**: layout, navigation, drawer, panel, sidebar

**Component Name**: `drawer`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Title of the drawer |
| position | `'left' | 'right' | 'top' | 'bottom'` | No | Position of the drawer |
| defaultOpen | `boolean` | No | Default open state |
| size | `'small' | 'medium' | 'large' | 'full'` | No | Width (for left/right) or height (for top/bottom) |
| variant | `'default' | 'elevated' | 'overlay'` | No | Variant style |
| backdrop | `boolean` | No | Show backdrop |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "drawer",
  "templateProps": {
    "title": "example",
    "position": null,
    "defaultOpen": false,
    "size": null,
    "variant": null,
    "backdrop": false,
    "children": [],
    "renderChild": null
  }
}
```

---

### flexbox

Flexible box layout with full control over direction, justify, align, gap, and wrap properties.

**Tags**: layout, flex, flexbox, responsive

**Component Name**: `flexbox`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| direction | `'row' | 'row-reverse' | 'column' | 'column-reverse'` | No | Flex direction |
| justify | `'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'` | No | Justify content |
| align | `'start' | 'end' | 'center' | 'baseline' | 'stretch'` | No | Align items |
| gap | `'none' | 'small' | 'medium' | 'large' | 'xlarge'` | No | Gap between items |
| wrap | `'nowrap' | 'wrap' | 'wrap-reverse'` | No | Wrap items |
| fullWidth | `boolean` | No | Full width |
| fullHeight | `boolean` | No | Full height |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "flexbox",
  "templateProps": {
    "direction": null,
    "justify": null,
    "align": null,
    "gap": null,
    "wrap": null,
    "fullWidth": false,
    "fullHeight": false,
    "children": [],
    "renderChild": null
  }
}
```

---

### grid

Responsive grid system with configurable columns, gap, and alignment. Supports auto-fit for dynamic column sizing.

**Tags**: layout, grid, responsive, container

**Component Name**: `grid`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| columns | `1 | 2 | 3 | 4 | 5 | 6 | 12` | No | Number of columns in the grid |
| gap | `'none' | 'small' | 'medium' | 'large' | 'xlarge'` | No | Gap between grid items |
| responsive | `boolean` | No | Responsive behavior |
| alignItems | `'start' | 'center' | 'end' | 'stretch'` | No | Alignment of items |
| justifyItems | `'start' | 'center' | 'end' | 'stretch'` | No | Justify content |
| autoFit | `boolean` | No | Auto-fit columns (responsive) |
| minColumnWidth | `string` | No | Minimum column width for auto-fit |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "grid",
  "templateProps": {
    "columns": null,
    "gap": null,
    "responsive": false,
    "alignItems": null,
    "justifyItems": null,
    "autoFit": false,
    "minColumnWidth": "example",
    "children": [],
    "renderChild": null
  }
}
```

---

### masonry

Masonry grid layout that distributes items across columns with dynamic heights, perfect for image galleries and card layouts.

**Tags**: layout, masonry, grid, gallery, responsive

**Component Name**: `masonry`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| columns | `2 | 3 | 4 | 5 | 6` | No | Number of columns |
| gap | `'none' | 'small' | 'medium' | 'large' | 'xlarge'` | No | Gap between items |
| responsive | `boolean` | No | Responsive behavior |
| breakAt | `number` | No | Breakpoint configuration for responsive columns |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "masonry",
  "templateProps": {
    "columns": null,
    "gap": null,
    "responsive": false,
    "breakAt": 0,
    "children": [],
    "renderChild": null
  }
}
```

---

### section

Content section with optional header, title, subtitle, and customizable styling for organizing page content.

**Tags**: layout, section, container, content

**Component Name**: `section`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Section title |
| subtitle | `string` | No | Section subtitle |
| icon | `string` | No | Section header icon |
| padding | `'none' | 'small' | 'medium' | 'large'` | No | Padding inside the section |
| variant | `'default' | 'bordered' | 'elevated' | 'filled'` | No | Variant style |
| background | `'default' | 'surface' | 'elevated' | 'accent'` | No | Background color |
| divider | `boolean` | No | Show divider after header |
| fullWidth | `boolean` | No | Full width section |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "section",
  "templateProps": {
    "title": "example",
    "subtitle": "example",
    "icon": "example",
    "padding": null,
    "variant": null,
    "background": null,
    "divider": false,
    "fullWidth": false,
    "children": [],
    "renderChild": null
  }
}
```

---

### sidebar

Sidebar navigation with nested items, badges, icons, and collapsible functionality.

**Tags**: layout, navigation, sidebar, menu, nav

**Component Name**: `sidebar`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Title of the sidebar |
| logo | `string` | No | Logo/icon |
| items | `array` | No | Navigation items |
| width | `'small' | 'medium' | 'large'` | No | Width |
| collapsible | `boolean` | No | Collapsible sidebar |
| defaultCollapsed | `boolean` | No | Default collapsed state |
| variant | `'default' | 'elevated' | 'bordered'` | No | Variant style |
| position | `'fixed' | 'sticky' | 'static'` | No | Position |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "sidebar",
  "templateProps": {
    "title": "example",
    "logo": "example",
    "items": [],
    "width": null,
    "collapsible": false,
    "defaultCollapsed": false,
    "variant": null,
    "position": null,
    "children": [],
    "renderChild": null
  }
}
```

---

### spacer

Flexible spacing component for adding vertical or horizontal space between elements, with optional visual indicators.

**Tags**: layout, spacer, spacing, margin, padding

**Component Name**: `spacer`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| size | `'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'custom'` | No | Size of the spacer |
| customSize | `number` | No | Custom size in pixels (when size is 'custom') |
| orientation | `'horizontal' | 'vertical'` | No | Orientation |
| flexible | `boolean` | No | Flexible spacer (grows to fill available space) |
| showIndicator | `boolean` | No | Show visual indicator (for debugging/demo) |

#### JSON Schema

```json
{
  "name": "spacer",
  "templateProps": {
    "size": null,
    "customSize": 0,
    "orientation": null,
    "flexible": false,
    "showIndicator": false
  }
}
```

---

### stack

Vertical or horizontal stacking layout with configurable spacing, alignment, and optional dividers between items.

**Tags**: layout, stack, flex, container

**Component Name**: `stack`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| direction | `'vertical' | 'horizontal'` | No | Stack direction |
| spacing | `'none' | 'small' | 'medium' | 'large' | 'xlarge'` | No | Spacing between items |
| align | `'start' | 'center' | 'end' | 'stretch'` | No | Alignment of items along the cross axis |
| justify | `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'` | No | Justification of items along the main axis |
| wrap | `boolean` | No | Wrap items to next line |
| divider | `boolean` | No | Divider between items |
| fullWidth | `boolean` | No | Full width |
| children | `array` | No | Child components |
| renderChild | `function` | No | Function to render child components |

#### JSON Schema

```json
{
  "name": "stack",
  "templateProps": {
    "direction": null,
    "spacing": null,
    "align": null,
    "justify": null,
    "wrap": false,
    "divider": false,
    "fullWidth": false,
    "children": [],
    "renderChild": null
  }
}
```

---

### stepper

Step-by-step progress indicator showing workflow stages, supporting both horizontal and vertical orientations.

**Tags**: layout, stepper, progress, wizard, navigation

**Component Name**: `stepper`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| steps | `array` | No | Array of steps |
| activeStep | `number` | No | Current active step index |
| orientation | `'horizontal' | 'vertical'` | No | Orientation |
| showNumbers | `boolean` | No | Show step numbers |
| variant | `'default' | 'outlined' | 'simple'` | No | Variant style |
| size | `'small' | 'medium' | 'large'` | No | Size |

#### JSON Schema

```json
{
  "name": "stepper",
  "templateProps": {
    "steps": [],
    "activeStep": 0,
    "orientation": null,
    "showNumbers": false,
    "variant": null,
    "size": null
  }
}
```

---

## Navigation

### button

Interactive button component with multiple variants and sizes

**Tags**: ui, interactive, navigation

**Component Name**: `button`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | `string` | No |  |
| text | `string` | No |  |
| variant | `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| disabled | `boolean` | No |  |
| icon | `string` | No |  |
| iconPosition | `'left' | 'right'` | No |  |
| fullWidth | `boolean` | No |  |
| onClick | `function` | No |  |

#### JSON Schema

```json
{
  "name": "button",
  "templateProps": {
    "label": "example",
    "text": "example",
    "variant": null,
    "size": null,
    "disabled": false,
    "icon": "example",
    "iconPosition": null,
    "fullWidth": false,
    "onClick": null
  }
}
```

---

### menu

Menu component with dropdown support. Use trigger prop for dropdown menus. Supports icons, dividers, danger variants, and multiple positions.

**Tags**: ui, navigation, interactive, dropdown, menu, actions

**Component Name**: `menu`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | `array` | No |  |
| menuItems | `array` | No |  |
| title | `string` | No |  |
| trigger | `string` | No |  |
| triggerVariant | `'primary' | 'secondary' | 'ghost'` | No |  |
| position | `'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'` | No |  |
| closeOnSelect | `boolean` | No |  |
| variant | `'default' | 'compact' | 'bordered'` | No |  |

#### JSON Schema

```json
{
  "name": "menu",
  "templateProps": {
    "items": [],
    "menuItems": [],
    "title": "example",
    "trigger": "example",
    "triggerVariant": null,
    "position": null,
    "closeOnSelect": false,
    "variant": null
  }
}
```

---

### pagination

Page pagination component with customizable controls and variants

**Tags**: ui, navigation, interactive

**Component Name**: `pagination`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| totalPages | `number` | No |  |
| pageCount | `number` | No |  |
| currentPage | `number` | No |  |
| defaultPage | `number` | No |  |
| showFirstLast | `boolean` | No |  |
| showPrevNext | `boolean` | No |  |
| siblingCount | `number` | No |  |
| variant | `'default' | 'outlined' | 'rounded'` | No |  |
| onChange | `number` | No |  |

#### JSON Schema

```json
{
  "name": "pagination",
  "templateProps": {
    "totalPages": 0,
    "pageCount": 0,
    "currentPage": 0,
    "defaultPage": 0,
    "showFirstLast": false,
    "showPrevNext": false,
    "siblingCount": 0,
    "variant": null,
    "onChange": 0
  }
}
```

---

### tabs

Tabbed navigation component with multiple variants and orientation support

**Tags**: ui, navigation, interactive

**Component Name**: `tabs`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| tabs | `array` | No |  |
| items | `array` | No |  |
| defaultTab | `string` | No |  |
| variant | `'default' | 'pills' | 'underline'` | No |  |
| orientation | `'horizontal' | 'vertical'` | No |  |

#### JSON Schema

```json
{
  "name": "tabs",
  "templateProps": {
    "tabs": [],
    "items": [],
    "defaultTab": "example",
    "variant": null,
    "orientation": null
  }
}
```

---

## Feedback

### alert

Alert message component with multiple severity levels and variants

**Tags**: ui, feedback, notification

**Component Name**: `alert`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| message | `string` | No |  |
| title | `string` | No |  |
| description | `string` | No |  |
| severity | `'info' | 'success' | 'warning' | 'error'` | No |  |
| variant | `'filled' | 'outlined' | 'standard'` | No |  |
| icon | `string` | No |  |
| closable | `boolean` | No |  |
| onClose | `function` | No |  |

#### JSON Schema

```json
{
  "name": "alert",
  "templateProps": {
    "message": "example",
    "title": "example",
    "description": "example",
    "severity": null,
    "variant": null,
    "icon": "example",
    "closable": false,
    "onClose": null
  }
}
```

---

### backdrop

Backdrop overlay component for modals and dialogs. Provides a darkened, optionally blurred background layer with customizable opacity.

**Tags**: ui, feedback, backdrop, overlay, modal, background

**Component Name**: `backdrop`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| open | `boolean` | No |  |
| isOpen | `boolean` | No |  |
| visible | `boolean` | No |  |
| opacity | `number` | No |  |
| blur | `boolean` | No |  |
| blurAmount | `'none' | 'sm' | 'md' | 'lg' | 'xl'` | No |  |
| onClick | `function` | No |  |
| onClose | `function` | No |  |
| children | `React.ReactNode` | No |  |
| content | `string` | No |  |
| message | `string` | No |  |

#### JSON Schema

```json
{
  "name": "backdrop",
  "templateProps": {
    "open": false,
    "isOpen": false,
    "visible": false,
    "opacity": 0,
    "blur": false,
    "blurAmount": null,
    "onClick": null,
    "onClose": null,
    "children": null,
    "content": "example",
    "message": "example"
  }
}
```

---

### circular-progress

Circular progress indicator with customizable size, color, and value display. Supports determinate and indeterminate modes.

**Tags**: ui, feedback, progress, loading, spinner, circular

**Component Name**: `circular-progress`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| value | `number` | No |  |
| percentage | `number` | No |  |
| progress | `number` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| variant | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| thickness | `number` | No |  |
| showValue | `boolean` | No |  |
| label | `string` | No |  |
| indeterminate | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "circular-progress",
  "templateProps": {
    "value": 0,
    "percentage": 0,
    "progress": 0,
    "size": null,
    "color": null,
    "variant": null,
    "thickness": 0,
    "showValue": false,
    "label": "example",
    "indeterminate": false
  }
}
```

---

### linear-progress

Linear progress bar with customizable colors, sizes, and animations. Supports determinate, indeterminate, striped, and animated variants.

**Tags**: ui, feedback, progress, loading, bar, linear

**Component Name**: `linear-progress`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| value | `number` | No |  |
| percentage | `number` | No |  |
| progress | `number` | No |  |
| max | `number` | No |  |
| color | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| variant | `'primary' | 'secondary' | 'success' | 'warning' | 'error'` | No |  |
| size | `'small' | 'medium' | 'large'` | No |  |
| showValue | `boolean` | No |  |
| label | `string` | No |  |
| indeterminate | `boolean` | No |  |
| striped | `boolean` | No |  |
| animated | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "linear-progress",
  "templateProps": {
    "value": 0,
    "percentage": 0,
    "progress": 0,
    "max": 0,
    "color": null,
    "variant": null,
    "size": null,
    "showValue": false,
    "label": "example",
    "indeterminate": false,
    "striped": false,
    "animated": false
  }
}
```

---

### modal

Modal dialog component with customizable size, header, content, and actions. Includes backdrop and close functionality.

**Tags**: ui, feedback, dialog, overlay, popup

**Component Name**: `modal`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| content | `string` | No |  |
| message | `string` | No |  |
| description | `string` | No |  |
| open | `boolean` | No |  |
| isOpen | `boolean` | No |  |
| visible | `boolean` | No |  |
| size | `'small' | 'medium' | 'large' | 'fullscreen'` | No |  |
| showCloseButton | `boolean` | No |  |
| closable | `boolean` | No |  |
| onClose | `function` | No |  |
| footer | `string` | No |  |
| actions | `string` | No |  |

#### JSON Schema

```json
{
  "name": "modal",
  "templateProps": {
    "title": "example",
    "content": "example",
    "message": "example",
    "description": "example",
    "open": false,
    "isOpen": false,
    "visible": false,
    "size": null,
    "showCloseButton": false,
    "closable": false,
    "onClose": null,
    "footer": "example",
    "actions": "example"
  }
}
```

---

### notification

Notification alert component for displaying rich notifications with title, message, icon, and optional actions.

**Tags**: ui, feedback, notification, alert, message, toast

**Component Name**: `notification`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No |  |
| message | `string` | No |  |
| text | `string` | No |  |
| content | `string` | No |  |
| description | `string` | No |  |
| type | `'info' | 'success' | 'warning' | 'error'` | No |  |
| severity | `'info' | 'success' | 'warning' | 'error'` | No |  |
| icon | `string` | No |  |
| position | `'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` | No |  |
| duration | `number` | No |  |
| autoHide | `boolean` | No |  |
| closable | `boolean` | No |  |
| onClose | `function` | No |  |
| action | `string` | No |  |

#### JSON Schema

```json
{
  "name": "notification",
  "templateProps": {
    "title": "example",
    "message": "example",
    "text": "example",
    "content": "example",
    "description": "example",
    "type": null,
    "severity": null,
    "icon": "example",
    "position": null,
    "duration": 0,
    "autoHide": false,
    "closable": false,
    "onClose": null,
    "action": "example"
  }
}
```

---

### popover

Popover component for displaying rich contextual content on click. Attach to any element via label/trigger prop. Supports titles, positioning, and arrows.

**Tags**: ui, feedback, popover, menu, dropdown, overlay, help

**Component Name**: `popover`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| content | `string` | No |  |
| text | `string` | No |  |
| message | `string` | No |  |
| title | `string` | No |  |
| trigger | `string` | No |  |
| label | `string` | No |  |
| position | `'top' | 'bottom' | 'left' | 'right'` | No |  |
| placement | `'top' | 'bottom' | 'left' | 'right'` | No |  |
| arrow | `boolean` | No |  |
| closeOnClick | `boolean` | No |  |

#### JSON Schema

```json
{
  "name": "popover",
  "templateProps": {
    "content": "example",
    "text": "example",
    "message": "example",
    "title": "example",
    "trigger": "example",
    "label": "example",
    "position": null,
    "placement": null,
    "arrow": false,
    "closeOnClick": false
  }
}
```

---

### skeleton

Loading skeleton component for content placeholders. Supports text, circular, rectangular, and rounded variants with pulse and wave animations.

**Tags**: ui, feedback, loading, skeleton, placeholder, shimmer

**Component Name**: `skeleton`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| variant | `'text' | 'circular' | 'rectangular' | 'rounded'` | No |  |
| type | `'text' | 'circular' | 'rectangular' | 'rounded'` | No |  |
| width | `string` | No |  |
| height | `string` | No |  |
| count | `number` | No |  |
| lines | `number` | No |  |
| animation | `'pulse' | 'wave' | 'none'` | No |  |
| className | `string` | No |  |

#### JSON Schema

```json
{
  "name": "skeleton",
  "templateProps": {
    "variant": null,
    "type": null,
    "width": "example",
    "height": "example",
    "count": 0,
    "lines": 0,
    "animation": null,
    "className": "example"
  }
}
```

---

### tooltip

Tooltip component that displays contextual information on hover. Attach to any element via label prop. Supports multiple positions, variants, and optional arrows.

**Tags**: ui, feedback, tooltip, hint, popover, help

**Component Name**: `tooltip`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| text | `string` | No |  |
| content | `string` | No |  |
| message | `string` | No |  |
| label | `string` | No |  |
| buttonText | `string` | No |  |
| triggerText | `string` | No |  |
| children | `string` | No |  |
| position | `'top' | 'bottom' | 'left' | 'right'` | No |  |
| placement | `'top' | 'bottom' | 'left' | 'right'` | No |  |
| variant | `'dark' | 'light' | 'info' | 'success' | 'warning' | 'error'` | No |  |
| arrow | `boolean` | No |  |
| delay | `number` | No |  |

#### JSON Schema

```json
{
  "name": "tooltip",
  "templateProps": {
    "text": "example",
    "content": "example",
    "message": "example",
    "label": "example",
    "buttonText": "example",
    "triggerText": "example",
    "children": "example",
    "position": null,
    "placement": null,
    "variant": null,
    "arrow": false,
    "delay": 0
  }
}
```

---

## Surfaces

### avatar-group

Display a group of user avatars with overflow handling and customizable appearance

**Tags**: avatar, group, users, team, members, profile

**Component Name**: `avatar-group`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| avatars | `array` | Yes | Array of avatar objects |
| max | `number` | No | Maximum number of avatars to display before showing "+N" |
| size | `'small' | 'medium' | 'large'` | No | Size variant |
| label | `string` | No | Optional label/title |

#### JSON Schema

```json
{
  "name": "avatar-group",
  "templateProps": {
    "avatars": [],
    "max": 0,
    "size": null,
    "label": "example"
  }
}
```

---

### callout

Attention-grabbing callout box for important information, warnings, tips, and notes

**Tags**: callout, alert, info, notice, banner, message

**Component Name**: `callout`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Callout title |
| content | `string` | Yes | Main content/message |
| variant | `'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'` | No | Visual variant |
| showIcon | `boolean` | No | Show icon |
| dismissible | `boolean` | No | Make dismissible |

#### JSON Schema

```json
{
  "name": "callout",
  "templateProps": {
    "title": "example",
    "content": "example",
    "variant": null,
    "showIcon": false,
    "dismissible": false
  }
}
```

---

### feature

Feature highlight card with icon, title, description, and optional link

**Tags**: feature, card, highlight, showcase, benefits, icon

**Component Name**: `feature`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Feature title |
| description | `string` | Yes | Feature description |
| icon | `'star' | 'zap' | 'shield' | 'heart' | 'trending' | 'check' | 'sparkles' | 'award'` | No | Icon name |
| iconColor | `'primary' | 'cyan' | 'purple' | 'pink' | 'success'` | No | Icon color variant |
| orientation | `'vertical' | 'horizontal'` | No | Layout orientation |
| link | `string` | No | Optional link URL |
| linkText | `string` | No | Optional link text |

#### JSON Schema

```json
{
  "name": "feature",
  "templateProps": {
    "title": "example",
    "description": "example",
    "icon": null,
    "iconColor": null,
    "orientation": null,
    "link": "example",
    "linkText": "example"
  }
}
```

---

### frame

Customizable frame container with various border styles, padding, and background options

**Tags**: frame, container, border, box, wrapper, panel

**Component Name**: `frame`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Frame title |
| content | `string` | No | Content to display inside the frame |
| borderStyle | `'solid' | 'dashed' | 'dotted' | 'double' | 'none'` | No | Border style |
| borderWidth | `'thin' | 'normal' | 'thick'` | No | Border width |
| padding | `'small' | 'medium' | 'large'` | No | Padding size |
| background | `'transparent' | 'dark' | 'light' | 'gradient'` | No | Background variant |
| children | `React.ReactNode` | No | Optional children (for nested components) |

#### JSON Schema

```json
{
  "name": "frame",
  "templateProps": {
    "title": "example",
    "content": "example",
    "borderStyle": null,
    "borderWidth": null,
    "padding": null,
    "background": null,
    "children": null
  }
}
```

---

### hero

Hero section for landing pages with title, subtitle, description, and CTA buttons

**Tags**: hero, banner, landing, header, cta, showcase

**Component Name**: `hero`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Main headline |
| subtitle | `string` | No | Supporting subtitle/tagline |
| description | `string` | No | Optional description text |
| backgroundStyle | `'gradient' | 'solid' | 'image'` | No | Background style |
| backgroundImage | `string` | No | Background image URL (if backgroundStyle is 'image') |
| buttons | `array` | No | Call-to-action buttons |
| align | `'left' | 'center'` | No | Text alignment |
| size | `'normal' | 'large'` | No | Size variant |

#### JSON Schema

```json
{
  "name": "hero",
  "templateProps": {
    "title": "example",
    "subtitle": "example",
    "description": "example",
    "backgroundStyle": null,
    "backgroundImage": "example",
    "buttons": [],
    "align": null,
    "size": null
  }
}
```

---

### insight-card

Card component for displaying key insights, findings, and metrics with visual indicators

**Tags**: card, insight, metric, summary, kpi

**Component Name**: `insight-card`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Card title |
| description | `string` | Yes | Description or insight text |
| variant | `'info' | 'success' | 'warning' | 'error' | 'neutral'` | No | Visual variant/type |
| metric | `string` | No | Optional metric to display |
| showIcon | `boolean` | No | Show icon |

#### JSON Schema

```json
{
  "name": "insight-card",
  "templateProps": {
    "title": "example",
    "description": "example",
    "variant": null,
    "metric": "example",
    "showIcon": false
  }
}
```

---

### panel

Panel container with header, content, optional footer, and collapsible functionality. Supports visual variants, elevation, emphasis, and semantic tones.

**Tags**: panel, container, collapsible, accordion, section, card

**Component Name**: `panel`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Panel header/title |
| content | `string` | No | Panel content |
| footer | `string` | No | Footer content |
| collapsible | `boolean` | No | Make panel collapsible |
| defaultCollapsed | `boolean` | No | Default collapsed state (only applies if collapsible) |
| variant | `SurfaceVariant` | No | Surface variant for visual hierarchy |
| elevation | `ElevationLevel` | No | Elevation level for depth |
| emphasis | `EmphasisLevel` | No | Visual emphasis level |
| tone | `ToneVariant` | No | Semantic tone |
| children | `React.ReactNode` | No | Optional children (for nested components) |

#### JSON Schema

```json
{
  "name": "panel",
  "templateProps": {
    "title": "example",
    "content": "example",
    "footer": "example",
    "collapsible": false,
    "defaultCollapsed": false,
    "variant": null,
    "elevation": null,
    "emphasis": null,
    "tone": null,
    "children": null
  }
}
```

---

### paper

Material Design-inspired elevated surface with customizable shadow, padding, and styling

**Tags**: paper, surface, card, container, elevation, material

**Component Name**: `paper`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| content | `string` | No | Content to display |
| elevation | `0 | 1 | 2 | 3 | 4` | No | Elevation level (affects shadow depth) |
| padding | `'none' | 'small' | 'medium' | 'large'` | No | Padding size |
| rounded | `'none' | 'small' | 'medium' | 'large' | 'full'` | No | Border radius |
| variant | `'default' | 'outlined' | 'filled'` | No | Background variant |
| children | `React.ReactNode` | No | Optional children (for nested components) |

#### JSON Schema

```json
{
  "name": "paper",
  "templateProps": {
    "content": "example",
    "elevation": null,
    "padding": null,
    "rounded": null,
    "variant": null,
    "children": null
  }
}
```

---

### summary-card

Card component for displaying multiple summary metrics in various layouts. Supports visual variants, elevation, emphasis, and semantic tones.

**Tags**: card, summary, metrics, kpi, dashboard

**Component Name**: `summary-card`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Card title |
| description | `string` | No | Optional description |
| items | `string` | Yes | Summary items |
| layout | `'vertical' | 'horizontal' | 'grid'` | No | Layout orientation |
| columns | `2 | 3 | 4` | No | Number of columns for grid layout |
| variant | `SurfaceVariant` | No | Surface variant for visual hierarchy |
| elevation | `ElevationLevel` | No | Elevation level for depth |
| emphasis | `EmphasisLevel` | No | Visual emphasis level |
| tone | `ToneVariant` | No | Semantic tone |

#### JSON Schema

```json
{
  "name": "summary-card",
  "templateProps": {
    "title": "example",
    "description": "example",
    "items": "example",
    "layout": null,
    "columns": null,
    "variant": null,
    "elevation": null,
    "emphasis": null,
    "tone": null
  }
}
```

---

### text

Text component for displaying explanations, descriptions, and narrative content

**Tags**: text, typography, content, explanation

**Component Name**: `text`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| content | `string` | Yes | Text content to display |
| variant | `'body' | 'caption' | 'subtitle' | 'heading'` | No | Visual variant |
| color | `'primary' | 'secondary' | 'muted' | 'accent'` | No | Color variant |
| align | `'left' | 'center' | 'right'` | No | Text alignment |
| markdown | `boolean` | No | Enable markdown-style formatting |

#### JSON Schema

```json
{
  "name": "text",
  "templateProps": {
    "content": "example",
    "variant": null,
    "color": null,
    "align": null,
    "markdown": false
  }
}
```

---

### well

Inset container with shadow-inner effect for displaying recessed content

**Tags**: well, container, inset, recessed, box, panel

**Component Name**: `well`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| content | `string` | No | Content to display |
| size | `'small' | 'medium' | 'large'` | No | Well size |
| title | `string` | No | Optional title |
| variant | `'default' | 'info' | 'warning' | 'success'` | No | Visual variant |
| children | `React.ReactNode` | No | Optional children (for nested components) |

#### JSON Schema

```json
{
  "name": "well",
  "templateProps": {
    "content": "example",
    "size": null,
    "title": "example",
    "variant": null,
    "children": null
  }
}
```

---

## Media

### audio

Audio player component with playback controls, seek functionality, volume control, waveform visualization, and multiple display variants including compact and full modes with cover art.

**Tags**: ui, media, audio, player, music, controls

**Component Name**: `audio`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| src | `string` | Yes |  |
| title | `string` | No |  |
| artist | `string` | No |  |
| album | `string` | No |  |
| coverArt | `string` | No |  |
| autoPlay | `boolean` | No |  |
| loop | `boolean` | No |  |
| variant | `'default' | 'compact' | 'full'` | No |  |
| showWaveform | `boolean` | No |  |
| className | `string` | No |  |
| onPlay | `function` | No |  |
| onPause | `function` | No |  |
| onEnded | `function` | No |  |
| onTimeUpdate | `number` | No |  |

#### JSON Schema

```json
{
  "name": "audio",
  "templateProps": {
    "src": "example",
    "title": "example",
    "artist": "example",
    "album": "example",
    "coverArt": "example",
    "autoPlay": false,
    "loop": false,
    "variant": null,
    "showWaveform": false,
    "className": "example",
    "onPlay": null,
    "onPause": null,
    "onEnded": null,
    "onTimeUpdate": 0
  }
}
```

---

### carousel

Image carousel/slider component with navigation arrows, indicators, thumbnails, auto-play functionality, touch/swipe support, and multiple transition effects including slide, fade, and zoom.

**Tags**: ui, media, carousel, slider, images, gallery

**Component Name**: `carousel`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| images | `array` | Yes |  |
| autoPlay | `boolean` | No |  |
| interval | `number` | No |  |
| showIndicators | `boolean` | No |  |
| showArrows | `boolean` | No |  |
| showThumbnails | `boolean` | No |  |
| infinite | `boolean` | No |  |
| aspectRatio | `'16:9' | '4:3' | '1:1' | '21:9' | 'auto'` | No |  |
| transition | `'slide' | 'fade' | 'zoom'` | No |  |
| rounded | `boolean` | No |  |
| className | `string` | No |  |
| onSlideChange | `number` | No |  |

#### JSON Schema

```json
{
  "name": "carousel",
  "templateProps": {
    "images": [],
    "autoPlay": false,
    "interval": 0,
    "showIndicators": false,
    "showArrows": false,
    "showThumbnails": false,
    "infinite": false,
    "aspectRatio": null,
    "transition": null,
    "rounded": false,
    "className": "example",
    "onSlideChange": 0
  }
}
```

---

### gallery

Photo gallery component with grid/masonry/justified layouts, integrated lightbox modal, category filtering, hover effects, lazy loading, and responsive column layouts.

**Tags**: ui, media, gallery, images, lightbox, grid

**Component Name**: `gallery`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| images | `array` | Yes |  |
| columns | `2 | 3 | 4 | 5 | 6` | No |  |
| gap | `'sm' | 'md' | 'lg'` | No |  |
| variant | `'grid' | 'masonry' | 'justified'` | No |  |
| lightbox | `boolean` | No |  |
| showCaptions | `boolean` | No |  |
| filterCategories | `boolean` | No |  |
| aspectRatio | `'16:9' | '4:3' | '1:1' | 'auto'` | No |  |
| rounded | `boolean` | No |  |
| hoverEffect | `'zoom' | 'fade' | 'lift' | 'none'` | No |  |
| className | `string` | No |  |
| onImageClick | `number` | No |  |

#### JSON Schema

```json
{
  "name": "gallery",
  "templateProps": {
    "images": [],
    "columns": null,
    "gap": null,
    "variant": null,
    "lightbox": false,
    "showCaptions": false,
    "filterCategories": false,
    "aspectRatio": null,
    "rounded": false,
    "hoverEffect": null,
    "className": "example",
    "onImageClick": 0
  }
}
```

---

### image

Image display component with lazy loading, fallback support, zoom functionality, loading states, and various styling options including aspect ratios, borders, shadows, and filters.

**Tags**: ui, media, image, lazy-load, responsive

**Component Name**: `image`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| src | `string` | Yes |  |
| alt | `string` | Yes |  |
| width | `string` | No |  |
| height | `string` | No |  |
| fallbackSrc | `string` | No |  |
| lazyLoad | `boolean` | No |  |
| objectFit | `'contain' | 'cover' | 'fill' | 'none' | 'scale-down'` | No |  |
| rounded | `boolean` | No |  |
| border | `boolean` | No |  |
| shadow | `boolean` | No |  |
| zoom | `boolean` | No |  |
| overlay | `string` | No |  |
| caption | `string` | No |  |
| aspectRatio | `'16:9' | '4:3' | '1:1' | '21:9' | 'auto'` | No |  |
| grayscale | `boolean` | No |  |
| blur | `boolean` | No |  |
| className | `string` | No |  |
| onLoad | `function` | No |  |
| onError | `function` | No |  |
| onClick | `function` | No |  |

#### JSON Schema

```json
{
  "name": "image",
  "templateProps": {
    "src": "example",
    "alt": "example",
    "width": "example",
    "height": "example",
    "fallbackSrc": "example",
    "lazyLoad": false,
    "objectFit": null,
    "rounded": false,
    "border": false,
    "shadow": false,
    "zoom": false,
    "overlay": "example",
    "caption": "example",
    "aspectRatio": null,
    "grayscale": false,
    "blur": false,
    "className": "example",
    "onLoad": null,
    "onError": null,
    "onClick": null
  }
}
```

---

### video

Video player component with custom controls, play/pause, seek, volume control, fullscreen support, and multiple control variants.

**Tags**: ui, media, video, player, controls

**Component Name**: `video`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| src | `string` | Yes |  |
| poster | `string` | No |  |
| width | `string` | No |  |
| height | `string` | No |  |
| autoPlay | `boolean` | No |  |
| loop | `boolean` | No |  |
| muted | `boolean` | No |  |
| controls | `boolean` | No |  |
| controlsVariant | `'default' | 'minimal' | 'full'` | No |  |
| aspectRatio | `'16:9' | '4:3' | '1:1' | '21:9' | 'auto'` | No |  |
| rounded | `boolean` | No |  |
| shadow | `boolean` | No |  |
| className | `string` | No |  |
| onPlay | `function` | No |  |
| onPause | `function` | No |  |
| onEnded | `function` | No |  |
| onTimeUpdate | `number` | No |  |

#### JSON Schema

```json
{
  "name": "video",
  "templateProps": {
    "src": "example",
    "poster": "example",
    "width": "example",
    "height": "example",
    "autoPlay": false,
    "loop": false,
    "muted": false,
    "controls": false,
    "controlsVariant": null,
    "aspectRatio": null,
    "rounded": false,
    "shadow": false,
    "className": "example",
    "onPlay": null,
    "onPause": null,
    "onEnded": null,
    "onTimeUpdate": 0
  }
}
```

---

## Advanced

### chat

Chat interface with messages, avatars, timestamps, and input field

**Tags**: chat, messaging, conversation, messages, communication

**Component Name**: `chat`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| messages | `array` | Yes | Array of messages |
| title | `string` | No | Chat title |
| showInput | `boolean` | No | Show input field |
| inputPlaceholder | `string` | No | Input placeholder |
| maxHeight | `number` | No | Max height for scrollable area |

#### JSON Schema

```json
{
  "name": "chat",
  "templateProps": {
    "messages": [],
    "title": "example",
    "showInput": false,
    "inputPlaceholder": "example",
    "maxHeight": 0
  }
}
```

---

### code-block

Code block display with syntax highlighting, line numbers, and copy functionality

**Tags**: code, syntax, programming, snippet, developer, monospace

**Component Name**: `code-block`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| code | `string` | Yes | Code content to display |
| language | `'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'other'` | No | Programming language |
| showLineNumbers | `boolean` | No | Show line numbers |
| showCopyButton | `boolean` | No | Show copy button |
| title | `string` | No | Optional title/filename |
| maxHeight | `number` | No | Maximum height (scrollable) |
| theme | `'dark' | 'light'` | No | Theme variant |

#### JSON Schema

```json
{
  "name": "code-block",
  "templateProps": {
    "code": "example",
    "language": null,
    "showLineNumbers": false,
    "showCopyButton": false,
    "title": "example",
    "maxHeight": 0,
    "theme": null
  }
}
```

---

### dashboard

Dashboard layout with customizable widget grid and responsive design

**Tags**: dashboard, analytics, metrics, widgets, grid, statistics

**Component Name**: `dashboard`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | No | Dashboard title |
| widgets | `array` | Yes | Array of widget configurations |
| columns | `2 | 3 | 4` | No | Grid layout columns |
| compact | `boolean` | No | Compact mode (smaller spacing) |

#### JSON Schema

```json
{
  "name": "dashboard",
  "templateProps": {
    "title": "example",
    "widgets": [],
    "columns": null,
    "compact": false
  }
}
```

---

### loading-spinner

Customizable loading spinner with multiple styles, sizes, and colors

**Tags**: loading, spinner, loader, progress, waiting, animation

**Component Name**: `loading-spinner`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| size | `'small' | 'medium' | 'large' | 'xlarge'` | No | Size variant |
| color | `'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'` | No | Color variant |
| variant | `'spin' | 'pulse' | 'dots' | 'bars'` | No | Spinner style/animation |
| label | `string` | No | Optional loading text |
| centered | `boolean` | No | Center in container |
| fullScreen | `boolean` | No | Full screen overlay |

#### JSON Schema

```json
{
  "name": "loading-spinner",
  "templateProps": {
    "size": null,
    "color": null,
    "variant": null,
    "label": "example",
    "centered": false,
    "fullScreen": false
  }
}
```

---

### markdown

Full-featured markdown renderer with support for headings, lists, tables, code blocks, and more

**Tags**: markdown, text, content, documentation

**Component Name**: `markdown`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| content | `string` | Yes |  |
| className | `string` | No |  |

#### JSON Schema

```json
{
  "name": "markdown",
  "templateProps": {
    "content": "example",
    "className": "example"
  }
}
```

---

### widget

Versatile widget container with header, content, footer, and interactive controls

**Tags**: widget, container, panel, card, module, component

**Component Name**: `widget`

#### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | `string` | Yes | Widget title |
| content | `string` | No | Widget content |
| variant | `'default' | 'compact' | 'highlighted'` | No | Widget type/variant |
| footer | `string` | No | Footer content |
| showActions | `boolean` | No | Show header actions |
| collapsible | `boolean` | No | Allow collapse/expand |
| defaultCollapsed | `boolean` | No | Default collapsed state |
| closeable | `boolean` | No | Show close button |
| children | `React.ReactNode` | No | Optional children (for nested components) |

#### JSON Schema

```json
{
  "name": "widget",
  "templateProps": {
    "title": "example",
    "content": "example",
    "variant": null,
    "footer": "example",
    "showActions": false,
    "collapsible": false,
    "defaultCollapsed": false,
    "closeable": false,
    "children": null
  }
}
```

---

