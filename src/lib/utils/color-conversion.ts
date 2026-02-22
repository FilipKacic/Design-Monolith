// ── HSL → Hex conversion ──────────────────────────────────────────────────────
// Standard HSL-to-RGB algorithm via chroma (c), intermediate value (x),
// and match value (m). All three color palettes in this project use HSL,
// so this is the only conversion path needed.

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;           // chroma
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));  // intermediate
  const m = l - c / 2;                                // match (brightness offset)

  let r = 0, g = 0, b = 0;

  if      (h <  60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── CSS variable → Hex ────────────────────────────────────────────────────────
// Reads the computed HSL value of a CSS custom property from the document root
// and converts it to hex. Returns #000000 on SSR or if the variable is unset.
//
// The regex handles both modern `hsl(120 50% 75%)` and legacy `hsl(120, 50%, 75%)`
// syntax, as well as the optional `deg` unit on the hue channel.

export function getHexFromVariable(variable: string): string {
  if (typeof window === 'undefined') return '#000000'; // SSR guard

  const hslValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  const match = hslValue.match(/hsl\((\d+)(?:deg)?,?\s*(\d+)%,?\s*(\d+)%\)/);
  if (!match) return '#000000';

  return hslToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
}

// ── Palette → hex array ───────────────────────────────────────────────────────

export function getPaletteHexColors(palette: Array<{ variable: string }>): string[] {
  return palette.map(({ variable }) => getHexFromVariable(variable));
}