export type ExportFormat = 'xml' | 'gpl' | 'txt';

export interface ColorEntry {
  name: string;
  hex: string;
}

export interface PaletteData {
  [key: string]: ColorEntry[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_MIME = 'text/plain';
const NAME = 'Design Monolith';
const SLUG_NAME = 'design-monolith';

// ── Utilities ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function downloadFile(content: string, filename: string, mimeType = DEFAULT_MIME): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Formatters ────────────────────────────────────────────────────────────────

function formatPalettes(
  palettes: PaletteData,
  formatColor: (c: ColorEntry) => string,
  sectionPrefix: string,
  header?: string,
): string {
  const lines: string[] = [];
  if (header) lines.push(header);
  for (const [paletteName, colors] of Object.entries(palettes)) {
    if (sectionPrefix) lines.push(`${sectionPrefix} ${paletteName}`);
    colors.forEach(c => lines.push(formatColor(c)));
  }
  return lines.join('\n');
}

function formatAsXML(palettes: PaletteData, displayName: string): string {
  const guid  = crypto.randomUUID();
  const lines = [
    `<?xml version="1.0"?>`,
    `<palette guid="${guid}" name="${displayName}">`,
    `  <colors>`,
    `    <page>`,
  ];
  for (const [paletteName, colors] of Object.entries(palettes)) {
    lines.push(`      <!-- ${paletteName} -->`);
    colors.forEach(c => {
      const [r, g, b] = hexToRgb(c.hex).map(v => (v / 255).toFixed(6));
      lines.push(`      <color cs="RGB" tints="${r},${g},${b}"/>`);
    });
  }
  lines.push(`    </page>`, `  </colors>`, `</palette>`);
  return lines.join('\n');
}

function formatAsGPL(palettes: PaletteData, displayName: string): string {
  return formatPalettes(
    palettes,
    c => { const [r, g, b] = hexToRgb(c.hex); return `${r} ${g} ${b} ${c.name}`; },
    '#',
    `GIMP Palette\nName: ${displayName}\nColumns: 3\n#`,
  );
}

function formatAsTXT(palettes: PaletteData, displayName: string): string {
  return formatPalettes(
    palettes,
    c => {
      const [r, g, b] = hexToRgb(c.hex);
      return `FF${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`.toUpperCase();
    },
    ';',
    `; Paint.NET Palette File — ${displayName}`,
  );
}

// ── Core dispatch ─────────────────────────────────────────────────────────────

function buildContent(palettes: PaletteData, displayName: string, format: ExportFormat): string {
  switch (format) {
    case 'xml': return formatAsXML(palettes, displayName);
    case 'gpl': return formatAsGPL(palettes, displayName);
    case 'txt': return formatAsTXT(palettes, displayName);
  }
}

function triggerDownload(
  palettes:    PaletteData,
  displayName: string,
  filename:    string,
  format:      ExportFormat,
): { success: boolean; message: string } {
  const content  = buildContent(palettes, displayName, format);
  const mimeType = format === 'xml' ? 'application/xml' : DEFAULT_MIME;
  downloadFile(content, `${filename}.${format}`, mimeType);
  return { success: true, message: `${filename}.${format} — downloaded.` };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function exportPalette(
  paletteName: string,
  colors:      ColorEntry[],
  format:      ExportFormat,
): { success: boolean; message: string } {
  return triggerDownload(
    { [paletteName]: colors },
    `${NAME} — ${paletteName}`,
    `${SLUG_NAME}-${slugify(paletteName)}`,
    format,
  );
}

export function exportAllPalettes(
  palettes: PaletteData,
  format:   ExportFormat,
): { success: boolean; message: string } {
  return triggerDownload(
    palettes,
    `${NAME} — Color Gyroscope`,
    `${SLUG_NAME}-color-gyroscope`,
    format,
  );
}