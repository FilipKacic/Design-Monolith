// ── Types ─────────────────────────────────────────────────────────────────────

export type ExportFormat = 'xml' | 'gpl' | 'txt';

export interface ColorEntry {
  name: string;
  hex: string;
}

export interface PaletteData {
  [paletteName: string]: ColorEntry[];
}

// ── Constants ─────────────────────────────────────────────────────────────────



// Maps each export format to its appropriate MIME type for blob creation.
// Defaults to plain text for formats without a dedicated MIME type.
const MIME_TYPES: Record<ExportFormat, string> = {
  xml: 'application/xml',
  gpl: 'text/plain',
  txt: 'text/plain',
};

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Converts a hex colour string to an [R, G, B] tuple (0–255).
 * Expands shorthand 3-digit hex (e.g. #FFF) before parsing.
 */
function hexToRgb(hex: string): [number, number, number] {
  const normalised = hex.replace(/^#/, '');
  const full = normalised.length === 3
    ? normalised.split('').map(c => c + c).join('')
    : normalised;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** Converts a display name to a URL/filename-safe kebab-case slug. */
function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/** Triggers a browser file download for the given text content. */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = Object.assign(document.createElement('a'), { href: url, download: filename });
  anchor.click();
  URL.revokeObjectURL(url);
}

// ── Formatters (Strategy pattern) ────────────────────────────────────────────
//
// Each formatter is a pure function with the same signature, allowing them to
// be stored in a lookup map and swapped without touching the call site.

/**
 * Produces an XML palette compatible with Affinity and similar applications.
 * Colour channels are normalised to the 0–1 float range required by the spec.
 */
function formatAsXML(palettes: PaletteData, displayName: string): string {
  const colourLines = Object.entries(palettes).flatMap(([paletteName, colors]) => [
    `      <!-- ${paletteName} -->`,
    ...colors.map(c => {
      const [r, g, b] = hexToRgb(c.hex).map(v => (v / 255).toFixed(6));
      return `      <color cs="RGB" tints="${r},${g},${b}"/>`;
    }),
  ]);

  return [
    `<?xml version="1.0"?>`,
    `<palette guid="${crypto.randomUUID()}" name="${displayName}">`,
    `  <colors>`,
    `    <page>`,
    ...colourLines,
    `    </page>`,
    `  </colors>`,
    `</palette>`,
  ].join('\n');
}

/**
 * Produces a GIMP Palette (.gpl) file.
 * Palette sections are separated by comment headers as per the GPL spec.
 */
function formatAsGPL(palettes: PaletteData, displayName: string): string {
  const body = Object.entries(palettes).flatMap(([paletteName, colors]) => [
    `# ${paletteName}`,
    ...colors.map(c => {
      const [r, g, b] = hexToRgb(c.hex);
      return `${r} ${g} ${b} ${c.name}`;
    }),
  ]);

  return [`GIMP Palette`, `Name: ${displayName}`, `Columns: 3`, `#`, ...body].join('\n');
}

/**
 * Produces a Paint.NET palette (.txt) file.
 * Each colour is written as an 8-digit ARGB hex string with full opacity (FF prefix).
 */
function formatAsTXT(palettes: PaletteData, displayName: string): string {
  const toArgbHex = (hex: string): string => {
    const [r, g, b] = hexToRgb(hex).map(v => v.toString(16).padStart(2, '0'));
    return `FF${r}${g}${b}`.toUpperCase();
  };

  const body = Object.entries(palettes).flatMap(([paletteName, colors]) => [
    `; ${paletteName}`,
    ...colors.map(c => toArgbHex(c.hex)),
  ]);

  return [`; Paint.NET Palette File — ${displayName}`, ...body].join('\n');
}

// ── Format registry ───────────────────────────────────────────────────────────
//
// Centralising format-to-formatter bindings here means adding a new export
// format only requires registering it in this one place.

type Formatter = (palettes: PaletteData, displayName: string) => string;

const FORMATTERS: Record<ExportFormat, Formatter> = {
  xml: formatAsXML,
  gpl: formatAsGPL,
  txt: formatAsTXT,
};

// ── Core logic ────────────────────────────────────────────────────────────────

/**
 * Builds the export file content and triggers a browser download.
 * Returns a result object so callers can surface success/failure in the UI
 * without coupling this module to any specific notification system.
 */
function triggerDownload(
  palettes:    PaletteData,
  displayName: string,
  filename:    string,
  format:      ExportFormat,
): { success: boolean; message: string } {
  const content = FORMATTERS[format](palettes, displayName);
  downloadFile(content, `${filename}.${format}`, MIME_TYPES[format]);
  return { success: true, message: `${filename}.${format} downloaded.` };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Exports a single named palette.
 * The output filename is derived from the palette name (e.g. "My Reds" → "my-reds.gpl").
 */
export function exportPalette(
  paletteName: string,
  colors:      ColorEntry[],
  format:      ExportFormat,
): { success: boolean; message: string } {
  return triggerDownload(
    { [paletteName]: colors },
    paletteName,
    slugify(paletteName),
    format,
  );
}

/**
 * Exports all palettes as a single combined file ("color-gyroscope").
 * Palette sections within the file are labelled by their palette names.
 */
export function exportAllPalettes(
  palettes: PaletteData,
  format:   ExportFormat,
): { success: boolean; message: string } {
  return triggerDownload(
    palettes,
    'Color Gyroscope',
    'color-gyroscope',
    format,
  );
}