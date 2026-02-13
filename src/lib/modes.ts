// src/lib/modes.ts
export const NOTES_1 = [
  "C1", "G1", "D1", "A1", "E1", "B1", "F#1"
  /*
  "A1", "E1", "B1", "F1", "C1", "G1", "D1"
  */
];

export const NOTES_1_SHARP = [
  "C1#", "G1#", "D1#", "A1#", "F1"
  /*
  "A1#", "E1#", "B1#", "F1#", "C1#"
  */
];

export const NOTES_1_ALL = [
  ...NOTES_1, ...NOTES_1_SHARP
]

export const NOTES_2 = [
  "C2", "G2", "D2", "A2", "E2", "B2"
  /*
  "A2", "E2", "B2", "F2", "C2", "G2"
  */
];

export const NOTES_ALL = [
  ...NOTES_1, ...NOTES_1_SHARP, ...NOTES_2
]

export const FREQUENCIES: { note: string; frequency: number }[] = NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i
}));

export const MODES = [
  "Lunar",
  "Mercurial",
  "Venerean",
  "Solar",
  "Martial",
  "Jovial",
  "Saturnine"
] as const;

export type Mode = typeof MODES[number];

// Starting offsets for each mode pattern
const MODE_OFFSETS = [0, -2, -4, -6, -1, -3, -5];

// Generate a 7-note pattern starting from the given offset
function getPattern(offset: number): number[] {
  return Array.from({ length: 7 }, (_, i) => offset + i);
}

// Maps patterns to all modes dynamically
export const MODE_PATTERNS: { mode: Mode; pattern: number[] }[] = MODES.map((mode, i) => ({
  mode,
  pattern: getPattern(MODE_OFFSETS[i])
}));

export function sortNotesAlphabetically(noteArray: string[]): { note: string; frequency: number }[] {
  const noteSet = new Set(noteArray);
  return FREQUENCIES
    .filter(f => noteSet.has(f.note))
    .sort((a, b) => a.note.localeCompare(b.note));
}

export const NOTES_1_ALL_SORTED = sortNotesAlphabetically(NOTES_1_ALL);

/**
 * Generates a scale based on a root note and mode
 * @param rootNote - The root note from NOTES_1
 * @param mode - The mode to use for the scale pattern
 * @returns Array of 7 notes with their frequencies forming the scale
 */
/**
 * Generates a scale based on a root note and mode
 * @param rootNote - The root note from NOTES_1
 * @param mode - The mode to use for the scale pattern
 * @returns Array of 7 notes with their frequencies forming the scale
 */
export function getScale(rootNote: string, mode: Mode, sorted: boolean = false): { note: string; frequency: number }[] {
  // Find the root note's index in FREQUENCIES
  const rootIndex = FREQUENCIES.findIndex(f => f.note === rootNote);
  
  if (rootIndex === -1) {
    throw new Error(`Root note ${rootNote} not found in FREQUENCIES`);
  }
  
  // Get the pattern for this mode
  const modePattern = MODE_PATTERNS.find(mp => mp.mode === mode);
  
  if (!modePattern) {
    throw new Error(`Mode ${mode} not found`);
  }
  
  // Build the scale by applying pattern offsets to root index
  const scale: { note: string; frequency: number }[] = [];
  const arrayLength = NOTES_1_ALL.length; // Dynamically get length from NOTES_1_ALL
  
  for (const offset of modePattern.pattern) {
    let noteIndex;
    
    if (offset < 0) {
      // For negative offsets, wrap around within NOTES_1_ALL (first 12 notes)
      noteIndex = ((rootIndex + offset) % arrayLength + arrayLength) % arrayLength;
    } else {
      // For positive offsets, use the full FREQUENCIES array
      noteIndex = rootIndex + offset;
  }
  
  scale.push(FREQUENCIES[noteIndex]);
}
  
  // Sort alphabetically starting from root note if requested
  if (sorted) {
    // First sort alphabetically
    const sortedScale = [...scale].sort((a, b) => a.note.localeCompare(b.note));
    
    // Find the root note position in the sorted array
    const rootPosition = sortedScale.findIndex(n => n.note === rootNote);
    
    // Rotate array so root note is first
    return [...sortedScale.slice(rootPosition), ...sortedScale.slice(0, rootPosition)];
  }
  
  return scale;
}