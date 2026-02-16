// src/lib/utils/color-conversion.ts

/**
 * Convert HSL to Hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Get hex value from CSS variable
 */
export function getHexFromVariable(variable: string): string {
  if (typeof window === 'undefined') return '#000000';
  
  const styles = getComputedStyle(document.documentElement);
  const hslValue = styles.getPropertyValue(variable).trim();
  
  const match = hslValue.match(/hsl\((\d+)(?:deg)?,?\s*(\d+)%,?\s*(\d+)%\)/);
  if (!match) return '#000000';
  
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  
  return hslToHex(h, s, l);
}

/**
 * Get palette colors as hex array
 */
export function getPaletteHexColors(
  palette: Array<{ variable: string }>
): string[] {
  return palette.map(({ variable }) => getHexFromVariable(variable));
}