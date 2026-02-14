// src/lib/modes.ts
export const NOTES_1 = [
  "C1", "G1", "D1", "A1", "E1", "B1", "F#1"
];

export const NEW_NOTES_1 = [
  "A1", "E1", "B1", "F1", "C1", "G1", "D1"
];

export const NOTES_1_SHARP = [
  "C1#", "G1#", "D1#", "A1#", "F1"
];

export const NEW_NOTES_1_SHARP = [
  "A1#", "E1#", "B1#", "F1#", "C1#"
];

export const NOTES_1_ALL = [
  ...NOTES_1, ...NOTES_1_SHARP
]

export const NEW_NOTES_1_ALL = [
  ...NEW_NOTES_1, ...NEW_NOTES_1_SHARP
]

export const NOTES_2 = [
  "C2", "G2", "D2", "A2", "E2", "B2"
];

export const NEW_NOTES_2 = [
  "A2", "E2", "B2", "F2", "C2", "G2"
];

export const NOTES_ALL = [
  ...NOTES_1, ...NOTES_1_SHARP, ...NOTES_2
]

export const NEW_NOTES_ALL = [
  ...NEW_NOTES_1, ...NEW_NOTES_1_SHARP, ...NEW_NOTES_2
]

export const FREQUENCIES: { note: string; frequency: number }[] = NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i
}));

export const NEW_FREQUENCIES: { note: string; frequency: number }[] = NEW_NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i
}));

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
export function getScale(
	rootNote: string, 
	mode: Mode | newMode, 
	sorted: boolean = false,
	useNew: boolean = false
): { note: string; frequency: number }[] {
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

	// Use the mode index to get the corresponding pattern
	const modePattern = MODE_PATTERNS[modeIndex];
	if (!modePattern) {
		throw new Error(`Pattern for mode ${mode} not found`);
	}

	const scale: { note: string; frequency: number }[] = [];
	const arrayLength = notesArray.length;

	for (const offset of modePattern.pattern) {
		let noteIndex;
		if (offset < 0) {
			noteIndex = ((rootIndex + offset) % arrayLength + arrayLength) % arrayLength;
		} else {
			noteIndex = rootIndex + offset;
		}
		scale.push(freqArray[noteIndex]);
	}

	if (sorted) {
		const sortedScale = [...scale].sort((a, b) => a.note.localeCompare(b.note));
		const rootPosition = sortedScale.findIndex(n => n.note === rootNote);
		return [...sortedScale.slice(rootPosition), ...sortedScale.slice(0, rootPosition)];
	}

	return scale;
}