/**
 * UI Layout Compiler System
 * 
 * Transforms the AI UI generator from a "component emitter" into a strict "layout compiler".
 * Enforces structural validity through hierarchical contracts and component invariants.
 */

import React from 'react';

// ============================================================================
// NODE TYPES - Hierarchy Levels
// ============================================================================

export const NodeType = {
  // Root Types (Level 0)
  PAGE: 'page',
  DASHBOARD: 'dashboard',
  SCREEN: 'screen',

  // Section (Level 1) - Semantic grouping
  SECTION: 'section',

  // Layout Containers (Level 2)
  GRID: 'grid',
  FLEX: 'flex',
  STACK: 'stack',
  CONTAINER: 'container',
  SPLIT_VIEW: 'split-view',
  ACCORDION: 'accordion',

  // Functional Components (Level 3)
  CARD: 'card',
  TABLE: 'table',
  FORM: 'form',
  CHART: 'chart',
  TABS: 'tabs',
  LIST: 'list',
  TREE: 'tree',
  TIMELINE: 'timeline',
  KANBAN: 'kanban',
  CALENDAR: 'calendar',

  // Atomic Elements (Level 4)
  BUTTON: 'button',
  INPUT: 'input',
  TEXT: 'text',
  BADGE: 'badge',
  ICON: 'icon',
  AVATAR: 'avatar',
  PROGRESS: 'progress',
  SPINNER: 'spinner',
  ALERT: 'alert',
  TOOLTIP: 'tooltip',

  // Data Display
  STATS_CARD: 'stats-card',
  SUMMARY_CARD: 'summary-card',
  DATA_TABLE: 'data-table',
  DATA_GRID: 'data-grid',
  LIST_ITEM: 'list-item',

  // Navigation
  HEADER: 'header',
  SIDEBAR: 'sidebar',
  FOOTER: 'footer',
  NAVIGATION: 'navigation',
  BREADCRUMB: 'breadcrumb',
  TAB_NAVIGATION: 'tab-navigation',
  PAGINATION: 'pagination',
  MENU: 'menu',
  MAIN: 'main',

  // Feedback
  MODAL: 'modal',
  DIALOG: 'dialog',
  NOTIFICATION: 'notification',
  TOAST: 'toast',
  SNACKBAR: 'snackbar',
  LOADING: 'loading',
  PROGRESS_BAR: 'progress-bar',
  SPINNER_LOADER: 'spinner-loader',

  // Charts (Functional)
  LINE_CHART: 'line-chart',
  BAR_CHART: 'bar-chart',
  PIE_CHART: 'pie-chart',
  AREA_CHART: 'area-chart',
  GAUGE_CHART: 'gauge-chart',
  SCATTER_CHART: 'scatter-chart',
  RADAR_CHART: 'radar-chart',
  POLAR_CHART: 'polar-chart',
  HEATMAP: 'heatmap',
  TREE_MAP: 'tree-map',
  FUNNEL_CHART: 'funnel-chart',
  WATERFALL: 'waterfall',
  SANKEY_CHART: 'sankey-chart',
  COMPOSED_CHART: 'composed-chart',
  STACKED_BAR: 'stacked-bar',
  GROUPED_BAR: 'grouped-bar',
  BUBBLE_CHART: 'bubble-chart',
  BOX_PLOT: 'box-plot',
  HISTOGRAM: 'histogram',
  TIME_SERIES: 'time-series',
  SPARKLINE: 'sparkline',
  DONUT_CHART: 'donut-chart',
  RADIAL_BAR: 'radial-bar',

  // Media & Advanced
  IMAGE: 'image',
  VIDEO: 'video',
  CAROUSEL: 'carousel',
  GALLERY: 'gallery',
  MAP: 'map',

  // Surfaces
  PAPER: 'paper',
  PANEL: 'panel',
  HERO: 'hero',
  DIVIDER: 'divider',

  // Advanced
  CHAT: 'chat',
  COMMENTS: 'comments',
  FEEDBACK: 'feedback',
  REVIEW: 'review',
  RATING: 'rating',

  // Layout Special
  PAGE_LAYOUT: 'page-layout',
  FORM_CONTAINER: 'form-container',
  RESPONSIVE_TABLE: 'responsive-table',
  VIRTUALIZED_TABLE: 'virtualized-table',

  // Data Display Advanced
  COHORT_ANALYSIS: 'cohort-analysis',
  DENSITY_PLOT: 'density-plot',

  // Special
  INSIGHT_CARD: 'insight-card',
  NOTIFICATION_PANEL: 'notification-panel',
  DIAGNOSTIC_BLOCK: 'diagnostic-block',
} as const;

export type NodeTypeValue = typeof NodeType[keyof typeof NodeType];

// ============================================================================
// ERROR CODES
// ============================================================================

export const ValidationErrorCode = {
  // Structural Errors
  INVALID_ROOT: 'INVALID_ROOT',
  MISSING_SECTION: 'MISSING_SECTION',
  SECTION_EMPTY: 'SECTION_EMPTY',
  LAYOUT_NO_CHILDREN: 'LAYOUT_NO_CHILDREN',
  LEAF_NO_CONTENT: 'LEAF_NO_CONTENT',

  // Component Invariant Errors
  GRID_MIN_CHILDREN: 'GRID_MIN_CHILDREN',
  TABS_MISMATCH: 'TABS_MISMATCH',
  TABLE_NO_DATA: 'TABLE_NO_DATA',
  FORM_NO_INPUTS: 'FORM_NO_INPUTS',
  FORM_INPUT_NO_LABEL: 'FORM_INPUT_NO_LABEL',
  CARD_NO_CONTENT: 'CARD_NO_CONTENT',
  CHART_NO_DATA: 'CHART_NO_DATA',
  SUMMARY_NO_DATA: 'SUMMARY_NO_DATA',

  // Structural Placement Errors
  COMPONENT_OUTSIDE_LAYOUT: 'COMPONENT_OUTSIDE_LAYOUT',
  ATOMIC_IN_SECTION: 'ATOMIC_IN_SECTION',
  LAYOUT_IN_ATOMIC: 'LAYOUT_IN_ATOMIC',

  // Data Errors
  EMPTY_ARRAY: 'EMPTY_ARRAY',
  INVALID_DATA_TYPE: 'INVALID_DATA_TYPE',

  // Recovery
  AUTO_FIXED: 'AUTO_FIXED',
} as const;

export type ValidationErrorCodeValue = typeof ValidationErrorCode[keyof typeof ValidationErrorCode];

// ============================================================================
// UI SCHEMA TYPES
// ============================================================================

export interface UISchema {
  type: NodeTypeValue;
  id?: string;
  templateProps?: Record<string, unknown>;
  metadata?: {
    componentId?: string;
    generatedAt?: string;
    version?: string;
    description?: string;
  };
  children?: UISchema[];
  content?: string | UISchema;
  condition?: {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not-in';
    value: unknown;
  };
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  treeDepth: number;
  nodeCount: number;
}

export interface ValidationError {
  code: ValidationErrorCodeValue;
  message: string;
  path: string;
  nodeType: NodeTypeValue;
  suggestion?: string;
  recoverable?: boolean;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path: string;
  suggestion?: string;
}

// ============================================================================
// HIERARCHY DEFINITIONS (using string arrays for type safety)
// ============================================================================

const ROOT_TYPES: string[] = ['page', 'dashboard', 'screen'];
const SECTION_TYPES: string[] = ['section'];
const LAYOUT_CONTAINERS: string[] = ['grid', 'flex', 'stack', 'container', 'split-view', 'accordion'];
const FUNCTIONAL_COMPONENTS: string[] = ['card', 'table', 'form', 'chart', 'tabs', 'list', 'tree', 'timeline', 'kanban', 'calendar'];
const ATOMIC_ELEMENTS: string[] = ['button', 'input', 'text', 'badge', 'icon', 'avatar', 'progress', 'spinner', 'alert', 'tooltip'];
const DATA_DISPLAY: string[] = ['stats-card', 'summary-card', 'data-table', 'data-grid', 'list-item'];

// ============================================================================
// VALID CHILDREN MAPPING
// ============================================================================

const VALID_CHILDREN: Record<string, string[]> = {
  'page': [...SECTION_TYPES, ...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY],
  'dashboard': [...SECTION_TYPES, ...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY],
  'screen': [...SECTION_TYPES, ...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY],
  'section': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY],
  'grid': [...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY, ...ATOMIC_ELEMENTS],
  'flex': [...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY, ...ATOMIC_ELEMENTS],
  'stack': [...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY, ...ATOMIC_ELEMENTS],
  'container': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY, ...ATOMIC_ELEMENTS],
  'split-view': ['grid', 'flex', 'stack', ...FUNCTIONAL_COMPONENTS],
  'accordion': ['card', 'list-item'],
  'card': [...ATOMIC_ELEMENTS, 'text', 'chart', 'list'],
  'table': [],
  'form': ['input', 'button', 'text', 'alert'],
  'chart': [],
  'tabs': [...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY, ...ATOMIC_ELEMENTS],
  'list': ['list-item', 'card'],
  'tree': [],
  'timeline': [],
  'kanban': ['card'],
  'calendar': [],
  'button': ['text', 'icon'],
  'input': [],
  'text': [],
  'badge': [],
  'icon': [],
  'avatar': [],
  'progress': [],
  'spinner': [],
  'alert': ['text'],
  'tooltip': ['text', 'icon'],
  'stats-card': [],
  'summary-card': [],
  'data-table': [],
  'data-grid': [],
  'list-item': [...ATOMIC_ELEMENTS, 'text'],
  'header': [...ATOMIC_ELEMENTS, 'sidebar', 'navigation'],
  'sidebar': ['menu', 'list', 'navigation'],
  'footer': [...ATOMIC_ELEMENTS, 'text'],
  'navigation': ['menu', 'list'],
  'breadcrumb': [],
  'tab-navigation': [],
  'pagination': [],
  'menu': ['list-item'],
  'modal': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...ATOMIC_ELEMENTS],
  'dialog': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...ATOMIC_ELEMENTS],
  'notification': ['text', 'alert'],
  'toast': ['text'],
  'snackbar': ['text', 'button'],
  'loading': [],
  'progress-bar': [],
  'spinner-loader': [],
  'line-chart': [],
  'bar-chart': [],
  'pie-chart': [],
  'area-chart': [],
  'gauge-chart': [],
  'scatter-chart': [],
  'radar-chart': [],
  'polar-chart': [],
  'heatmap': [],
  'tree-map': [],
  'funnel-chart': [],
  'waterfall': [],
  'sankey-chart': [],
  'composed-chart': [],
  'stacked-bar': [],
  'grouped-bar': [],
  'bubble-chart': [],
  'box-plot': [],
  'histogram': [],
  'time-series': [],
  'sparkline': [],
  'donut-chart': [],
  'radial-bar': [],
  'image': [],
  'video': [],
  'carousel': ['image'],
  'gallery': ['image'],
  'map': [],
  'paper': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...ATOMIC_ELEMENTS],
  'panel': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...ATOMIC_ELEMENTS],
  'hero': [...ATOMIC_ELEMENTS, 'text', 'button'],
  'divider': [],
  'chat': ['text', 'input', 'button'],
  'comments': ['list', 'form'],
  'feedback': ['rating', 'text', 'button'],
  'review': ['rating', 'text', 'avatar'],
  'rating': [],
  'page-layout': ['header', 'sidebar', 'footer', 'main'],
  'form-container': ['form'],
  'responsive-table': [],
  'virtualized-table': [],
  'cohort-analysis': [],
  'density-plot': [],
  'insight-card': ['text'],
  'notification-panel': ['notification', 'list'],
  'diagnostic-block': ['text', 'alert'],
  'main': [...LAYOUT_CONTAINERS, ...FUNCTIONAL_COMPONENTS, ...DATA_DISPLAY],
};

// Helper function to check if value is in array
function includes<T>(arr: T[], val: unknown): val is T {
  return arr.includes(val as T);
}

// ============================================================================
// VALIDATION PIPELINE
// ============================================================================

export class LayoutValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];
  private nodeCount = 0;
  private treeDepth = 0;

  validate(schema: UISchema, depth = 0, path = ''): ValidationResult {
    this.errors = [];
    this.warnings = [];
    this.nodeCount = 0;
    this.treeDepth = 0;

    this.validateNode(schema, depth, path);

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      treeDepth: this.treeDepth,
      nodeCount: this.nodeCount,
    };
  }

  private validateNode(node: UISchema, depth: number, path: string): void {
    this.nodeCount++;
    this.treeDepth = Math.max(this.treeDepth, depth);
    const nodePath = `${path}/${node.type}`;

    // Validate root
    if (depth === 0) {
      if (!includes(ROOT_TYPES, node.type)) {
        this.errors.push({
          code: ValidationErrorCode.INVALID_ROOT,
          message: `Root must be one of: ${ROOT_TYPES.join(', ')}`,
          path: nodePath,
          nodeType: node.type,
          suggestion: `Change root type to 'page', 'dashboard', or 'screen'`,
        });
      }
    }

    // Validate section has children
    if (includes(SECTION_TYPES, node.type)) {
      if (!node.children || node.children.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.SECTION_EMPTY,
          message: 'Section cannot be empty',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add at least one layout container or functional component',
        });
      }
    }

    // Validate layout containers have children
    if (includes(LAYOUT_CONTAINERS, node.type)) {
      if (!node.children || node.children.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.LAYOUT_NO_CHILDREN,
          message: `Layout container '${node.type}' cannot be empty`,
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add at least one child component',
        });
      }
    }

    // Validate grid has minimum 2 children
    if (node.type === NodeType.GRID) {
      if (!node.children || node.children.length < 2) {
        this.errors.push({
          code: ValidationErrorCode.GRID_MIN_CHILDREN,
          message: 'Grid requires at least 2 children',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add more grid items (minimum 2)',
        });
      }
    }

    // Validate tabs
    if (node.type === NodeType.TABS) {
      const tabs = node.templateProps?.tabs as unknown[] | undefined;
      const panels = node.templateProps?.panels as unknown[] | undefined;

      if (!tabs || tabs.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.TABS_MISMATCH,
          message: 'Tabs component requires tabs array',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add tabs array with tab labels',
        });
      }

      if (!panels || panels.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.TABS_MISMATCH,
          message: 'Tabs component requires panels array',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add panels array with panel content',
        });
      }

      if (tabs && panels && tabs.length !== panels.length) {
        this.errors.push({
          code: ValidationErrorCode.TABS_MISMATCH,
          message: `Tabs (${tabs.length}) and panels (${panels.length}) must have equal length`,
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Ensure tabs and panels arrays have the same number of elements',
        });
      }
    }

    // Validate table
    if (node.type === NodeType.TABLE) {
      const columns = node.templateProps?.columns as unknown[] | undefined;
      const rows = node.templateProps?.rows as unknown[] | undefined;

      if (!columns || columns.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.TABLE_NO_DATA,
          message: 'Table requires columns array',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add columns array with column definitions',
        });
      }

      if (!rows || rows.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.TABLE_NO_DATA,
          message: 'Table requires rows array',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add rows array with data rows',
        });
      }
    }

    // Validate form
    if (node.type === NodeType.FORM) {
      const inputs = node.templateProps?.inputs as unknown[] | undefined;

      if (!inputs || inputs.length === 0) {
        this.errors.push({
          code: ValidationErrorCode.FORM_NO_INPUTS,
          message: 'Form requires inputs array',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add inputs array with form field definitions',
        });
      }

      // Check each input has a label
      if (inputs) {
        inputs.forEach((input, index) => {
          const inputObj = input as Record<string, unknown>;
          if (!inputObj.label && !inputObj.name) {
            this.errors.push({
              code: ValidationErrorCode.FORM_INPUT_NO_LABEL,
              message: `Form input at index ${index} requires a label`,
              path: `${nodePath}/inputs[${index}]`,
              nodeType: node.type,
              suggestion: 'Add label or name property to input',
            });
          }
        });
      }
    }

    // Validate card
    if (node.type === NodeType.CARD) {
      const hasTitle = !!node.templateProps?.title;
      const hasContent = !!node.templateProps?.content || !!node.content;

      if (!hasTitle && !hasContent) {
        this.errors.push({
          code: ValidationErrorCode.CARD_NO_CONTENT,
          message: 'Card requires title or content',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add title or content property to card',
        });
      }
    }

    // Validate chart
    if (node.type === NodeType.CHART) {
      const dataset = node.templateProps?.dataset as unknown[] | undefined;

      if (!dataset || dataset.length < 2) {
        this.errors.push({
          code: ValidationErrorCode.CHART_NO_DATA,
          message: 'Chart requires dataset with at least 2 datapoints',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add dataset array with minimum 2 data points',
        });
      }
    }

    // Validate summary card
    if (node.type === NodeType.SUMMARY_CARD) {
      const hasValue = node.templateProps?.value !== undefined;
      const hasLabel = !!node.templateProps?.label;

      if (!hasValue || !hasLabel) {
        this.errors.push({
          code: ValidationErrorCode.SUMMARY_NO_DATA,
          message: 'Summary card requires value and label',
          path: nodePath,
          nodeType: node.type,
          suggestion: 'Add value and label properties to summary card',
        });
      }
    }

    // Validate children
    if (node.children) {
      const validChildren = VALID_CHILDREN[node.type] || [];

      node.children.forEach((child, index) => {
        const childPath = `${nodePath}/children[${index}]`;

        // Check if child type is valid for parent
        if (!validChildren.includes(child.type)) {
          this.errors.push({
            code: ValidationErrorCode.COMPONENT_OUTSIDE_LAYOUT,
            message: `Invalid child '${child.type}' in parent '${node.type}'`,
            path: childPath,
            nodeType: child.type,
            suggestion: `Valid children: ${validChildren.join(', ')}`,
          });
        }

        this.validateNode(child, depth + 1, childPath);
      });
    }

    // Validate atomic elements don't have complex children
    if (includes(ATOMIC_ELEMENTS, node.type)) {
      if (node.children && node.children.length > 0) {
        const complexChildren = node.children.filter(
          c => includes(LAYOUT_CONTAINERS, c.type) || includes(FUNCTIONAL_COMPONENTS, c.type)
        );
        if (complexChildren.length > 0) {
          this.warnings.push({
            code: 'ATOMIC_WITH_COMPLEX_CHILDREN',
            message: `Atomic element '${node.type}' has complex children`,
            path: nodePath,
            suggestion: 'Consider using a layout container instead',
          });
        }
      }
    }
  }
}

// ============================================================================
// SELF-HEALING SYSTEM
// ============================================================================

export interface HealingResult {
  success: boolean;
  strategy: string;
  originalError: ValidationError;
  healedSchema?: UISchema;
  attempts: number;
}

export interface HealingStrategy {
  code: string;
  name: string;
  description: string;
  applicableErrors: ValidationErrorCodeValue[];
  heal: (schema: UISchema, error: ValidationError) => UISchema | null;
}

const HEALING_STRATEGIES: HealingStrategy[] = [
  {
    code: 'ADD_PLACEHOLDER_CONTENT',
    name: 'Add Placeholder Content',
    description: 'Add placeholder text when component is missing content',
    applicableErrors: [
      ValidationErrorCode.CARD_NO_CONTENT,
      ValidationErrorCode.LEAF_NO_CONTENT,
    ],
    heal: (schema, error) => {
      if (error.code === ValidationErrorCode.CARD_NO_CONTENT) {
        return {
          ...schema,
          templateProps: {
            ...schema.templateProps,
            title: schema.templateProps?.title || 'Untitled Card',
            content: schema.templateProps?.content || 'Card content goes here',
          },
        };
      }
      return null;
    },
  },
  {
    code: 'ADD_DEFAULT_DATASET',
    name: 'Add Default Dataset',
    description: 'Add sample data when chart/table is missing data',
    applicableErrors: [
      ValidationErrorCode.CHART_NO_DATA,
      ValidationErrorCode.TABLE_NO_DATA,
    ],
    heal: (schema, error) => {
      if (error.code === ValidationErrorCode.CHART_NO_DATA) {
        return {
          ...schema,
          templateProps: {
            ...schema.templateProps,
            dataset: schema.templateProps?.dataset || [
              { label: 'Sample A', value: 25 },
              { label: 'Sample B', value: 40 },
              { label: 'Sample C', value: 35 },
            ],
          },
        };
      }
      if (error.code === ValidationErrorCode.TABLE_NO_DATA) {
        return {
          ...schema,
          templateProps: {
            ...schema.templateProps,
            columns: schema.templateProps?.columns || [
              { header: 'Column 1', accessor: 'col1' },
              { header: 'Column 2', accessor: 'col2' },
            ],
            rows: schema.templateProps?.rows || [
              { col1: 'Data 1', col2: 'Data 2' },
              { col1: 'Data 3', col2: 'Data 4' },
            ],
          },
        };
      }
      return null;
    },
  },
  {
    code: 'FILL_MISSING_INPUTS',
    name: 'Fill Missing Form Inputs',
    description: 'Add missing input labels or create default inputs',
    applicableErrors: [
      ValidationErrorCode.FORM_NO_INPUTS,
      ValidationErrorCode.FORM_INPUT_NO_LABEL,
    ],
    heal: (schema, error) => {
      if (error.code === ValidationErrorCode.FORM_NO_INPUTS) {
        return {
          ...schema,
          templateProps: {
            ...schema.templateProps,
            inputs: schema.templateProps?.inputs || [
              { type: 'text', name: 'field1', label: 'Field 1', placeholder: 'Enter value' },
              { type: 'text', name: 'field2', label: 'Field 2', placeholder: 'Enter value' },
            ],
          },
        };
      }
      return null;
    },
  },
  {
    code: 'BALANCE_TABS',
    name: 'Balance Tabs and Panels',
    description: 'Match tabs and panels arrays',
    applicableErrors: [ValidationErrorCode.TABS_MISMATCH],
    heal: (schema, _error) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tabs = schema.templateProps?.tabs as string[] | undefined;
      const panels = schema.templateProps?.panels as { content: string }[] | undefined;

      if (tabs && panels) {
        const maxLength = Math.max(tabs.length, panels.length);
        const newTabs = [...tabs];
        const newPanels = [...panels];

        while (newTabs.length < maxLength) {
          newTabs.push(`Tab ${newTabs.length + 1}`);
        }
        while (newPanels.length < maxLength) {
          newPanels.push({ content: `Panel ${newPanels.length + 1} content` });
        }

        return {
          ...schema,
          templateProps: {
            ...schema.templateProps,
            tabs: newTabs,
            panels: newPanels,
          },
        };
      }
      return null;
    },
  },
  {
    code: 'ADD_GRID_ITEMS',
    name: 'Add Grid Items',
    description: 'Add placeholder items when grid has too few children',
    applicableErrors: [ValidationErrorCode.GRID_MIN_CHILDREN],
    heal: (schema, _error) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const currentChildren = schema.children || [];
      const needed = 2 - currentChildren.length;

      const placeholders: UISchema[] = Array(needed).fill(null).map((_, i) => ({
        type: NodeType.CARD,
        templateProps: {
          title: `Grid Item ${currentChildren.length + i + 1}`,
          content: 'Grid item content',
        },
      }));

      return {
        ...schema,
        children: [...currentChildren, ...placeholders],
      };
    },
  },
  {
    code: 'WRAP_IN_CONTAINER',
    name: 'Wrap in Container',
    description: 'Wrap orphaned components in a container',
    applicableErrors: [ValidationErrorCode.COMPONENT_OUTSIDE_LAYOUT],
    heal: (schema, _error) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return {
        type: NodeType.CONTAINER,
        templateProps: { title: 'Container' },
        children: [schema],
      };
    },
  },
  {
    code: 'ADD_SECTION_WRAPPER',
    name: 'Add Section Wrapper',
    description: 'Wrap components in a section for semantic grouping',
    applicableErrors: [ValidationErrorCode.MISSING_SECTION],
    heal: (schema, _error) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return {
        type: NodeType.SECTION,
        templateProps: { title: 'Section' },
        children: [schema],
      };
    },
  },
];

export class SelfHealer {
  private maxRetries = 20;
  private validator = new LayoutValidator();

  heal(schema: UISchema, error: ValidationError): HealingResult {
    let attempts = 0;
    let currentSchema = schema;

    while (attempts < this.maxRetries) {
      // Find applicable strategy
      const strategy = HEALING_STRATEGIES.find(s =>
        s.applicableErrors.includes(error.code)
      );

      if (!strategy) {
        return {
          success: false,
          strategy: 'NONE',
          originalError: error,
          attempts,
        };
      }

      const healedSchema = strategy.heal(currentSchema, error);

      if (healedSchema) {
        const result = this.validator.validate(healedSchema);

        if (result.valid) {
          return {
            success: true,
            strategy: strategy.code,
            originalError: error,
            healedSchema,
            attempts: attempts + 1,
          };
        }

        currentSchema = healedSchema;
      }

      attempts++;
    }

    return {
      success: false,
      strategy: 'MAX_RETRIES',
      originalError: error,
      attempts,
    };
  }

  healAll(schema: UISchema): { schema: UISchema; results: HealingResult[] } {
    const results: HealingResult[] = [];
    let currentSchema = schema;
    let hasChanges = true;

    while (hasChanges) {
      hasChanges = false;
      const result = this.validator.validate(currentSchema);

      for (const error of result.errors) {
        const healingResult = this.heal(currentSchema, error);
        results.push(healingResult);

        if (healingResult.success && healingResult.healedSchema) {
          currentSchema = healingResult.healedSchema;
          hasChanges = true;
        }
      }
    }

    return { schema: currentSchema, results };
  }
}

// ============================================================================
// DIAGNOSTIC BLOCK COMPONENT
// ============================================================================

export interface DiagnosticBlockProps {
  node: UISchema;
  error: ValidationError;
  suggestion?: string;
  severity?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}

export const DiagnosticBlock: React.FC<DiagnosticBlockProps> = ({
  node,
  error,
  suggestion,
  severity = 'error',
  onDismiss,
}) => {
  const colors = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-300 dark:border-red-700',
      icon: '❌',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-300 dark:border-yellow-700',
      icon: '⚠️',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
    },
  };

  const style = colors[severity];

  return (
    <div
      className={`border-2 rounded-lg p-4 my-4 ${style.bg} ${style.border}`}
      data-diagnostic={error.code}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${style.iconBg}`}>
          <span className="text-lg">{style.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`font-semibold ${style.text}`}>
              {error.code}: {error.message}
            </p>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Node Type: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{node.type}</code>
          </p>
          {suggestion && (
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                💡 Suggestion
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {suggestion}
              </p>
            </div>
          )}
          <details className="mt-3">
            <summary className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
              View Node Details
            </summary>
            <pre className="text-xs mt-2 text-gray-700 dark:text-gray-500 overflow-auto bg-gray-100 dark:bg-black/20 rounded-lg p-3 border border-gray-300 dark:border-gray-700">
              {JSON.stringify(node, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NEVER BLANK FALLBACK
// ============================================================================

export const NEVER_BLANK_FALLBACK: React.FC<{ message?: string }> = ({
  message = 'The UI layout could not be rendered properly.',
}) => {
  return (
    <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700" >
      <div className="text-4xl mb-4" >⚠️</div>
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Layout Error
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        Please check the diagnostic information above.
      </p>
    </div>
  );
};

// ============================================================================
// NEVER NO CONTENT FALLBACK
// ============================================================================

export const NEVER_NO_CONTENT_FALLBACK: React.FC<{
  message?: string;
  suggestion?: string;
}> = ({
  message = 'This component has no content to display.',
  suggestion = 'Try adding some content or selecting a different component.',
}) => {
    return (
      <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center">
          <div className="text-3xl mb-3">📭</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {message}
          </p>
          {
            suggestion && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {suggestion}
              </p>
            )}
        </div>
      </div>
    );
  };

// ============================================================================
// SAFE CONTENT
// ============================================================================

export const SafeContent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackMessage?: string;
}> = ({
  children,
  fallback,
  fallbackMessage,
}) => {
    // Check if children is null, undefined, or empty
    if (children === null || children === undefined) {
      return fallback || <NEVER_NO_CONTENT_FALLBACK message={fallbackMessage} />;
    }

    // Check for empty string
    if (typeof children === 'string' && children.trim() === '') {
      return fallback || <NEVER_NO_CONTENT_FALLBACK message={fallbackMessage} />;
    }

    // Check for empty array
    if (Array.isArray(children) && children.length === 0) {
      return fallback || <NEVER_NO_CONTENT_FALLBACK message={fallbackMessage} />;
    }

    return <>{children} </>;
  };

// ============================================================================
// DIAGNOSTIC ERROR BOUNDARY
// ============================================================================

export class DiagnosticErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[DiagnosticErrorBoundary] Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 border-2 border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20" >
            <div className="flex items-start gap-3" >
              <span className="text-2xl" >💥</span>
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">
                  Component Render Error
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {this.state.error?.message || 'An unknown error occurred'}
                </p>
                {
                  this.state.error?.stack && (
                    <details className="mt-3" >
                      <summary className="text-sm text-red-700 dark:text-red-400 cursor-pointer" >
                        View Stack Trace
                      </summary>
                      <pre className="text-xs mt-2 text-red-600 dark:text-red-500 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )
                }
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// VALIDATION SUMMARY
// ============================================================================

export const ValidationSummary: React.FC<{
  errors: ValidationError[];
  warnings?: { message: string; code: string; path?: string }[];
  passed: boolean;
  nodeCount: number;
  treeDepth: number;
}> = ({ errors, warnings = [], passed, nodeCount, treeDepth }) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">Layout Validation Report</h3>
        {passed ? (
          <span className="text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-sm">PASSED</span>
        ) : (
          <span className="text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded text-sm">FAILED</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Total Nodes:</span>
          <span className="ml-2 font-mono font-medium">{nodeCount}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Max Depth:</span>
          <span className="ml-2 font-mono font-medium">{treeDepth}</span>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
            <span>🚫</span>
            <span className="font-medium">{errors.length} Error{errors.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className="text-sm p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/30 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-red-700 dark:text-red-300 font-bold text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 rounded">
                    {error.code}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={error.path}>
                    {error.path}
                  </span>
                </div>
                <span className="text-red-800 dark:text-red-200">{error.message}</span>
                {error.suggestion && (
                  <div className="text-xs text-red-700 dark:text-red-300 mt-1 flex items-start gap-1">
                    <span>💡</span>
                    <span>{error.suggestion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
            <span>⚠️</span>
            <span className="font-medium">{warnings.length} Warning{warnings.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="text-sm p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-200 dark:border-yellow-900/30 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-yellow-700 dark:text-yellow-300 font-bold text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                    {warning.code}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={warning.path}>
                    {warning.path}
                  </span>
                </div>
                <span className="text-yellow-800 dark:text-yellow-200">{warning.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE VALID UI TREES
// ============================================================================

export const VALID_DASHBOARD_TREE: UISchema = {
  type: NodeType.DASHBOARD,
  templateProps: {
    title: 'Analytics Dashboard',
    variant: 'elevated',
    tone: 'neutral',
  },
  metadata: {
    componentId: 'dashboard-001',
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
  },
  children: [
    {
      type: NodeType.SECTION,
      templateProps: {
        title: 'Key Metrics',
        description: 'Overview of important KPIs',
      },
      children: [
        {
          type: NodeType.GRID,
          templateProps: { columns: 4, gap: 4 },
          children: [
            { type: NodeType.STATS_CARD, templateProps: { title: 'Revenue', value: '$124,500', change: { value: 12.5, label: 'vs last month' } } },
            { type: NodeType.STATS_CARD, templateProps: { title: 'Users', value: '12,345', change: { value: 8.2, label: 'vs last month' } } },
            { type: NodeType.STATS_CARD, templateProps: { title: 'Conversion', value: '3.24%', change: { value: -2.1, label: 'vs last month' } } },
            { type: NodeType.STATS_CARD, templateProps: { title: 'Orders', value: '1,234', change: { value: 15.3, label: 'vs last month' } } },
          ],
        },
      ],
    },
    {
      type: NodeType.SECTION,
      templateProps: { title: 'Performance Trends' },
      children: [
        {
          type: NodeType.GRID,
          templateProps: { columns: 2, gap: 4 },
          children: [
            {
              type: NodeType.CHART,
              templateProps: {
                title: 'Revenue Over Time',
                chartType: 'line',
                dataset: [
                  { date: '2024-01-01', value: 12500 },
                  { date: '2024-01-02', value: 15200 },
                  { date: '2024-01-03', value: 11800 },
                  { date: '2024-01-04', value: 18900 },
                  { date: '2024-01-05', value: 22100 },
                ],
              }
            },
            {
              type: NodeType.CHART,
              templateProps: {
                title: 'User Growth',
                chartType: 'bar',
                dataset: [
                  { week: 'Week 1', users: 2500 },
                  { week: 'Week 2', users: 3200 },
                  { week: 'Week 3', users: 4100 },
                  { week: 'Week 4', users: 5100 },
                ],
              }
            },
          ],
        },
      ],
    },
  ],
};

export const VALID_PAGE_TREE: UISchema = {
  type: NodeType.PAGE,
  templateProps: { title: 'User Profile' },
  children: [
    {
      type: NodeType.SECTION,
      children: [
        {
          type: NodeType.CARD,
          templateProps: {
            title: 'Profile Information',
            content: 'Manage your account settings and preferences.',
          },
        },
      ],
    },
  ],
};

// ============================================================================
// MAIN EXPORTS
// ============================================================================

export const LayoutCompiler = {
  NodeType,
  ValidationErrorCode,
  LayoutValidator,
  SelfHealer,
  DiagnosticBlock,
  SafeContent,
  NEVER_BLANK_FALLBACK,
  NEVER_NO_CONTENT_FALLBACK,
  DiagnosticErrorBoundary,
  ValidationSummary,
  VALID_DASHBOARD_TREE,
  VALID_PAGE_TREE,
};

export default LayoutCompiler;
