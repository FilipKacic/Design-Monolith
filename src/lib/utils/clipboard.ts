// src/lib/utils/clipboard.ts

/**
 * Copies a frequency value to clipboard
 * @param frequency - The frequency value in Hz (formatted to 2 decimal places)
 * @returns Object with success status and message
 */
export async function copyFrequency(
  frequency: number
): Promise<{ success: boolean; message: string }> {
  try {
    const formattedFreq = frequency.toFixed(2);
    
    await navigator.clipboard.writeText(formattedFreq);
    
    return {
      success: true,
      message: 'Copied to clipboard!'
    };
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return {
      success: false,
      message: 'Failed to copy...'
    };
  }
}