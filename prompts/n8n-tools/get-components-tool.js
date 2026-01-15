// Component discovery tool for n8n Custom Code Tool
const categories = {
  "charts": {
    "name": "charts",
    "displayName": "Charts",
    "componentCount": 27,
    "components": [
      "area-chart",
      "bar-chart",
      "boxplot-chart",
      "bubble-chart",
      "chord-chart",
      "composed-chart",
      "donut-chart",
      "funnel-chart",
      "gauge-chart",
      "grouped-bar-chart",
      "heatmap-chart",
      "histogram-chart",
      "line-chart",
      "multi-axis-chart",
      "multi-line-chart",
      "pie-chart",
      "polar-chart",
      "radar-chart",
      "radial-bar-chart",
      "sankey-chart",
      "scatter-chart",
      "sparkline-chart",
      "stacked-area-chart",
      "stacked-bar-chart-v2",
      "time-series-chart",
      "treemap-chart",
      "waterfall-chart"
    ]
  },
  "data-display": {
    "name": "data-display",
    "displayName": "Data-display",
    "componentCount": 15,
    "components": [
      "avatar",
      "badge",
      "calendar",
      "chip",
      "data-grid",
      "data-table",
      "gantt",
      "kanban",
      "list",
      "list-item",
      "mind-map",
      "org-chart",
      "timeline",
      "tree-view",
      "virtualized-table"
    ]
  },
  "inputs": {
    "name": "inputs",
    "displayName": "Inputs",
    "componentCount": 20,
    "components": [
      "autocomplete",
      "checkbox",
      "color-picker",
      "date-picker",
      "datetime-picker",
      "file-picker",
      "multi-select",
      "otp-input",
      "radio",
      "range-slider",
      "rating",
      "rich-text-editor",
      "search-input",
      "select",
      "slider",
      "switch",
      "tag-input",
      "text-area",
      "text-field",
      "time-picker"
    ]
  },
  "layout": {
    "name": "layout",
    "displayName": "Layout",
    "componentCount": 15,
    "components": [
      "accordion",
      "appbar",
      "bottom-navigation",
      "breadcrumbs",
      "container",
      "divider",
      "drawer",
      "flexbox",
      "grid",
      "masonry",
      "section",
      "sidebar",
      "spacer",
      "stack",
      "stepper"
    ]
  },
  "navigation": {
    "name": "navigation",
    "displayName": "Navigation",
    "componentCount": 4,
    "components": [
      "button",
      "menu",
      "pagination",
      "tabs"
    ]
  },
  "feedback": {
    "name": "feedback",
    "displayName": "Feedback",
    "componentCount": 9,
    "components": [
      "alert",
      "backdrop",
      "circular-progress",
      "linear-progress",
      "modal",
      "notification",
      "popover",
      "skeleton",
      "tooltip"
    ]
  },
  "surfaces": {
    "name": "surfaces",
    "displayName": "Surfaces",
    "componentCount": 11,
    "components": [
      "avatar-group",
      "callout",
      "feature",
      "frame",
      "hero",
      "insight-card",
      "panel",
      "paper",
      "summary-card",
      "text",
      "well"
    ]
  },
  "media": {
    "name": "media",
    "displayName": "Media",
    "componentCount": 5,
    "components": [
      "audio",
      "carousel",
      "gallery",
      "image",
      "video"
    ]
  },
  "advanced": {
    "name": "advanced",
    "displayName": "Advanced",
    "componentCount": 6,
    "components": [
      "chat",
      "code-block",
      "dashboard",
      "loading-spinner",
      "markdown",
      "widget"
    ]
  }
};

let totalComponents = 0;
for (const category of Object.values(categories)) {
  totalComponents += category.componentCount || (category.components || []).length;
}

let output = '# Available Components (Total: ' + totalComponents + ')\n\n';

for (const category of Object.values(categories)) {
  const count = category.componentCount || (category.components || []).length;
  output += '## ' + category.displayName + ' (' + count + ' components)\n';
  output += (category.components || []).join(', ') + '\n\n';
}

output += '\n## How to Use\n\n';
output += '1. Choose a component from the list above\n';
output += '2. Use the get_component_schema tool to get detailed props for the component\n';
output += '3. Generate JSON using the correct component name and props\n';

return { output };
