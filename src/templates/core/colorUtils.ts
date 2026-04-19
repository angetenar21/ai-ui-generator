/**
 * Color Utilities
 * Helpers for determining text colors based on background colors
 */

/**
 * Determines if a hex color is dark
 * Returns true if the color is dark (requires light text)
 */
export function isColorDark(hexColor: string): boolean {
  if (!hexColor) return false;

  // Remove # if present
  let hex = hexColor.replace('#', '');

  // Handle short hex (e.g., #fff -> #ffffff)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // If not valid hex, assume it's not dark
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return false;
  }

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if luminance is less than 0.5 (dark color)
  return luminance < 0.5;
}

/**
 * Returns appropriate text color classes for a given background color
 */
export function getTextColorForBackground(backgroundColor?: string): string {
  if (!backgroundColor) {
    return 'text-zinc-900 dark:text-white';
  }

  if (isColorDark(backgroundColor)) {
    return '!text-white';
  }

  return '!text-zinc-900';
}

/**
 * Returns appropriate secondary text color classes for a given background
 */
export function getSecondaryTextColorForBackground(backgroundColor?: string): string {
  if (!backgroundColor) {
    return 'text-zinc-600 dark:text-zinc-300';
  }

  if (isColorDark(backgroundColor)) {
    return '!text-zinc-200';
  }

  return '!text-zinc-600';
}

/**
 * Extracts background color from inline style object or string
 */
export function extractBackgroundColor(style?: React.CSSProperties | string): string | undefined {
  if (!style) return undefined;

  if (typeof style === 'string') {
    // Parse style string (e.g., "background-color: #123456; color: red")
    const match = style.match(/background-color\s*:\s*([^;]+)/i);
    return match ? match[1].trim() : undefined;
  }

  // Handle CSSProperties object
  return style.backgroundColor as string | undefined;
}

// ---------------------------------------------------------------------------
// Shared chart theming utilities
// ---------------------------------------------------------------------------

/**
 * Returns centralized, dark-mode-aware chart color tokens.
 * Accepts the resolved boolean `isDark` so charts re-style instantly when the
 * user toggles dark / light mode without any extra hook magic.
 *
 * Usage inside a chart component:
 *   const theme = useAppStore(s => s.theme);
 *   const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
 *   const ct = getChartTheme(isDark);
 */
export function getChartTheme(isDark: boolean) {
  return {
    /** Semi-transparent axis line / tick stroke */
    axisStroke:    isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
    /** Tick-label text fill */
    tickLabel:     isDark ? '#D1D5DB' : '#4B5563',
    /** Legend label text fill */
    legendText:    isDark ? '#D1D5DB' : '#374151',
    /** Dashed grid-line stroke */
    gridLine:      isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    /** Tooltip paper background */
    tooltipBg:     isDark ? '#1e2535' : '#ffffff',
    /** Tooltip border */
    tooltipBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    /** Tooltip text */
    tooltipText:   isDark ? '#F9FAFB' : '#111827',
    /** Raw flag — useful for one-off conditional styles */
    isDark,
  } as const;
}

/**
 * Generates the shared MUI X Charts `sx` prop for consistent axis / legend /
 * grid / tooltip styling across all chart components.
 *
 * @param ct            - Result of getChartTheme(isDark)
 * @param labelRotation - Degrees to rotate x-axis tick labels (0 = none)
 * @param extra         - Any additional sx overrides, spread last
 */
export function buildChartSx(
  ct: ReturnType<typeof getChartTheme>,
  labelRotation: number = 0,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    // ── Axis lines & ticks ───────────────────────────────────────────────
    '& .MuiChartsAxis-line': {
      stroke: ct.axisStroke,
      strokeWidth: 1.5,
    },
    '& .MuiChartsAxis-tick': {
      stroke: ct.axisStroke,
      strokeWidth: 1,
    },
    // ── Tick labels ──────────────────────────────────────────────────────
    '& .MuiChartsAxis-tickLabel': {
      fill: ct.tickLabel,
      fontFamily: 'inherit',
      fontSize: '12px',
      fontWeight: 500,
      ...(labelRotation !== 0
        ? { transform: `rotate(${labelRotation}deg)`, textAnchor: 'end' }
        : {}),
    },
    // ── Legend ───────────────────────────────────────────────────────────
    '& .MuiChartsLegend-root': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    '& .MuiChartsLegend-series': {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    '& .MuiChartsLegend-series text': {
      fill: `${ct.legendText} !important`,
      fontFamily: 'inherit',
      fontSize: '12px',
      fontWeight: 500,
    },
    '& .MuiChartsLegend-mark': {
      rx: 3,
      width: '10px',
      height: '10px',
    },
    // ── Grid lines ───────────────────────────────────────────────────────
    '& .MuiChartsGrid-line': {
      stroke: ct.gridLine,
      strokeDasharray: '4 3',
      opacity: 1,
    },
    // ── Tooltip ──────────────────────────────────────────────────────────
    '& .MuiChartsTooltip-root': {
      backgroundColor: `${ct.tooltipBg} !important`,
      border: `1px solid ${ct.tooltipBorder} !important`,
      borderRadius: '10px !important',
      boxShadow: ct.isDark
        ? '0 8px 32px rgba(0,0,0,0.4) !important'
        : '0 4px 20px rgba(0,0,0,0.08) !important',
    },
    '& .MuiChartsTooltip-labelCell, & .MuiChartsTooltip-valueCell': {
      color: `${ct.tooltipText} !important`,
      fontFamily: 'inherit',
      fontSize: '12px',
    },
    ...extra,
  };
}
