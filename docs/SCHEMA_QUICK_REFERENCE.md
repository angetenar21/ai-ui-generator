# Component Schema Quick Reference

Quick lookup guide for the most commonly used components.

**Full Documentation**: See [SCHEMA.md](./SCHEMA.md) for complete details on all 112 components.

## Quick Start

All components follow this JSON format:
```json
{
  "name": "component-name",
  "templateProps": { /* props here */ }
}
```

---

## Most Used Components

### Charts (30 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Line Chart | `line-chart` | `title`, `data`, `xAxis`, `series` |
| Bar Chart | `bar-chart` | `title`, `data`, `xAxis`, `series` |
| Pie Chart | `pie-chart` | `title`, `data` (array of {label, value}) |
| Area Chart | `area-chart` | `title`, `data`, `xAxis`, `series` |
| Scatter Chart | `scatter-chart` | `title`, `data` (array of {x, y}) |

### Data Display (15 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Data Table | `data-table` | `columns`, `rows`, `sortable`, `pagination` |
| Data Grid | `data-grid` | `columns`, `rows`, `selectable`, `editable` |
| List | `list` | `items`, `variant`, `dividers` |
| Timeline | `timeline` | `events`, `variant` |
| Calendar | `calendar` | `events`, `selectedDate`, `view` |
| Kanban | `kanban` | `columns`, `cards` |

### Inputs (20 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Text Field | `text-field` | `label`, `value`, `placeholder`, `required` |
| Select | `select` | `label`, `options`, `value`, `multiple` |
| Checkbox | `checkbox` | `label`, `checked`, `disabled` |
| Radio | `radio` | `label`, `value`, `checked` |
| Switch | `switch` | `label`, `checked` |
| Slider | `slider` | `min`, `max`, `value`, `step` |
| Date Picker | `date-picker` | `label`, `value`, `format` |
| File Picker | `file-picker` | `label`, `accept`, `multiple` |
| Color Picker | `color-picker` | `value`, `format` |
| Rating | `rating` | `value`, `max`, `precision` |

### Layout (15 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Container | `container` | `maxWidth`, `padding` |
| Grid | `grid` | `columns`, `gap`, `responsive` |
| Flexbox | `flexbox` | `direction`, `justify`, `align`, `gap` |
| Stack | `stack` | `direction`, `spacing`, `divider` |
| Accordion | `accordion` | `items`, `multiple`, `defaultExpanded` |
| Stepper | `stepper` | `steps`, `activeStep`, `orientation` |

### Navigation (12 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Button | `button` | `label`, `variant`, `size`, `disabled` |
| Link | `link` | `href`, `text`, `external` |
| Tabs | `tabs` | `tabs`, `activeTab`, `variant` |
| Menu | `menu` | `items`, `trigger` |
| Breadcrumbs | `breadcrumbs` | `items`, `separator` |
| Pagination | `pagination` | `total`, `current`, `pageSize` |

### Feedback (12 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Alert | `alert` | `message`, `severity`, `variant`, `closeable` |
| Modal | `modal` | `title`, `content`, `open`, `size` |
| Dialog | `dialog` | `title`, `content`, `open`, `actions` |
| Toast | `toast` | `message`, `variant`, `duration` |
| Snackbar | `snackbar` | `message`, `action`, `duration` |
| Tooltip | `tooltip` | `content`, `placement` |
| Progress | `circular-progress` or `linear-progress` | `value`, `variant`, `size` |
| Skeleton | `skeleton` | `variant`, `width`, `height` |

### Surfaces (11 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Card | `card` | `title`, `content`, `image`, `actions` |
| Panel | `panel` | `title`, `content`, `collapsible` |
| Hero | `hero` | `title`, `subtitle`, `image`, `cta` |
| Feature | `feature` | `icon`, `title`, `description` |
| Well | `well` | `content`, `variant` |

### Media (8 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Image | `image` | `src`, `alt`, `width`, `height`, `rounded` |
| Video | `video` | `src`, `poster`, `controls`, `autoplay` |
| Audio | `audio` | `src`, `controls`, `autoplay` |
| Gallery | `gallery` | `images`, `columns`, `lightbox` |
| Carousel | `carousel` | `items`, `autoplay`, `interval` |

### Advanced (10 components)

| Component | Name | Key Props |
|-----------|------|-----------|
| Dashboard | `dashboard` | `title`, `widgets` |
| Map | `map` | `center`, `zoom`, `markers` |
| Code Block | `code-block` | `code`, `language`, `showLineNumbers` |
| Markdown | `markdown` | `content` |
| Chat | `chat` | `messages`, `currentUser` |
| Widget | `widget` | `title`, `content`, `variant` |

---

## Common Patterns

### Simple Component
```json
{
  "name": "button",
  "templateProps": {
    "label": "Click Me",
    "variant": "primary"
  }
}
```

### Component with Children
```json
{
  "name": "container",
  "templateProps": {
    "padding": "large"
  },
  "children": [
    {
      "name": "text",
      "templateProps": {
        "content": "Hello"
      }
    }
  ]
}
```

### Chart with Data
```json
{
  "name": "line-chart",
  "templateProps": {
    "title": "Sales Trend",
    "series": [
      {
        "label": "2024",
        "data": [100, 150, 200, 180]
      }
    ],
    "xAxis": {
      "data": ["Q1", "Q2", "Q3", "Q4"]
    }
  }
}
```

### Form Layout
```json
{
  "name": "stack",
  "templateProps": {
    "spacing": "medium",
    "direction": "vertical"
  },
  "children": [
    {
      "name": "text-field",
      "templateProps": {
        "label": "Name",
        "required": true
      }
    },
    {
      "name": "text-field",
      "templateProps": {
        "label": "Email",
        "type": "email"
      }
    },
    {
      "name": "button",
      "templateProps": {
        "label": "Submit",
        "variant": "primary"
      }
    }
  ]
}
```

---

## Common Prop Types

### Variants
- **Button/Card/Alert**: `'default'`, `'primary'`, `'secondary'`, `'outlined'`, `'text'`
- **Alert Severity**: `'info'`, `'success'`, `'warning'`, `'error'`

### Sizes
- **Standard**: `'small'`, `'medium'`, `'large'`
- **Text**: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`

### Colors
- `'primary'`, `'secondary'`, `'success'`, `'warning'`, `'error'`, `'info'`

### Layout
- **Direction**: `'horizontal'`, `'vertical'`, `'row'`, `'column'`
- **Alignment**: `'start'`, `'center'`, `'end'`, `'stretch'`, `'baseline'`
- **Justify**: `'start'`, `'center'`, `'end'`, `'between'`, `'around'`, `'evenly'`

---

## Data Formats

### Chart Data (Simple)
```json
{
  "data": [10, 20, 30, 40, 50]
}
```

### Chart Data (Series)
```json
{
  "series": [
    {
      "label": "Series 1",
      "data": [10, 20, 30]
    }
  ],
  "xAxis": {
    "data": ["A", "B", "C"]
  }
}
```

### Table/Grid Data
```json
{
  "columns": [
    { "id": "name", "label": "Name" },
    { "id": "email", "label": "Email" }
  ],
  "rows": [
    { "id": "1", "name": "John", "email": "john@example.com" }
  ]
}
```

### Select/Menu Options
```json
{
  "options": [
    { "value": "1", "label": "Option 1" },
    { "value": "2", "label": "Option 2" }
  ]
}
```

---

**For complete component documentation**: [SCHEMA.md](./SCHEMA.md)
