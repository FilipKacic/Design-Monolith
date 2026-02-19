// src/lib/modes.ts

// ── Notes ────────────────────────────────────────────────────────────────────

export const NOTES_1 = ["C", "G", "D", "A", "E", "B", "F#"] as const;
export const NEW_NOTES_1 = ["A", "E", "B", "F", "C", "G", "D"] as const;

export const NOTES_1_SHARP = ["C#", "G#", "D#", "A#", "F"] as const;
export const NEW_NOTES_1_SHARP = ["A#", "E#", "B#", "F#", "C#"] as const;

export const NOTES_1_ALL = [...NOTES_1, ...NOTES_1_SHARP] as const;
export const NEW_NOTES_1_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP] as const;

export const NOTES_2 = ["C+", "G+", "D+", "A+", "E+", "B+"] as const;
export const NEW_NOTES_2 = ["A+", "E+", "B+", "F+", "C+", "G+"] as const;

export const NOTES_ALL = [...NOTES_1, ...NOTES_1_SHARP, ...NOTES_2] as const;
export const NEW_NOTES_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP, ...NEW_NOTES_2] as const;

// ── Frequencies ───────────────────────────────────────────────────────────────

export type NoteFrequency = { note: string; frequency: number };

export const FREQUENCIES: readonly NoteFrequency[] = NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i,
}));

export const NEW_FREQUENCIES: readonly NoteFrequency[] = NEW_NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i,
}));

const FREQUENCY_MAP = new Map(FREQUENCIES.map(f => [f.note, f.frequency]));
const NEW_FREQUENCY_MAP = new Map(NEW_FREQUENCIES.map(f => [f.note, f.frequency]));

// ── Modes ─────────────────────────────────────────────────────────────────────

export const MODES = [
  "Lydian", "Mixolydian", "Aeolian", "Locrian",
  "Ionian", "Dorian", "Phrygian",
] as const;

export const NEW_MODES = [
  "Lunar", "Mercurial", "Venerean", "Solar",
  "Martial", "Jovial", "Saturnine",
] as const;

export type Mode = typeof MODES[number];
export type NewMode = typeof NEW_MODES[number];

const MODE_INDEX = new Map(MODES.map((m, i) => [m, i]));
const NEW_MODE_INDEX = new Map(NEW_MODES.map((m, i) => [m, i]));

// ── Scale Degrees ─────────────────────────────────────────────────────────────

export const SCALE_DEGREES = {
  Tonic:       0,
  Supertonic:  1,
  Mediant:     2,
  Subdominant: 3,
  Dominant:    4,
  Submediant:  5,
  Subtonic:    6,
} as const;

export type ScaleDegree = keyof typeof SCALE_DEGREES;
export type ScaleDegreeIndex = typeof SCALE_DEGREES[ScaleDegree];

export const SCALE_DEGREE_KEYS = Object.keys(SCALE_DEGREES) as ScaleDegree[];
export const SCALE_DEGREE_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;

// ── Mode Patterns ─────────────────────────────────────────────────────────────

const MODE_OFFSETS = [0, -2, -4, -6, -1, -3, -5] as const;

export const MODE_PATTERNS: readonly { mode: Mode; pattern: readonly number[] }[] =
  MODES.map((mode, i) => ({
    mode,
    pattern: Array.from({ length: 7 }, (_, j) => MODE_OFFSETS[i] + j),
  }));

// ── Sorted Notes ──────────────────────────────────────────────────────────────

export const NOTES_1_ALL_SORTED: NoteFrequency[] = (() => {
  const noteSet = new Set(NOTES_1_ALL as readonly string[]);
  return FREQUENCIES
    .filter(f => noteSet.has(f.note))
    .sort((a, b) => a.note.localeCompare(b.note));
})();

// ── getScale ──────────────────────────────────────────────────────────────────

export type ScaleNote = NoteFrequency & {
  degree: number;
  degreeName: ScaleDegree;
  numeral: string;
};

export function getScale(
  rootNote: string,
  mode: Mode | NewMode,
  sorted = false,
  useNew = false,
): ScaleNote[] {
  const freqArray = useNew ? NEW_FREQUENCIES : FREQUENCIES;
  const notesArray = useNew ? NEW_NOTES_1_ALL : NOTES_1_ALL;

  const rootIndex = freqArray.findIndex(f => f.note === rootNote);
  if (rootIndex === -1) throw new Error(`Root note "${rootNote}" not found`);

  const modeIndex = (useNew ? NEW_MODE_INDEX : MODE_INDEX).get(mode as Mode & NewMode);
  if (modeIndex === undefined) throw new Error(`Mode "${mode}" not found`);

  const { pattern } = MODE_PATTERNS[modeIndex];
  const len = notesArray.length;

  const scale: ScaleNote[] = pattern.map((offset, i) => {
    const noteIndex = ((rootIndex + offset) % len + len) % len;
    return {
      ...freqArray[noteIndex],
      degree: i + 1,
      degreeName: SCALE_DEGREE_KEYS[i],
      numeral: SCALE_DEGREE_NUMERALS[i],
    };
  });

  if (!sorted) return scale;

  const sortedScale = [...scale].sort((a, b) => a.note.localeCompare(b.note));
  const rootPos = sortedScale.findIndex(n => n.note === rootNote);
  return [...sortedScale.slice(rootPos), ...sortedScale.slice(0, rootPos)];
}

// ── getFrequency ──────────────────────────────────────────────────────────────

export function getFrequency(note: string, useNew = false): number | undefined {
  return (useNew ? NEW_FREQUENCY_MAP : FREQUENCY_MAP).get(note);
}

// ── reduceToOctave ────────────────────────────────────────────────────────────

export function reduceToOctave(frequencyToReduce: number, frequencyToMatch: number): number {
  if (frequencyToReduce <= 0 || frequencyToMatch <= 0) {
    throw new Error("Frequencies must be positive");
  }

  let r = frequencyToReduce;
  while (r >= frequencyToMatch * 2) r /= 2;
  while (r < frequencyToMatch / 2) r *= 2;

  return Math.abs(r / 2 - frequencyToMatch) < Math.abs(r - frequencyToMatch) ? r / 2 : r;
}

// ── SonicPatern ────────────────────────────────────────────────────────────

export const SONIC_PATTERN = [0, 2, 4, 6, 7, 9, 11] as const;