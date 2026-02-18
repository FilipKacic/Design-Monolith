// src/lib/utils/colors.ts
import { FREQUENCIES } from '$lib/utils/sounds';

/**
 * Determines if a CSS variable needs white text based on naming pattern
 */
export function needsWhiteText(variable: string): boolean {
  const darkAchromatic = ['--black', '--pitch-black', '--iron-gray', '--dark-gray', '--gray'];
  const darkChromatic = ['--red', '--indigo', '--blue', '--lavender', '--cyclamen', '--mulberry'];
  const ghostChromatic = ['--ghost-red', '--ghost-indigo', '--ghost-blue', '--ghost-lavender', '--ghost-cyclamen', '--ghost-mulberry'];
  const hasDarkToken = /(^|-)dark(-|$)/.test(variable);

  return (
    darkAchromatic.includes(variable) ||
    darkChromatic.includes(variable) ||
    ghostChromatic.includes(variable) ||
    hasDarkToken
  );
}

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const COLOR_PALETTES = {
  scale: [
    { name: 'Black', variable: '--black' },
    { name: 'Pitch Black', variable: '--pitch-black' },
    { name: 'Iron Gray', variable: '--iron-gray' },
    { name: 'Dark Gray', variable: '--dark-gray' },
    { name: 'Gray', variable: '--gray' },
    { name: 'Light Gray', variable: '--light-gray' },
    { name: 'Silver', variable: '--silver' },
    { name: 'Snow White', variable: '--snow-white' },
    { name: 'White', variable: '--white' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),

  wheel: [
    { name: 'Red', variable: '--red' },           // Grayscale: 76
    { name: 'Mushmula', variable: '--mushmula' }, // Grayscale: 151
    { name: 'Yellow', variable: '--yellow' },     // Grayscale: 226
    { name: 'Olive', variable: '--olive' },       // Grayscale: 188
    { name: 'Green', variable: '--green' },       // Grayscale: 150
    { name: 'Teal', variable: '--teal' },         // Grayscale: 164
    { name: 'Azure', variable: '--azure' },       // Grayscale: 179
    { name: 'Indigo', variable: '--indigo' },     // Grayscale: 104
    { name: 'Blue', variable: '--blue' },         // Grayscale: 29
    { name: 'Lavender', variable: '--lavender' }, // Grayscale: 67
    { name: 'Cyclamen', variable: '--cyclamen' }, // Grayscale: 105
    { name: 'Mulberry', variable: '--mulberry' }, // Grayscale: 91
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),

  wheel_of_darkness: [
    { name: 'Dark Red', variable: '--dark-red' },
    { name: 'Dark Mushmula', variable: '--dark-mushmula' },
    { name: 'Dark Yellow', variable: '--dark-yellow' },
    { name: 'Dark Olive', variable: '--dark-olive' },
    { name: 'Dark Green', variable: '--dark-green' },
    { name: 'Dark Teal', variable: '--dark-teal' },
    { name: 'Dark Azure', variable: '--dark-azure' },
    { name: 'Dark Indigo', variable: '--dark-indigo' },
    { name: 'Dark Blue', variable: '--dark-blue' },
    { name: 'Dark Lavender', variable: '--dark-lavender' },
    { name: 'Dark Cyclamen', variable: '--dark-cyclamen' },
    { name: 'Dark Mulberry', variable: '--dark-mulberry' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),

  wheel_of_ghost: [
    { name: 'Ghost Red', variable: '--ghost-red' },
    { name: 'Ghost Mushmula', variable: '--ghost-mushmula' },
    { name: 'Ghost Yellow', variable: '--ghost-yellow' },
    { name: 'Ghost Olive', variable: '--ghost-olive' },
    { name: 'Ghost Green', variable: '--ghost-green' },
    { name: 'Ghost Teal', variable: '--ghost-teal' },
    { name: 'Ghost Azure', variable: '--ghost-azure' },
    { name: 'Ghost Indigo', variable: '--ghost-indigo' },
    { name: 'Ghost Blue', variable: '--ghost-blue' },
    { name: 'Ghost Lavender', variable: '--ghost-lavender' },
    { name: 'Ghost Cyclamen', variable: '--ghost-cyclamen' },
    { name: 'Ghost Mulberry', variable: '--ghost-mulberry' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),

  wheel_of_light: [
    { name: 'Light Red', variable: '--light-red' },
    { name: 'Light Mushmula', variable: '--light-mushmula' },
    { name: 'Light Yellow', variable: '--light-yellow' },
    { name: 'Light Olive', variable: '--light-olive' },
    { name: 'Light Green', variable: '--light-green' },
    { name: 'Light Teal', variable: '--light-teal' },
    { name: 'Light Azure', variable: '--light-azure' },
    { name: 'Light Indigo', variable: '--light-indigo' },
    { name: 'Light Blue', variable: '--light-blue' },
    { name: 'Light Lavender', variable: '--light-lavender' },
    { name: 'Light Cyclamen', variable: '--light-cyclamen' },
    { name: 'Light Mulberry', variable: '--light-mulberry' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),
} as const;

// ============================================================================
// NOTE COLOR MAPPING
// ============================================================================

export const noteColors: readonly string[] =
  COLOR_PALETTES.wheel_of_light.map(color => `var(${color.variable})`);

const frequencyIndexMap = new Map(
  FREQUENCIES.map((f, i) => [f.frequency, i])
);

export function getNoteColor(frequency: number): string {
  const index = frequencyIndexMap.get(frequency);
  if (index === undefined) return 'var(--white)';
  return noteColors[index % 12];
}
