// src/lib/utils/clipboard.ts

/**
 * Copies text to clipboard
 * @param text - The text to copy
 * @param successMessage - Optional custom success message
 * @returns Object with success status and message
 */
async function copyToClipboard(
  text: string,
  successMessage?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await navigator.clipboard.writeText(text);
    return {
      success: true,
      message: successMessage || 'Copied to clipboard!'
    };
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return {
      success: false,
      message: 'Failed to copy...'
    };
  }
}

/**
 * Copies a frequency value to clipboard
 * @param frequency - The frequency value in Hz (formatted to 2 decimal places)
 * @returns Object with success status and message
 */
export async function copyFrequency(
  frequency: number
): Promise<{ success: boolean; message: string }> {
  const formattedFreq = frequency.toFixed(2);
  return copyToClipboard(formattedFreq, `${formattedFreq}Hz copied!`);
}

/**
 * Copies a color hex value to clipboard
 * @param hex - The hex color value
 * @param colorName - The name of the color
 * @returns Object with success status and message
 */
export async function copyColor(
  hex: string,
  colorName: string
): Promise<{ success: boolean; message: string }> {
  return copyToClipboard(hex, `${colorName}: ${hex} copied!`);
}