/**
 * DESIGN TOKEN SYSTEM
 *
 * Centralized design tokens for the AI UI Generator.
 * Provides visual hierarchy, surface variants, elevation, and color palettes.
 *
 * Usage:
 * - Import design tokens: import { surfaces, elevation, chartPalettes } from '@/theme/designTokens'
 * - Use in components: className={surfaces[variant]}
 */

// ============================================================================
// SURFACE VARIANTS
// ============================================================================

export type SurfaceVariant = 'default' | 'gradient' | 'accent' | 'glass' | 'elevated' | 'subtle';

export const surfaces: Record<SurfaceVariant, string> = {
  // Default: Clean white surface with subtle border
  default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',

  // Gradient: Warm gradient background for emphasis
  gradient: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950 dark:via-amber-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800',

  // Accent: Vibrant accent color for high emphasis
  accent: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white border border-orange-600',

  // Glass: Semi-transparent glassmorphism effect
  glass: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/20',

  // Elevated: Subtle background elevation
  elevated: 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',

  // Subtle: Minimal visual weight
  subtle: 'bg-transparent border border-gray-100 dark:border-gray-800',
};

// ============================================================================
// ELEVATION LEVELS
// ============================================================================

export type ElevationLevel = 'flat' | 'raised' | 'floating' | 'overlay';

export const elevation: Record<ElevationLevel, string> = {
  // Flat: No shadow
  flat: 'shadow-none',

  // Raised: Subtle shadow for cards
  raised: 'shadow-md hover:shadow-lg transition-shadow duration-300',

  // Floating: Medium shadow for elevated elements
  floating: 'shadow-xl hover:shadow-2xl transition-shadow duration-300',

  // Overlay: Strong shadow for modals and overlays
  overlay: 'shadow-2xl',
};

// ============================================================================
// EMPHASIS LEVELS
// ============================================================================

export type EmphasisLevel = 'low' | 'medium' | 'high';

export const emphasis: Record<EmphasisLevel, { scale: string; border: string }> = {
  low: {
    scale: 'scale-100',
    border: 'border',
  },
  medium: {
    scale: 'scale-100 hover:scale-[1.02] transition-transform duration-300',
    border: 'border-2',
  },
  high: {
    scale: 'scale-100 hover:scale-[1.03] transition-transform duration-300',
    border: 'border-2 ring-2 ring-orange-500/20',
  },
};

// ============================================================================
// TONE VARIANTS
// ============================================================================

export type ToneVariant = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export const tones: Record<ToneVariant, { bg: string; border: string; text: string }> = {
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-900 dark:text-gray-100',
  },
  primary: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-900 dark:text-orange-100',
  },
  accent: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
  },
};

// ============================================================================
// CHART COLOR PALETTES
// ============================================================================

export type ChartPaletteType = 'default' | 'vibrant' | 'pastel' | 'gradient' | 'monochrome' | 'semantic';

export const chartPalettes: Record<ChartPaletteType, string[]> = {
  // Default: Balanced, professional colors
  default: [
    '#F97316', // Orange
    '#10B981', // Green
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#14B8A6', // Teal
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#EF4444', // Red
  ],

  // Vibrant: High saturation, energetic
  vibrant: [
    '#FF6B35', // Vibrant Orange
    '#00D9FF', // Cyan
    '#FF006E', // Magenta
    '#8338EC', // Purple
    '#FFBE0B', // Yellow
    '#06FFA5', // Mint
    '#4361EE', // Blue
    '#FF5A5F', // Coral
  ],

  // Pastel: Soft, gentle colors
  pastel: [
    '#FFB4A2', // Peach
    '#B5EAD7', // Mint
    '#C7CEEA', // Lavender
    '#FFDAC1', // Cream
    '#E2F0CB', // Lime
    '#FFC6FF', // Pink
    '#CAFFBF', // Green
    '#A0C4FF', // Blue
  ],

  // Gradient: Colors designed for gradient charts
  gradient: [
    '#FF6B6B', // Red-Orange
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#C65BCF', // Purple
    '#FF8C42', // Orange
    '#45B7D1', // Cyan
    '#F67280', // Pink
  ],

  // Monochrome: Shades of orange (brand color)
  monochrome: [
    '#FFF4E6', // Lightest
    '#FFE4CC', // Lighter
    '#FFC299', // Light
    '#FF9F66', // Medium-Light
    '#F97316', // Base
    '#DC5A00', // Medium-Dark
    '#B94800', // Dark
    '#8B3600', // Darkest
  ],

  // Semantic: Purpose-driven colors
  semantic: [
    '#10B981', // Success
    '#F59E0B', // Warning
    '#EF4444', // Error
    '#3B82F6', // Info
    '#8B5CF6', // Feature
    '#EC4899', // Premium
    '#14B8A6', // Active
    '#6B7280', // Neutral
  ],
};

// ============================================================================
// CHART GRADIENT DEFINITIONS
// ============================================================================

export const chartGradients = {
  orange: {
    from: '#FF6B35',
    to: '#F59E0B',
    stops: [
      { offset: '0%', color: '#FF6B35', opacity: 0.8 },
      { offset: '100%', color: '#F59E0B', opacity: 0.2 },
    ],
  },
  green: {
    from: '#10B981',
    to: '#14B8A6',
    stops: [
      { offset: '0%', color: '#10B981', opacity: 0.8 },
      { offset: '100%', color: '#14B8A6', opacity: 0.2 },
    ],
  },
  purple: {
    from: '#8B5CF6',
    to: '#EC4899',
    stops: [
      { offset: '0%', color: '#8B5CF6', opacity: 0.8 },
      { offset: '100%', color: '#EC4899', opacity: 0.2 },
    ],
  },
  blue: {
    from: '#3B82F6',
    to: '#14B8A6',
    stops: [
      { offset: '0%', color: '#3B82F6', opacity: 0.8 },
      { offset: '100%', color: '#14B8A6', opacity: 0.2 },
    ],
  },
};

// ============================================================================
// TYPOGRAPHY SCALES
// ============================================================================

export type TypographyScale = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

export const typography: Record<TypographyScale, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl font-semibold',
  '3xl': 'text-3xl font-bold',
};

// ============================================================================
// SPACING SCALES
// ============================================================================

export type SpacingScale = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const spacing: Record<SpacingScale, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
};

// ============================================================================
// BORDER RADIUS SCALES
// ============================================================================

export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const radius: Record<RadiusScale, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const animations = {
  fadeIn: 'animate-slide-up',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce-dot',
  gradient: 'animate-gradient',
  twinkle: 'animate-twinkle',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines surface variant with elevation level
 */
export function getSurfaceClasses(
  variant: SurfaceVariant = 'default',
  elevationLevel: ElevationLevel = 'raised'
): string {
  return `${surfaces[variant]} ${elevation[elevationLevel]}`;
}

/**
 * Combines tone with emphasis
 */
export function getToneClasses(
  tone: ToneVariant = 'neutral',
  emphasisLevel: EmphasisLevel = 'medium'
): string {
  const toneClasses = tones[tone];
  const emphasisClasses = emphasis[emphasisLevel];
  return `${toneClasses.bg} ${toneClasses.border} ${toneClasses.text} ${emphasisClasses.border} ${emphasisClasses.scale}`;
}

/**
 * Gets chart colors for a specific palette
 */
export function getChartColors(palette: ChartPaletteType = 'default'): string[] {
  return chartPalettes[palette];
}

/**
 * Creates a gradient color array for area/line charts
 */
export function getGradientColors(baseColor: string, count: number = 8): string[] {
  const gradients = {
    orange: chartGradients.orange,
    green: chartGradients.green,
    purple: chartGradients.purple,
    blue: chartGradients.blue,
  };

  const gradient = gradients[baseColor as keyof typeof gradients] || gradients.orange;

  // Generate interpolated colors
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    colors.push(interpolateGradient(gradient.from, gradient.to, ratio));
  }

  return colors;
}

/**
 * Simple color interpolation
 */
function interpolateGradient(color1: string, color2: string, ratio: number): string {
  const hex = (color: string) => parseInt(color.slice(1), 16);
  const r1 = (hex(color1) >> 16) & 0xff;
  const g1 = (hex(color1) >> 8) & 0xff;
  const b1 = hex(color1) & 0xff;

  const r2 = (hex(color2) >> 16) & 0xff;
  const g2 = (hex(color2) >> 8) & 0xff;
  const b2 = hex(color2) & 0xff;

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Generates random palette colors
 */
export function getRandomPalette(): string[] {
  const palettes = Object.keys(chartPalettes) as ChartPaletteType[];
  const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
  return chartPalettes[randomPalette];
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  SurfaceVariant,
  ElevationLevel,
  EmphasisLevel,
  ToneVariant,
  ChartPaletteType,
  TypographyScale,
  SpacingScale,
  RadiusScale,
};
