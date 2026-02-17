// src/lib/utils/colors.ts
import { FREQUENCIES } from '$lib/utils/sounds';

/**
 * Determines if a CSS variable needs white text based on naming pattern
 * @param variable - CSS variable name like "--mushmula"
 * @returns true if white text is needed, false if black text is fine
 */
export function needsWhiteText(variable: string): boolean {
  // Dark colors and achromatic colors <= gray need white text
  const darkAchromatic = ['--black', '--pitch-black', '--dark-gray', '--gray'];
  const darkChromatic = ['--red', '--indigo', '--blue', '--lavender', '--cyclamen', '--mulberry'];
  const hasDarkToken = /(^|-)dark(-|$)/.test(variable);


  return (
    darkAchromatic.includes(variable) || 
    darkChromatic.includes(variable)|| 
    hasDarkToken
  );
}

// Color palette definitions with computed needsWhiteText
export const COLOR_PALETTES = {
  scale_of_seven_shades: [
    { name: 'Black', variable: '--black' },
    { name: 'Pitch Black', variable: '--pitch-black' },
    { name: 'Dark Gray', variable: '--dark-gray' },
    { name: 'Gray', variable: '--gray' },
    { name: 'Light Gray', variable: '--light-gray' },
    { name: 'Snow White', variable: '--snow-white' },
    { name: 'White', variable: '--white' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),
  
  twelve_color_wheel: [
    { name: 'Red', variable: '--red' },
    { name: 'Mushmula', variable: '--mushmula' },
    { name: 'Yellow', variable: '--yellow' },
    { name: 'Olive', variable: '--olive' },
    { name: 'Green', variable: '--green' },
    { name: 'Teal', variable: '--teal' },
    { name: 'Azure', variable: '--azure' },
    { name: 'Indigo', variable: '--indigo' },
    { name: 'Blue', variable: '--blue' },
    { name: 'Lavender', variable: '--lavender' },
    { name: 'Cyclamen', variable: '--cyclamen' },
    { name: 'Mulberry', variable: '--mulberry' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),
  
  twelve_color_wheel_of_darkness: [
    { name: 'Dark Red', variable: '--dark-red' },
    { name: 'Dark Mushmula', variable: '--dark-mushmula' },
    { name: 'Very Dark Yellow', variable: '--very-dark-yellow' },
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
  
  twelve_color_wheel_of_light: [
    { name: 'Light Red', variable: '--light-red' },
    { name: 'Light Mushmula', variable: '--light-mushmula' },
    { name: 'Light Yellow', variable: '--light-yellow' },
    { name: 'Light Olive', variable: '--light-olive' },
    { name: 'Light Green', variable: '--light-green' },
    { name: 'Light Teal', variable: '--light-teal' },
    { name: 'Light Azure', variable: '--light-azure' },
    { name: 'Light Indigo', variable: '--light-indigo' },
    { name: 'Very Light Blue', variable: '--very-light-blue' },
    { name: 'Light Lavender', variable: '--light-lavender' },
    { name: 'Light Cyclamen', variable: '--light-cyclamen' },
    { name: 'Light Mulberry', variable: '--light-mulberry' },
  ].map(color => ({ ...color, needsWhiteText: needsWhiteText(color.variable) })),
} as const;

// Color mapping for the 12 notes (used for frequency-based coloring)
export const noteColors: readonly string[] = COLOR_PALETTES.twelve_color_wheel_of_light.map(
  color => `var(${color.variable})`
);

// Memoize frequency-to-index map for O(1) lookups
const frequencyIndexMap = new Map(
  FREQUENCIES.map((f, i) => [f.frequency, i])
);

/**
 * Get color for a note based on its frequency
 * @param frequency - The frequency in Hz
 * @returns CSS color variable string
 */
export function getNoteColor(frequency: number): string {
  const index = frequencyIndexMap.get(frequency);
  if (index === undefined) return 'var(--white)';
  
  // Map to color (cycle through 12 colors)
  return noteColors[index % 12];
}