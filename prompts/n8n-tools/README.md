# n8n Tool Codes for AI UI Generator

This directory contains JavaScript code for n8n tools that provide component discovery and schema information to the AI agent.

## Tools

### 1. get-components-tool.js
**Purpose:** Returns a list of all available components organized by category.

**Usage in n8n:**
1. Create a new "Code" node in your n8n workflow
2. The component library schema is already embedded in the file
3. Copy the entire code from `get-components-tool.js`
4. The tool will output a formatted string with categorized component information

**Output Format (String):**
```
# Available Components (Total: 112)

## Charts (27 components)
Components: area-chart, bar-chart, boxplot-chart, bubble-chart, chord-chart, ...

## Data-display (15 components)
Components: avatar, badge, calendar, chip, data-grid, ...

...
```

### 2. get-component-schema-tool.js
**Purpose:** Returns detailed schema information for one or more components.

**Input Parameter:** `componentNames` (string or array of strings)
- Single component: `"line-chart"`
- Multiple components: `["line-chart", "bar-chart", "text"]`

**Usage in n8n:**
1. Create a new "Code" node in your n8n workflow
2. The component library schema is already embedded in the file
3. Copy the entire code from `get-component-schema-tool.js`
4. Pass component names via the input parameter `componentNames`

**Output Format (String):**
```
# Component Schema Information

Requested: 2 component(s)
Found: 2 component(s)

## line-chart
**Category:** charts
**Description:** Line chart for visualizing trends over time...
**Tags:** chart, line, trend, time-series, data-visualization

### Props:
- **title** (string)
  The title displayed above the chart
  
- **xAxis** (object) *required*
  Configuration for the X-axis including data and label
  
- **series** (array) *required*
  Array of data series to plot on the chart
  
---

## bar-chart
...
```

## Setup Instructions

### Step 1: Locate the Tool Files
The n8n tool files are already complete with embedded schemas:
```
/prompts/n8n-tools/get-components-tool.js
/prompts/n8n-tools/get-component-schema-tool.js
```

### Step 2: Create n8n Tool Nodes

For each tool:

1. **Add a Code Node** in your n8n workflow
2. **Copy the entire file content** into the Code node
3. **Configure the node:**
   - For `get-components-tool`: No input needed
   - For `get-component-schema-tool`: Configure input parameter `componentNames`
4. **Set the output** to use the string response

### Step 3: Connect to AI Agent

Configure your AI agent (n8n AI Agent node) to call these tools when needed:
- **Tool 1:** `get_components`
  - Description: See embedded `toolDescription` constant
  - Input Schema: See embedded `toolInputSchema` constant
  - Output: Formatted string with all components by category

- **Tool 2:** `get_component_schema`
  - Description: See embedded `toolDescription` constant  
  - Input Schema: See embedded `toolInputSchema` constant
  - Output: Formatted string with detailed prop information

The AI agent will use these tools to:
1. Discover available components
2. Get detailed prop information
3. Generate valid JSON configurations

## Example Workflow

```
User Input
    ↓
AI Agent Node
    ↓
    ├→ get_components (discovers available components)
    |  Returns: Formatted string listing all 112 components by category
    ↓
    ├→ get_component_schema (gets props for selected components)
    |  Input: ["line-chart", "summary-card", "stack"]
    |  Returns: Formatted string with detailed prop schemas
    ↓
    └→ Returns valid JSON with correct component structure
```

## Notes

- Both tools return **formatted strings** (not JSON objects) for better AI readability
- The component schema is **already embedded** in each tool file
- These tools are read-only and don't modify any data
- No external API calls needed - everything is self-contained
- To update schemas, regenerate them with `npm run generate-schema` in the main project, then update the `allComponentSchema` constant in each tool file
