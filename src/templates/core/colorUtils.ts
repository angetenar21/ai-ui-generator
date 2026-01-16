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
    return 'text-gray-900 dark:text-white';
  }

  if (isColorDark(backgroundColor)) {
    return '!text-white';
  }

  return '!text-gray-900';
}

/**
 * Returns appropriate secondary text color classes for a given background
 */
export function getSecondaryTextColorForBackground(backgroundColor?: string): string {
  if (!backgroundColor) {
    return 'text-gray-600 dark:text-gray-300';
  }

  if (isColorDark(backgroundColor)) {
    return '!text-gray-200';
  }

  return '!text-gray-600';
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
