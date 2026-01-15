# AI UI Components & Rendering System

## Table of Contents
1. [Overview](#overview)
2. [Component Library (137 Components)](#component-library-137-components)
3. [Rendering Architecture](#rendering-architecture)
4. [Component Registration System](#component-registration-system)
5. [Data Flow](#data-flow)
6. [Component Specification Format](#component-specification-format)

---

## Overview

This system provides a complete UI generation pipeline with **137 pre-built components** organized into **8 categories**. Components are automatically discovered and registered using Vite's glob import feature, eliminating the need for manual registration or switch-case statements.

**Key Features:**
- ✅ 137 production-ready components
- ✅ Automatic component discovery and registration
- ✅ Registry-based rendering (no switch-case)
- ✅ Dual format support (`{name, templateProps}` and `{type, props}`)
- ✅ Recursive rendering for nested components
- ✅ Type-safe with proper error handling

---

## Component Library (137 Components)

### 📊 Charts (30 Components)

#### Line & Area Charts
- **`line-chart`** - Trends over time
- **`area-chart`** - Filled regions showing cumulative data
- **`stacked-area-chart`** - Multiple stacked areas
- **`multi-line-chart`** - Multiple line series

#### Bar & Column Charts
- **`bar-chart`** - Categorical comparisons
- **`stacked-bar-chart-v2`** - Stacked bars
- **`grouped-bar-chart`** - Grouped bars side-by-side

#### Pie & Donut
- **`pie-chart`** - Proportional slices
- **`donut-chart`** - Pie with center hole

#### Specialty Charts
- **`scatter-chart`** - XY correlation
- **`bubble-chart`** - 3D scatter (x, y, size)
- **`gauge-chart`** - Speedometer-style KPI
- **`sparkline-chart`** - Compact mini trends
- **`radar-chart`** - Multi-variable comparison
- **`treemap-chart`** - Hierarchical rectangles
- **`funnel-chart`** - Conversion funnels
- **`composed-chart`** - Mixed bar + line
- **`candlestick-chart`** - Stock prices
- **`waterfall-chart`** - Cumulative impact
- **`time-series-chart`** - Time-indexed data
- **`histogram-chart`** - Distribution
- **`heatmap-chart`** - Color intensity grid
- **`sankey-chart`** - Flow diagrams
- **`sunburst-chart`** - Radial hierarchy
- **`polar-chart`** - Polar coordinates
- **`radial-bar-chart`** - Radial bars
- **`violin-chart`** - Distribution density
- **`boxplot-chart`** - Statistical quartiles
- **`chord-chart`** - Relationship flows
- **`multi-axis-chart`** - Multiple Y-axes

### 📋 Data Display (15 Components)
- **`data-table`** - Sortable, searchable table
- **`data-grid`** - Advanced grid with pagination
- **`virtualized-table`** - Large tables (scrolling)
- **`timeline`** - Events in chronological order
- **`kanban`** - Task board with columns
- **`calendar`** - Date calendar
- **`gantt`** - Project timeline
- **`org-chart`** - Organization hierarchy
- **`tree-view`** - Expandable tree structure
- **`mind-map`** - Radial mind map
- **`list`** - Basic list container
- **`list-item`** - Single list item
- **`badge`** - Small notification badge
- **`chip`** - Small removable tag
- **`avatar`** - User profile picture

### 📝 Inputs (20 Components)
- **`text-field`** - Single-line text
- **`textarea`** - Multi-line text
- **`select`** - Dropdown selection
- **`multi-select`** - Multiple options
- **`autocomplete`** - Text with suggestions
- **`date-picker`** - Date selection
- **`time-picker`** - Time selection
- **`datetime-picker`** - Date + time
- **`color-picker`** - Color selection
- **`file-picker`** - File upload
- **`slider`** - Single value slider
- **`range-slider`** - Min/max range
- **`switch`** - Toggle on/off
- **`checkbox`** - Multiple selections
- **`radio`** - Single selection
- **`rating`** - Star rating 1-5
- **`tag-input`** - Comma-separated tags
- **`rich-text-editor`** - WYSIWYG editor
- **`search-input`** - Search field
- **`otp-input`** - One-time password

### 🎨 Layout (15 Components)
- **`container`** - Fixed/fluid width wrapper
- **`grid`** - CSS grid (columns configurable)
- **`flexbox`** - Flexible row/column
- **`stack`** - Vertical stack (flexbox column)
- **`masonry`** - Pinterest-style columns
- **`sidebar`** - Left/right sidebar layout
- **`appbar`** - Top navigation bar
- **`drawer`** - Side navigation menu
- **`bottom-navigation`** - Mobile bottom nav
- **`breadcrumbs`** - Hierarchical path
- **`stepper`** - Step indicator
- **`accordion`** - Collapsible sections
- **`divider`** - Horizontal/vertical line
- **`spacer`** - Empty spacing element
- **`section`** - Content section wrapper

### 🧭 Navigation (12 Components)
- **`menu`** - Dropdown menu
- **`context-menu`** - Right-click menu
- **`tabs`** - Tab navigation
- **`pagination`** - Page navigation (1, 2, 3...)
- **`dropdown`** - Select dropdown
- **`link`** - Hyperlink
- **`button`** - Action button
- **`icon-button`** - Button with icon
- **`speed-dial`** - FAB with menu
- **`navigation-rail`** - Vertical nav
- **`segmented-control`** - Button group toggle
- **`floating-action-button`** - FAB

### 💬 Feedback (12 Components)
- **`alert`** - Information/warning/error box
- **`snackbar`** - Bottom temporary message
- **`dialog`** - Modal popup
- **`modal`** - Centered modal
- **`popover`** - Floating tooltip menu
- **`tooltip`** - Hover hint
- **`linear-progress`** - Horizontal progress bar
- **`circular-progress`** - Spinning loader
- **`skeleton`** - Loading placeholder
- **`backdrop`** - Dark overlay
- **`toast`** - Toast notification
- **`notification`** - Notification alert

### 🎴 Surfaces (8 Components)
- **`paper`** - Card container
- **`panel`** - Panel container
- **`well`** - Indented well
- **`hero`** - Large hero section
- **`feature`** - Feature card
- **`callout`** - Attention-grabbing box
- **`frame`** - Bordered frame
- **`avatar-group`** - Multiple avatars stacked

### 🎥 Media (8 Components)
- **`image`** - Image display
- **`video`** - Video player
- **`audio`** - Audio player
- **`carousel`** - Image slider
- **`gallery`** - Grid image gallery
- **`lightbox`** - Full-screen image view
- **`image-comparison`** - Before/after slider
- **`image-cropper`** - Image crop tool

### 🚀 Advanced (10 Components)
- **`code-block`** - Syntax-highlighted code
- **`markdown`** - Markdown renderer
- **`map`** - Map display
- **`signature`** - Signature pad
- **`qrcode`** - QR code generator
- **`barcode`** - Barcode generator
- **`dashboard`** - Dashboard container
- **`widget`** - Dashboard widget
- **`chat`** - Chat interface
- **`loading-spinner`** - Loading animation

### 📦 Legacy/Basic (7 Components)
- **`text`** - Text display
- **`card`** - Card with title/content
- **`form`** - Form with fields
- **`chart`** - Generic chart (legacy)
- **`table`** - Table display (legacy)
- **`button-group`** - Button group
- **`layout`** - Grid/flex layout

---

## Rendering Architecture

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Component Files                         │
│  /templates/charts/LineChart.tsx                            │
│  /templates/charts/BarChart.tsx                             │
│  /templates/inputs/TextField.tsx                            │
│  ... (137 components)                                        │
│                                                              │
│  Each exports: { default: Component, metadata: {...} }      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Auto-discovery via Vite glob
                   │ import.meta.glob('./**/*.{tsx,ts}')
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Component Registry (Singleton)                  │
│  /templates/core/registry.ts                                │
│                                                              │
│  Map<name, ComponentMetadata> {                             │
│    'line-chart' → { component: LineChart, ... }             │
│    'bar-chart' → { component: BarChart, ... }               │
│    'text-field' → { component: TextField, ... }             │
│    ... (137 entries)                                         │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Lookup by name
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                Universal Renderer                            │
│  /templates/core/renderer.tsx                               │
│                                                              │
│  renderComponent(spec) {                                     │
│    const Component = registry.get(spec.name || spec.type)   │
│    return <Component {...props} />                          │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Renders UI
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Application                          │
│  - ChatPage (generates components)                          │
│  - InspectorPage (views component specs)                    │
│  - GalleryPage (browses templates)                          │
│  - HistoryPage (views generation history)                   │
└─────────────────────────────────────────────────────────────┘
```

### 📁 File Structure

```
/ai-ui-generator/src/
├── templates/
│   ├── index.tsx                    # Auto-discovery entry point
│   ├── core/
│   │   ├── registry.ts              # Component registry (singleton)
│   │   ├── renderer.tsx             # Universal renderer
│   │   ├── types.ts                 # Type definitions
│   │   └── utils.ts                 # Helper utilities
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   └── ... (27 more)
│   ├── inputs/
│   │   ├── TextField.tsx
│   │   ├── Select.tsx
│   │   └── ... (18 more)
│   ├── layout/
│   ├── navigation/
│   ├── feedback/
│   ├── surfaces/
│   ├── media/
│   ├── data-display/
│   └── advanced/
├── pages/
│   ├── ChatPage.tsx                 # Main UI generation interface
│   ├── InspectorPage.tsx            # Component spec viewer
│   ├── GalleryPage.tsx              # Template gallery
│   └── HistoryPage.tsx              # Generation history
└── types/
    └── component.types.ts           # Shared type definitions
```

---

## Component Registration System

### 🔧 Auto-Discovery Process

**File:** `/templates/index.tsx`

```typescript
// Auto-discover all component modules using Vite glob
const componentModules = import.meta.glob<{
  default?: any;
  metadata?: ComponentMetadata;
}>('./**/*.{tsx,ts}', {
  eager: true,  // Load immediately
});

// Register all components that export metadata
let registeredCount = 0;
for (const path in componentModules) {
  if (path.includes('/core/')) continue;  // Skip core files

  try {
    const module = componentModules[path];
    const metadata = module.metadata;

    if (metadata && metadata.name && metadata.category && metadata.component) {
      registerComponent(metadata);
      registeredCount++;
    }
  } catch (error) {
    console.warn(`[Templates] Failed to register from ${path}:`, error);
  }
}

console.log(`[Templates] Registered ${registeredCount} components`);
```

### 📝 Component File Pattern

Every component follows this pattern:

```typescript
// Example: /templates/charts/LineChart.tsx

import React from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';

interface LineChartProps {
  title?: string;
  xAxis?: Array<{ data: (number | string | Date)[] }>;
  series: Array<{ data: number[]; label?: string; color?: string }>;
  width?: number;
  height?: number;
  // ... more props
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  xAxis,
  series,
  width = 600,
  height = 400,
}) => {
  return (
    <div className="glass-dark border border-gray-700/50 rounded-2xl p-6 my-4">
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      <MuiLineChart xAxis={xAxis} series={series} width={width} height={height} />
    </div>
  );
};

export default LineChart;

// ⭐ Component metadata for auto-registration
export const metadata = {
  name: 'line-chart',                    // Must be kebab-case
  category: 'charts' as const,           // One of 8 categories
  component: LineChart,                  // The actual component
  description: 'Line chart for trends',  // Optional description
  tags: ['chart', 'line', 'trend'],     // Optional tags
};
```

### 🗂️ Registry Implementation

**File:** `/templates/core/registry.ts`

```typescript
class ComponentRegistry {
  private components: Map<string, ComponentMetadata> = new Map();

  register(metadata: ComponentMetadata): void {
    this.components.set(metadata.name, metadata);
  }

  get(name: string): ComponentType<any> | undefined {
    return this.components.get(name)?.component;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  getAll(): Map<string, ComponentMetadata> {
    return new Map(this.components);
  }

  getByCategory(category: ComponentCategory): ComponentMetadata[] {
    return Array.from(this.components.values())
      .filter(m => m.category === category);
  }
}

export const registry = ComponentRegistry.getInstance();
```

---

## Data Flow

### 🔄 Complete Generation Flow

```
1. User Input
   "Show me a line chart of monthly revenue"

2. Main Agent (MainAgent.md)
   ↓ Analyzes request
   ↓ Queries data sources (Clickstack MCP)
   ↓ Calls UI Generation Agent

3. UI Generation Agent (Prompt2.md)
   ↓ Generates JSON specification
   {
     "name": "line-chart",
     "templateProps": {
       "title": "Monthly Revenue",
       "xAxis": [{"data": ["Jan", "Feb", "Mar"]}],
       "series": [{"data": [4000, 5200, 4800]}]
     }
   }

4. Review Agent (ReviewAgent.md)
   ↓ Validates JSON structure
   ↓ Checks for errors
   ✅ Approved / ❌ Send back for fixes

5. Renderer (renderer.tsx)
   ↓ Extracts component name
   componentName = spec.name || spec.type

6. Registry Lookup
   ↓ registry.get('line-chart')
   ↓ Returns LineChart component

7. React Render
   <LineChart
     title="Monthly Revenue"
     xAxis={[{data: ["Jan", "Feb", "Mar"]}]}
     series={[{data: [4000, 5200, 4800]}]}
   />

8. Displayed UI
   📊 Beautiful line chart appears on screen
```

### 🎯 Rendering Process (renderer.tsx)

```typescript
export const renderComponent = (spec: ComponentSpec): React.ReactNode => {
  // Step 1: Support both formats
  const componentName = spec.name || spec.type;
  const componentProps = spec.templateProps || spec.props || {};
  const children = componentProps.children || spec.children || [];
  const metadata = spec.metadata;

  // Step 2: Get component from registry
  const Component = registry.get(componentName);

  // Step 3: Handle unknown components
  if (!Component) {
    return <ErrorMessage type={componentName} />;
  }

  // Step 4: Recursive rendering for children
  const renderChildren = (child: ComponentSpec) => renderComponent(child);
  const renderedChildren = children?.map((child, index) => (
    <React.Fragment key={index}>{renderChildren(child)}</React.Fragment>
  ));

  // Step 5: Render the component
  return (
    <Component
      key={metadata?.componentId}
      {...componentProps}
      children={renderedChildren}
      renderChild={renderChildren}
    />
  );
};
```

---

## Component Specification Format

### 📋 Dual Format Support

The system supports **both** formats for backward compatibility:

#### New Format (Preferred)
```json
{
  "name": "line-chart",
  "templateProps": {
    "title": "Sales Trend",
    "series": [{"data": [100, 200, 150]}]
  },
  "children": [
    {
      "name": "text",
      "templateProps": {"content": "Chart caption"}
    }
  ],
  "metadata": {
    "componentId": "chart-123",
    "description": "Monthly sales"
  }
}
```

#### Legacy Format (Supported)
```json
{
  "type": "line-chart",
  "props": {
    "title": "Sales Trend",
    "series": [{"data": [100, 200, 150]}]
  },
  "children": [...],
  "metadata": {...}
}
```

### 🔍 TypeScript Type Definition

**File:** `/templates/core/types.ts` and `/types/component.types.ts`

```typescript
export interface ComponentSpec {
  // New format
  name?: string;
  templateProps?: Record<string, any>;

  // Legacy format (backward compatibility)
  type?: string;
  props?: Record<string, any>;

  // Common fields
  children?: ComponentSpec[];
  metadata?: {
    description?: string;
    generatedAt?: string;
    componentId?: string;
  };
}

export interface ComponentMetadata {
  name: string;                    // 'line-chart'
  category: ComponentCategory;     // 'charts'
  component: ComponentType<any>;   // React component
  description?: string;
  tags?: string[];
  propTypes?: Record<string, any>;
}

export type ComponentCategory =
  | 'charts'
  | 'data-display'
  | 'inputs'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'surfaces'
  | 'media'
  | 'advanced'
  | 'legacy';
```

---

## Key Design Decisions

### ✅ Why Registry Pattern?

**Before (Switch-Case Hell):**
```typescript
function renderComponent(spec) {
  switch (spec.type) {
    case 'line-chart': return <LineChart {...spec.props} />;
    case 'bar-chart': return <BarChart {...spec.props} />;
    case 'pie-chart': return <PieChart {...spec.props} />;
    // ... 134 more cases
    default: return null;
  }
}
```

**After (Registry Lookup):**
```typescript
function renderComponent(spec) {
  const Component = registry.get(spec.name || spec.type);
  return Component ? <Component {...props} /> : <ErrorMessage />;
}
```

**Benefits:**
- ✅ No manual updates when adding components
- ✅ Auto-discovery using Vite glob
- ✅ Type-safe with proper error handling
- ✅ Easy to extend (just add file with metadata)
- ✅ O(1) lookup time

### ✅ Why Dual Format Support?

- **Backward compatibility** with existing components
- **Future-proof** for new AI generation format
- **Flexibility** for different use cases
- **Migration path** from old to new format

### ✅ Why Auto-Discovery?

- **Zero boilerplate** - just export metadata
- **No registration code** - Vite does it automatically
- **DX improvement** - add file, done
- **Type safety** - metadata enforces correct structure

---

## Usage Examples

### Example 1: Rendering a Simple Chart

```typescript
import { renderComponent } from './templates';

const chartSpec = {
  name: 'line-chart',
  templateProps: {
    title: 'Monthly Sales',
    xAxis: [{ data: ['Jan', 'Feb', 'Mar', 'Apr'] }],
    series: [{ data: [4000, 5200, 4800, 6100], color: '#8b5cf6' }],
    width: 600,
    height: 400,
  },
};

const ui = renderComponent(chartSpec);
// Returns: <LineChart title="Monthly Sales" ... />
```

### Example 2: Nested Layout

```typescript
const layoutSpec = {
  name: 'layout',
  templateProps: {
    layoutType: 'grid',
    columns: 2,
    gap: 'large',
    children: [
      {
        name: 'line-chart',
        templateProps: { title: 'Revenue', series: [...] }
      },
      {
        name: 'pie-chart',
        templateProps: { title: 'Market Share', series: [...] }
      }
    ]
  }
};

const ui = renderComponent(layoutSpec);
// Recursively renders grid with both charts
```

### Example 3: Error Handling

```typescript
const invalidSpec = {
  name: 'unknown-component',
  templateProps: {}
};

const ui = renderComponent(invalidSpec);
// Returns: Beautiful error message with available components
```

---

## Statistics

- **Total Components:** 137
- **Categories:** 8
- **Auto-discovered:** Yes (Vite glob)
- **Manual Registration:** 0 lines
- **Switch Cases:** 0
- **Format Support:** 2 (new + legacy)
- **Type Safety:** ✅ Full TypeScript
- **Error Handling:** ✅ Graceful degradation

---

## File References

| File | Purpose | Lines |
|------|---------|-------|
| `/templates/index.tsx` | Auto-discovery entry | ~50 |
| `/templates/core/registry.ts` | Component registry | ~180 |
| `/templates/core/renderer.tsx` | Universal renderer | ~166 |
| `/templates/core/types.ts` | Type definitions | ~98 |
| `/templates/charts/*.tsx` | 30 chart components | ~3000+ |
| `/templates/inputs/*.tsx` | 20 input components | ~2000+ |
| `/templates/layout/*.tsx` | 15 layout components | ~1500+ |
| All template files | 137 components total | ~15,000+ |

---

## Next Steps

1. **Add new component:** Create file with metadata export → Auto-registered
2. **Use component:** Call `renderComponent(spec)` → Rendered
3. **Extend system:** Add to any category → Works immediately
4. **Test component:** View in InspectorPage → See live preview

**No configuration needed. Just export metadata.**
