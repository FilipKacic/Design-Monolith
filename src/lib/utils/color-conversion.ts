// ── HSL → Hex conversion ──────────────────────────────────────────────────────
//
// Standard HSL-to-RGB algorithm via chroma (c), intermediate value (x),
// and match value (m). All three color palettes in this project use HSL,
// so this is the only conversion path needed.

/**
 * Converts HSL colour values to a hex string (e.g. "#a3c4f1").
 * Accepts the standard CSS ranges: H 0–360, S 0–100, L 0–100.
 * Floats are supported on all channels for sub-degree precision.
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;          // chroma
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1)); // intermediate value
  const m = l - c / 2;                               // brightness offset

  let r = 0, g = 0, b = 0;
  if      (h <  60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  // padStart guarantees two digits for values 0–15 (e.g. "0a" not "a")
  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── CSS variable → Hex ────────────────────────────────────────────────────────
//
// Reads the computed HSL value of a CSS custom property from the document root
// and converts it to hex. Returns #000000 on SSR or if the variable is unset.
//
// The regex handles:
//   - Modern space-separated syntax:  hsl(120 50% 75%)
//   - Legacy comma-separated syntax:  hsl(120, 50%, 75%)
//   - Optional deg unit on hue:       hsl(120deg 50% 75%)
//   - Decimal values on all channels: hsl(213.5 78.4% 52.3%)

const HSL_REGEX = /hsl\((\d+(?:\.\d+)?)(?:deg)?,?\s*(\d+(?:\.\d+)?)%,?\s*(\d+(?:\.\d+)?)%\)/;

/**
 * Resolves a CSS custom property (e.g. "--color-primary") to a hex string.
 * Returns #000000 if called during SSR or if the property is unset/unparseable.
 */
export function getHexFromVariable(variable: string): string {
  if (typeof window === 'undefined') return '#000000'; // SSR guard

  const hslValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  const match = hslValue.match(HSL_REGEX);
  if (!match) return '#000000';

  return hslToHex(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
}

// ── Palette → hex array ───────────────────────────────────────────────────────

/** Maps an array of palette entries to their resolved hex colour strings. */
export function getPaletteHexColors(palette: Array<{ variable: string }>): string[] {
  return palette.map(({ variable }) => getHexFromVariable(variable));
}