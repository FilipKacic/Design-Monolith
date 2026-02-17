// src/lib/modes.ts

// Base notes in circle of fifths order
export const NOTES_1 = [
  "C1", "G1", "D1", "A1", "E1", "B1", "F#1"
] as const;

export const NEW_NOTES_1 = [
  "A1", "E1", "B1", "F1", "C1", "G1", "D1"
] as const;

// Sharp notes (the gaps in the circle of fifths)
export const NOTES_1_SHARP = [
  "C1#", "G1#", "D1#", "A1#", "F1"
] as const;

export const NEW_NOTES_1_SHARP = [
  "A1#", "E1#", "B1#", "F1#", "C1#"
] as const;

// Combined 12-note chromatic scale
export const NOTES_1_ALL = [...NOTES_1, ...NOTES_1_SHARP] as const;
export const NEW_NOTES_1_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP] as const;

// Second octave notes
export const NOTES_2 = [
  "C2", "G2", "D2", "A2", "E2", "B2"
] as const;

export const NEW_NOTES_2 = [
  "A2", "E2", "B2", "F2", "C2", "G2"
] as const;

// All notes across both octaves
export const NOTES_ALL = [...NOTES_1, ...NOTES_1_SHARP, ...NOTES_2] as const;
export const NEW_NOTES_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP, ...NEW_NOTES_2] as const;

// Frequency mappings (powers of 3)
export const FREQUENCIES: readonly { note: string; frequency: number }[] = NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i
}));

export const NEW_FREQUENCIES: readonly { note: string; frequency: number }[] = NEW_NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i
}));

// Mode names
export const MODES = [
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
  "Ionian",
  "Dorian",
  "Phrygian"
] as const;

export const NEW_MODES = [
  "Lunar",
  "Mercurial",
  "Venerean",
  "Solar",
  "Martial",
  "Jovial",
  "Saturnine"
] as const;

export type Mode = typeof MODES[number];
export type newMode = typeof NEW_MODES[number];

// Scale degree names (I–VII)
export const SCALE_DEGREE_NAMES = [
  "Tonic",
  "Supertonic",
  "Mediant",
  "Subdominant",
  "Dominant",
  "Submediant",
  "Subtonic",
] as const;

export type ScaleDegree = typeof SCALE_DEGREE_NAMES[number];

// Mode pattern offsets
const MODE_OFFSETS = [0, -2, -4, -6, -1, -3, -5] as const;

// Pre-compute mode patterns (no need to regenerate every time)
export const MODE_PATTERNS: readonly { mode: Mode; pattern: number[] }[] = MODES.map((mode, i) => ({
  mode,
  pattern: Array.from({ length: 7 }, (_, j) => MODE_OFFSETS[i] + j)
}));

// Memoized frequency lookup maps for O(1) access
const FREQUENCY_MAP = new Map(FREQUENCIES.map(f => [f.note, f.frequency]));
const NEW_FREQUENCY_MAP = new Map(NEW_FREQUENCIES.map(f => [f.note, f.frequency]));

/**
 * Sorts notes alphabetically and returns with frequencies
 */
export function sortNotesAlphabetically(noteArray: string[]): { note: string; frequency: number }[] {
  const noteSet = new Set(noteArray);
  return FREQUENCIES
    .filter(f => noteSet.has(f.note))
    .sort((a, b) => a.note.localeCompare(b.note));
}

export const NOTES_1_ALL_SORTED = sortNotesAlphabetically([...NOTES_1_ALL]);

/**
 * Generates a scale based on a root note and mode
 * @param rootNote - The root note
 * @param mode - The mode to use for the scale pattern
 * @param sorted - Whether to sort the scale alphabetically starting from root
 * @param useNew - Whether to use new naming system
 * @returns Array of 7 notes with their frequencies and scale degrees forming the scale
 */
export function getScale(
  rootNote: string, 
  mode: Mode | newMode, 
  sorted: boolean = false,
  useNew: boolean = false
): { note: string; frequency: number; degree: number; degreeName: ScaleDegree }[] {
  const freqArray = useNew ? NEW_FREQUENCIES : FREQUENCIES;
  const notesArray = useNew ? NEW_NOTES_1_ALL : NOTES_1_ALL;
  
  const rootIndex = freqArray.findIndex(f => f.note === rootNote);
  if (rootIndex === -1) {
    throw new Error(`Root note ${rootNote} not found`);
  }

  // Find the mode index (works for both MODES and NEW_MODES since they map 1:1)
  const modeIndex = useNew 
    ? NEW_MODES.indexOf(mode as newMode)
    : MODES.indexOf(mode as Mode);

  if (modeIndex === -1) {
    throw new Error(`Mode ${mode} not found`);
  }

  // Get the pre-computed pattern
  const pattern = MODE_PATTERNS[modeIndex].pattern;
  const arrayLength = notesArray.length;

  // Build scale using pattern
  const scale = pattern.map((offset, i) => {
    const noteIndex = offset < 0 
      ? ((rootIndex + offset) % arrayLength + arrayLength) % arrayLength
      : rootIndex + offset;
    return {
      ...freqArray[noteIndex],
      degree: i + 1,
      degreeName: SCALE_DEGREE_NAMES[i],
    };
  });

  if (sorted) {
    const sortedScale = [...scale].sort((a, b) => a.note.localeCompare(b.note));
    const rootPosition = sortedScale.findIndex(n => n.note === rootNote);
    return [...sortedScale.slice(rootPosition), ...sortedScale.slice(0, rootPosition)];
  }

  return scale;
}

/**
 * Get frequency for a note (O(1) lookup)
 * @param note - The note name
 * @param useNew - Whether to use new naming system
 * @returns The frequency in Hz, or undefined if not found
 */
export function getFrequency(note: string, useNew: boolean = false): number | undefined {
  return useNew ? NEW_FREQUENCY_MAP.get(note) : FREQUENCY_MAP.get(note);
}

export function reduceToOctave(
  frequencyToReduce: number,
  frequencyToMatch: number
): number {
  if (frequencyToReduce <= 0 || frequencyToMatch <= 0) {
    throw new Error('Frequencies must be positive');
  }

  let reduced = frequencyToReduce;

  // Reduce down while we're too high
  while (reduced >= frequencyToMatch * 2) {
    reduced /= 2;
  }

  // Bring up while we're too low
  while (reduced < frequencyToMatch / 2) {
    reduced *= 2;
  }

  // Now check if going one octave lower gets us closer to the target
  const distanceCurrent = Math.abs(reduced - frequencyToMatch);
  const distanceLower = Math.abs(reduced / 2 - frequencyToMatch);

  if (distanceLower < distanceCurrent) {
    reduced /= 2;
  }

  return reduced;
}