export type ExportFormat = 'xml' | 'gpl' | 'txt';

export interface ColorEntry {
  name: string;
  hex: string;
}

export interface PaletteData {
  [key: string]: ColorEntry[];
}

// --- Constants ---
const DEFAULT_MIME = 'text/plain';

// --- Utilities ---

/** Convert hex color to [r, g, b] */
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Download a file with given content */
function downloadFile(content: string, filename: string, mimeType = DEFAULT_MIME): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Formatters ---

/** Helper: map a palette to formatted lines for any formatter */
function formatPalettes(
  palettes: PaletteData,
  formatColor: (c: ColorEntry) => string,
  sectionPrefix: string,
  header?: string
): string {
  const lines: string[] = [];
  if (header) lines.push(header);

  for (const [paletteName, colors] of Object.entries(palettes)) {
    if (sectionPrefix) lines.push(`${sectionPrefix} ${paletteName}`);
    colors.forEach(c => lines.push(formatColor(c)));
  }

  return lines.join('\n');
}

/** XML format: normalized RGB tints 0–1, no name attribute, rounded to 6 decimals */
function formatAllAsXMLNormalized(
  palettes: PaletteData,
  fileName = 'Palette'
): string {
  const guid = crypto.randomUUID();
  const lines: string[] = [
    `<?xml version="1.0"?>`,
    `<palette guid="${guid}" name="${fileName}">`,
    `  <colors>`,
    `    <page>`
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


/** GPL format: single header, sections via comments */
function formatAllAsGPL(palettes: PaletteData, fileName = 'Palette'): string {
  const header = `GIMP Palette
Name: ${fileName}
Columns: 3
#`;

  return formatPalettes(
    palettes,
    c => {
      const [r, g, b] = hexToRgb(c.hex);
      return `${r} ${g} ${b} ${c.name}`;
    },
    '#', // comment prefix
    header
  );
}

/** Paint.NET TXT format: single header, sections per palette */
function formatAllAsTXT(palettes: PaletteData): string {
  return formatPalettes(
    palettes,
    c => {
      const [r, g, b] = hexToRgb(c.hex);
      return `FF${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    },
    ';' // comment prefix
  ).replace(/^/, '; Paint.NET Palette File\n'); // add file header
}

// --- Export functions ---

export function exportPalette(
  paletteName: string,
  colors: ColorEntry[],
  format: ExportFormat
): { success: boolean; message: string } {
  const filename = `Jesus-take-the-${paletteName.toLowerCase().replace(/\s+/g, '-')}-palette`;
  const paletteObj: PaletteData = { [paletteName]: colors };

  let content: string;
  switch (format) {
    case 'xml':
      content = formatAllAsXMLNormalized(paletteObj, paletteName);
      break;
    case 'gpl':
      content = formatAllAsGPL(paletteObj, paletteName);
      break;
    case 'txt':
      content = formatAllAsTXT(paletteObj);
      break;
  }

  downloadFile(content, `${filename}.${format}`, format === 'xml' ? 'application/xml' : DEFAULT_MIME);
  return { success: true, message: `${filename}.${format} downloaded!` };
}

export function exportAllPalettes(
  palettes: PaletteData,
  format: ExportFormat
): { success: boolean; message: string } {
  const filename = 'Jesus-take-the-color-gyroscope-palette';

  let content: string;
  switch (format) {
    case 'xml':
      content = formatAllAsXMLNormalized(palettes, 'Jesus Take The Color Gyroscope');
      break;
    case 'gpl':
      content = formatAllAsGPL(palettes, 'Jesus Take The Color Gyroscope');
      break;
    case 'txt':
      content = formatAllAsTXT(palettes);
      break;
  }

  downloadFile(content, `${filename}.${format}`, format === 'xml' ? 'application/xml' : DEFAULT_MIME);
  return { success: true, message: `${filename}.${format} downloaded!` };
}
