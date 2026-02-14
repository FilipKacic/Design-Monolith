// src/lib/utils/colors.ts

import { FREQUENCIES } from '$lib/modes';

// Color mapping for the 12 notes
export const noteColors: readonly string[] = [
  'var(--light-mulberry)',
  'var(--light-red)',
  'var(--light-mushmula)',
  'var(--light-yellow)',
  'var(--light-olive)',
  'var(--light-green)',
  'var(--light-teal)',
  'var(--light-azure)',
  'var(--light-indigo)',
  'var(--light-blue)',
  'var(--light-lavender)',
  'var(--light-cyclamen)',
];

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