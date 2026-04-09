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

export type SurfaceVariant = 'default' | 'gradient' | 'accent' | 'glass' | 'elevated' | 'subtle' | 'transparent';

export const surfaces: Record<SurfaceVariant, string> = {
  // Default: Clean white surface with subtle ring highlight for depth
  default: 'bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 ring-1 ring-black/[0.04] dark:ring-white/[0.04]',

  // Gradient: Rich warm gradient background for dashboard hero panels
  gradient: 'bg-gradient-to-br from-orange-100 via-rose-50 to-pink-50/30 dark:from-emerald-950/40 dark:via-gray-900 dark:to-gray-900 border border-orange-200/60 dark:border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',


  // Accent: Vibrant orange border glow for primary KPI emphasis
  accent: 'bg-white dark:bg-gray-900 border-2 border-orange-500 dark:border-emerald-400 shadow-[0_0_0_4px_rgba(249,115,22,0.08),0_4px_16px_rgba(249,115,22,0.15)] dark:shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_4px_20px_rgba(16,185,129,0.4)]',

  // Glass: Semi-transparent glassmorphism with warm inner glow
  glass: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-800/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',

  // Elevated: Tinted background for section-level depth
  elevated: 'bg-gray-50/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',

  // Subtle: Minimal visual weight
  subtle: 'bg-transparent border border-gray-100 dark:border-gray-800',

  // Transparent: No background or border, seamlessly integrates into parent container
  transparent: 'bg-transparent border-none shadow-none',
};

// ============================================================================
// ELEVATION LEVELS
// ============================================================================

export type ElevationLevel = 'flat' | 'raised' | 'floating' | 'overlay';

export const elevation: Record<ElevationLevel, string> = {
  // Flat: No shadow
  flat: 'shadow-none',

  // Raised: Warm layered shadow for cards
  raised: 'shadow-[0_2px_8px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07),0_12px_32px_rgba(0,0,0,0.1)] transition-shadow duration-300',

  // Floating: Deep shadow for dashboard panels
  floating: 'shadow-[0_4px_16px_rgba(0,0,0,0.07),0_16px_48px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1),0_24px_64px_rgba(0,0,0,0.14)] transition-shadow duration-300',

  // Overlay: Strong atmospheric shadow for modals and hero sections
  overlay: 'shadow-[0_8px_32px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.16),0_1px_4px_rgba(0,0,0,0.06)]',
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
    bg: 'bg-orange-50 dark:bg-[#1A2E26]',
    border: 'border-orange-200 dark:border-[#1A2E26]',
    text: 'text-orange-900 dark:text-white',
  },
  accent: {
    bg: 'bg-rose-50 dark:bg-[#152D2E]',
    border: 'border-rose-200 dark:border-[#152D2E]',
    text: 'text-rose-900 dark:text-white',
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
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#14B8A6', // Teal
    '#F59E0B', // Amber
    '#06b6d4', // Cyan
  ],

  // Vibrant: High saturation, energetic
  vibrant: [
    '#FF6B35', // Vibrant Emerald
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
    '#FF6B6B', // Red-Emerald
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#C65BCF', // Purple
    '#FF8C42', // Emerald
    '#45B7D1', // Cyan
    '#F67280', // Pink
  ],

  // Monochrome: Shades of orange (brand color)
  monochrome: [
    '#FFF7ED', // Lightest
    '#FFEDD5', // Lighter
    '#FDBA74', // Light
    '#FB923C', // Medium-Light
    '#F97316', // Base
    '#EA580C', // Medium-Dark
    '#C2410C', // Dark
    '#7C2D12', // Darkest
  ],

  // Semantic: Purpose-driven colors
  semantic: [
    '#F97316', // Success (orange brand)
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
  emerald: {
    from: '#F97316',
    to: '#EC4899',
    stops: [
      { offset: '0%', color: '#F97316', opacity: 0.8 },
      { offset: '100%', color: '#EC4899', opacity: 0.2 },
    ],
  },
  green: {
    from: '#FB923C',
    to: '#F472B6',
    stops: [
      { offset: '0%', color: '#FB923C', opacity: 0.8 },
      { offset: '100%', color: '#F472B6', opacity: 0.2 },
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
  if (variant === 'transparent') {
    return surfaces[variant];
  }
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
    emerald: chartGradients.emerald,
    green: chartGradients.green,
    purple: chartGradients.purple,
    blue: chartGradients.blue,
  };

  const gradient = gradients[baseColor as keyof typeof gradients] || gradients.emerald;

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
// TYPE EXPORTS (types are already exported inline above)
// ============================================================================
