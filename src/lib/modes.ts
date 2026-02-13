// src/lib/modes.ts
export type ModeName =
  | "Lydian"
  | "Mixolydian"
  | "Aeolian"
  | "Locrian"
  | "Ionian"
  | "Dorian"
  | "Phrygian";

export type NewModeName =
  | "Lunar"
  | "Mercurial"
  | "Aeolian"
  | "Solar"
  | "Martial"
  | "Jovial"
  | "Saturnine";

export const notesGenesis = [
  "C",  "G",  "D",  "A",  "E",  "B", "F#", "C#", "G#", "D#", "A#", "F"
];

export const newNotesGenesis = [
  "A",  "E",  "B",  "F",  "C",  "G", "D", "A#", "E#", "B#", "F#", "C#"
];

export const notesRevelation = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

export const newNotesRevelation = [
  "A", "A#", "B", "B#", "C", "C#", "D", "E", "E#", "F", "F#", "G", 
];

// Base Lydian / Lunar pattern
const basePattern = [2, 2, 2, 1, 2, 2, 1]; // W-W-W-H-W-W-H

// Mode names in rotation order starting from Lydian
const modeNames: ModeName[] = [
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
  "Ionian",
  "Dorian",
  "Phrygian"
];

// Map the cosmological names to the canonical modal system
export const modeAlias: Record<NewModeName, ModeName> = {
  Lunar: "Lydian",
  Mercurial: "Mixolydian",
  Aeolian: "Aeolian",
  Solar: "Locrian",
  Martial: "Ionian",
  Jovial: "Dorian",
  Saturnine: "Phrygian"
};


// Rotate array utility
function rotateArray(arr: number[], positions: number): number[] {
  return arr.slice(positions).concat(arr.slice(0, positions));
}

// Generate all modes by rotating the base pattern
export const modes: Record<ModeName, number[]> = {} as Record<ModeName, number[]>;
modeNames.forEach((mode, i) => {
  modes[mode] = rotateArray(basePattern, i);
});

// Generate a scale from root note and mode
export function getScale(root: string, mode: ModeName) {
  const startIndex = notesRevelation.indexOf(root);
  if (startIndex === -1) throw new Error("Invalid root note");
  
  const intervals = modes[mode];
  const scale: string[] = [root];
  let currentIndex = startIndex;
  
  for (const step of intervals.slice(0, -1)) { // Iterate only 6 times
    currentIndex = (currentIndex + step) % notesRevelation.length;
    scale.push(notesRevelation[currentIndex]);
  }
  
  return scale; // Returns 7 notes
}

// Generate a scale using the cosmological (planetary) names
export function getNewScale(root: string, mode: NewModeName) {
  const canonicalMode = modeAlias[mode];
  return getScale(root, canonicalMode);
}


// Note frequencies based on powers of 3, starting from C at 1 Hz
export const FREQUENCIES: { note: string; frequency: number }[] = notesGenesis.map((note, i) => ({
  note,
  frequency: 3 ** i
}));