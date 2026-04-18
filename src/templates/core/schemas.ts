/**
 * Zod Schemas for Component Specifications
 *
 * These schemas serve two purposes:
 * 1. Runtime validation of streamed/generated component specs
 * 2. Schema definitions for the OpenUI Lang library's component registry
 *
 * They mirror the TypeScript types in core/types.ts but provide
 * runtime validation that TypeScript types cannot.
 */

import { z } from 'zod/v4';

// ─── Design System Enums ────────────────────────────────────────────────

export const SurfaceVariantSchema = z.enum([
  'default', 'gradient', 'accent', 'glass', 'elevated', 'subtle', 'transparent',
]);

export const ElevationLevelSchema = z.enum([
  'flat', 'raised', 'floating', 'overlay',
]);

export const EmphasisLevelSchema = z.enum([
  'low', 'medium', 'high',
]);

export const ToneVariantSchema = z.enum([
  'neutral', 'primary', 'accent', 'success', 'warning', 'error', 'info',
]);

export const ChartPaletteSchema = z.enum([
  'default', 'vibrant', 'pastel', 'gradient', 'monochrome', 'semantic',
]);

export const ComponentCategorySchema = z.enum([
  'charts', 'data-display', 'inputs', 'layout', 'navigation',
  'feedback', 'surfaces', 'media', 'advanced', 'legacy',
]);

// ─── Core Metadata ──────────────────────────────────────────────────────

export const ComponentMetadataSchema = z.object({
  description: z.string().optional(),
  generatedAt: z.string().optional(),
  componentId: z.string().optional(),
});

// ─── Component Spec (recursive) ─────────────────────────────────────────

/** Flat type for the recursive ComponentSpec — avoids circular inference. */
interface ComponentSpecShape {
  name?: string;
  templateProps?: Record<string, unknown>;
  type?: string;
  props?: Record<string, unknown>;
  children?: ComponentSpecShape[];
  metadata?: {
    description?: string;
    generatedAt?: string;
    componentId?: string;
  };
}

export const ComponentSpecSchema: z.ZodType<ComponentSpecShape> = z.lazy(() =>
  z.object({
    // New format
    name: z.string().optional(),
    templateProps: z.record(z.string(), z.unknown()).optional(),

    // Legacy format
    type: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),

    // Children (recursive)
    children: z.array(ComponentSpecSchema).optional(),

    // Metadata
    metadata: ComponentMetadataSchema.optional(),
  })
);

export type ComponentSpecZ = ComponentSpecShape;

// ─── Base Template Props ────────────────────────────────────────────────

export const BaseTemplatePropsSchema = z.object({
  variant: SurfaceVariantSchema.optional(),
  elevation: ElevationLevelSchema.optional(),
  emphasis: EmphasisLevelSchema.optional(),
  tone: ToneVariantSchema.optional(),
}).passthrough(); // Allow additional props

// ─── Specific Component Schemas ─────────────────────────────────────────

export const CardPropsSchema = BaseTemplatePropsSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

export const PanelPropsSchema = BaseTemplatePropsSchema.extend({
  title: z.string().optional(),
  content: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});

export const TextPropsSchema = z.object({
  content: z.string(),
  variant: z.enum(['heading', 'subheading', 'body', 'caption', 'label', 'code']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
}).passthrough();

export const ChartPropsSchema = BaseTemplatePropsSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  palette: ChartPaletteSchema.optional(),
  useGradient: z.boolean().optional(),
  data: z.array(z.record(z.string(), z.unknown())).optional(),
  xKey: z.string().optional(),
  yKey: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export const GridPropsSchema = BaseTemplatePropsSchema.extend({
  columns: z.union([
    z.number(),
    z.object({
      xs: z.number().optional(),
      sm: z.number().optional(),
      md: z.number().optional(),
      lg: z.number().optional(),
    }),
  ]).optional(),
  gap: z.enum(['none', 'small', 'medium', 'large']).optional(),
});

export const StackPropsSchema = BaseTemplatePropsSchema.extend({
  direction: z.enum(['horizontal', 'vertical']).optional(),
  spacing: z.enum(['none', 'small', 'medium', 'large']).optional(),
  align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
});

export const SummaryCardPropsSchema = BaseTemplatePropsSchema.extend({
  title: z.string().optional(),
  items: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    trend: z.enum(['up', 'down', 'neutral']).optional(),
  })).optional(),
});

export const FormPropsSchema = BaseTemplatePropsSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  submitLabel: z.string().optional(),
});

export const InputPropsSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'search']).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
}).passthrough();

export const SelectPropsSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  required: z.boolean().optional(),
}).passthrough();

export const AlertPropsSchema = z.object({
  type: ToneVariantSchema.optional(),
  title: z.string().optional(),
  message: z.string().optional(),
}).passthrough();

export const ImagePropsSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  aspectRatio: z.enum(['auto', 'square', '16:9', '4:3', '3:2', '21:9']).optional(),
}).passthrough();

// ─── Schema Registry ────────────────────────────────────────────────────
// Maps component names to their Zod schemas for runtime validation

export const COMPONENT_SCHEMAS: Record<string, z.ZodType<unknown>> = {
  // Surfaces
  'card': CardPropsSchema,
  'panel': PanelPropsSchema,
  'text': TextPropsSchema,

  // Charts
  'line-chart': ChartPropsSchema,
  'bar-chart': ChartPropsSchema,
  'area-chart': ChartPropsSchema,
  'pie-chart': ChartPropsSchema,
  'radar-chart': ChartPropsSchema,

  // Layout
  'grid': GridPropsSchema,
  'stack': StackPropsSchema,

  // Data Display
  'summary-card': SummaryCardPropsSchema,

  // Forms
  'form': FormPropsSchema,
  'input': InputPropsSchema,
  'select': SelectPropsSchema,

  // Feedback
  'alert': AlertPropsSchema,

  // Media
  'image': ImagePropsSchema,
};

/**
 * Validate a component spec against its registered Zod schema.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function validateComponentSpec(spec: unknown): {
  success: boolean;
  data?: ComponentSpecZ;
  errors?: string[];
} {
  const result = ComponentSpecSchema.safeParse(spec);
  if (!result.success) {
    const issues = (result.error as z.ZodError).issues;
    return {
      success: false,
      errors: issues.map(
        (issue: z.core.$ZodIssue) => `${issue.path.join('.')}: ${issue.message}`
      ),
    };
  }

  // If we have a component-specific schema, validate props too
  const componentName = result.data.name || result.data.type;
  const props = result.data.templateProps || result.data.props || {};

  if (componentName && COMPONENT_SCHEMAS[componentName]) {
    const propsResult = COMPONENT_SCHEMAS[componentName].safeParse(props);
    if (!propsResult.success) {
      const propIssues = (propsResult.error as z.ZodError).issues;
      return {
        success: true, // Struct is valid, but props have warnings
        data: result.data,
        errors: propIssues.map(
          (issue: z.core.$ZodIssue) => `[${componentName}] ${issue.path.join('.')}: ${issue.message}`
        ),
      };
    }
  }

  return { success: true, data: result.data };
}
