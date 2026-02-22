// ── Clipboard ─────────────────────────────────────────────────────────────────
// All public functions return { success, message } so callers can feed the
// message directly into the Toast component without extra formatting logic.

type ClipboardResult = { success: boolean; message: string };

// Private — shared implementation used by both public functions.
async function copyToClipboard(text: string, successMessage?: string): Promise<ClipboardResult> {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true,  message: successMessage ?? 'Copied to clipboard!' };
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return { success: false, message: 'Failed to copy...' };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function copyFrequency(frequency: number): Promise<ClipboardResult> {
  const formatted = frequency.toFixed(2);
  return copyToClipboard(formatted, `${formatted}Hz copied!`);
}

export async function copyColor(hex: string, colorName: string): Promise<ClipboardResult> {
  return copyToClipboard(hex, `${colorName}: ${hex} copied!`);
}