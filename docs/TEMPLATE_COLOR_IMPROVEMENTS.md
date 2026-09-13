# Template Color Improvements

## Overview

This document describes improvements made to templates to better handle user-provided color inputs and ensure templates create good UI with desired colors from users.

## Changes Made

### 1. Color Utility Functions (`src/templates/core/utils.ts`)

Added comprehensive color utility functions to help templates handle user-provided colors:

- **`DEFAULT_CHART_COLORS`**: Default color palette matching the design system
- **`getColor()`**: Prioritizes user-provided colors over defaults
- **`isValidHexColor()`**: Validates hex color format
- **`processSeriesColors()`**: Processes series arrays to ensure all items have valid colors while respecting user input
- **`getTextColor()`**: Helper for theme-aware text colors

### Key Principle: User Input Takes Priority

All color utilities follow this principle:
1. **User-provided colors** are always used if valid
2. **Default colors** are used only when user doesn't specify
3. **Validation** ensures all colors are valid hex codes

### 2. Improved Chart Templates

#### BarChart (`src/templates/charts/BarChart.tsx`)
- Now uses `processSeriesColors()` to handle color props
- Respects user-provided colors in series data
- Provides good defaults when colors aren't specified
- Colors are guaranteed to be valid hex codes

#### LineChart (`src/templates/charts/LineChart.tsx`)
- Uses `processSeriesColors()` for consistent color handling
- User-provided colors take priority
- Maintains backwards compatibility with existing color props

### How It Works

#### Before:
```tsx
// Colors were passed through directly without validation or defaults
<MuiBarChart series={series} />
```

#### After:
```tsx
// Colors are processed to ensure validity and provide defaults
const processedSeries = processSeriesColors(series);
<MuiBarChart series={processedSeries} />
```

The `processSeriesColors()` function:
1. Takes the series array (may have optional `color` props)
2. For each series item:
   - Uses user-provided color if valid
   - Falls back to default color palette if not provided
   - Guarantees every item has a valid color
3. Returns series array with guaranteed colors

## Usage Examples

### User Provides Colors
```json
{
  "name": "bar-chart",
  "templateProps": {
    "series": [
      { "data": [1, 2, 3], "label": "Series 1", "color": "#3B82F6" },
      { "data": [4, 5, 6], "label": "Series 2", "color": "#10B981" }
    ]
  }
}
```
✅ Templates will use the exact colors provided by the user

### User Doesn't Provide Colors
```json
{
  "name": "bar-chart",
  "templateProps": {
    "series": [
      { "data": [1, 2, 3], "label": "Series 1" },
      { "data": [4, 5, 6], "label": "Series 2" }
    ]
  }
}
```
✅ Templates will use default colors from the design system palette

### Mixed (Some Colors Provided)
```json
{
  "name": "bar-chart",
  "templateProps": {
    "series": [
      { "data": [1, 2, 3], "label": "Series 1", "color": "#EF4444" },
      { "data": [4, 5, 6], "label": "Series 2" }
    ]
  }
}
```
✅ First series uses user color (#EF4444), second uses default color

## Color Palette Reference

### Default Chart Colors (in order)
1. `#F97316` - Primary orange
2. `#10B981` - Green
3. `#3B82F6` - Blue
4. `#8B5CF6` - Purple
5. `#EC4899` - Pink
6. `#06B6D4` - Cyan
7. `#F59E0B` - Amber
8. `#22C55E` - Jade

These match the design system defined in `tailwind.config.js` and `backend/prompts/MainPrompt.md`.

## Best Practices for Templates

When creating or updating templates that use colors:

1. **Always accept color props** from users when applicable
2. **Use color utilities** from `core/utils.ts` for consistency
3. **Provide sensible defaults** when colors aren't specified
4. **Validate colors** to ensure they're valid hex codes
5. **Document color props** in component metadata

### Example Template Pattern

```tsx
import { processSeriesColors, DEFAULT_CHART_COLORS } from '../core/utils';

interface MyChartProps {
  series: Array<{
    data: number[];
    label?: string;
    color?: string; // User can provide colors
  }>;
}

const MyChart: React.FC<MyChartProps> = ({ series }) => {
  // Process colors: respect user input, provide defaults
  const processedSeries = processSeriesColors(series);
  
  // Use processedSeries which guarantees valid colors
  return <ChartComponent series={processedSeries} />;
};
```

## Benefits

1. **User Control**: Users can specify exact colors they want
2. **Good Defaults**: Templates always have valid, attractive colors
3. **Consistency**: All templates use the same color handling logic
4. **Reliability**: Colors are validated and guaranteed to be valid
5. **Flexibility**: Works with or without user-provided colors

## Future Improvements

- Apply similar color handling to more chart templates (AreaChart, ScatterChart, etc.)
- Add color palette customization options
- Support color gradients and themes
- Add color accessibility validation (contrast ratios)
