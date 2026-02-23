// ── Notes ─────────────────────────────────────────────────────────────────────
// NOTES_1 / NEW_NOTES_1: the 7 primary tones (white keys) in circle-of-fifths order.
// NOTES_1_SHARP / NEW_NOTES_1_SHARP: the 5 secondary tones (black keys).
// NOTES_2 / NEW_NOTES_2: the 6 extra tones of the ascending spiral (suffix x),
//   generated when stacking beyond 12 fifths — see essay §III "The Ascending Spiral".

export const NOTES_1       = ["C",  "G",  "D",  "A",  "E",  "B",  "F#"] as const;
export const NEW_NOTES_1   = ["A",  "E",  "B",  "F",  "C",  "G",  "D" ] as const;

export const NOTES_1_SHARP     = ["C#", "G#", "D#", "A#", "F" ] as const;
export const NEW_NOTES_1_SHARP = ["A#", "E#", "B#", "F#", "C#"] as const;

export const NOTES_1_ALL     = [...NOTES_1,     ...NOTES_1_SHARP    ] as const;
export const NEW_NOTES_1_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP] as const;

export const NOTES_2     = ["Cx", "Gx", "Dx", "Ax", "Ex", "Bx"] as const;
export const NEW_NOTES_2 = ["Ax", "Ex", "Bx", "Fx", "Cx", "Gx"] as const;

// ── Wrap copy ─────────────────────────────────────────────────────────────────
// createWrapCopy returns the same 12 notes in the same forward order.
// Appended after the x-tones in NOTES_ALL, it creates a 30-entry circular
// scaffold: flat-mode patterns with negative offsets resolve via wrapSpiral()
// to indices 18–29, retrieving the correct notes without going out of bounds.
//
// The copy must be in FORWARD order, not reversed. wrapSpiral() accesses it
// right-to-left (index 29 downward), which effectively reads it in reverse —
// reversing it here would double-invert and produce wrong notes.

function createWrapCopy<T extends readonly string[]>(notes: T): readonly string[] {
  return [...notes];
}

export const NOTES_1_ALL_WRAP     = createWrapCopy(NOTES_1_ALL);
export const NEW_NOTES_1_ALL_WRAP = createWrapCopy(NEW_NOTES_1_ALL);

// NOTES_ALL: 30 entries = 12 primary+secondary + 6 x-tones + 12 wrap copy.
// The wrap copy enables all 84 root×mode combinations to resolve correctly.
export const NOTES_ALL     = [...NOTES_1_ALL, ...NOTES_2,      ...NOTES_1_ALL_WRAP    ] as const;
export const NEW_NOTES_ALL = [...NEW_NOTES_1_ALL, ...NEW_NOTES_2, ...NEW_NOTES_1_ALL_WRAP] as const;

// ── Frequencies ───────────────────────────────────────────────────────────────
// Pythagorean frequencies for the 18 generative tones only (3^0 through 3^17).
// The wrap copy (indices 18–29) carries the same frequencies as indices 0–11 —
// identical pitch-class, with octave register handled by reduceToOctave.
// Built from the first 18 entries of NOTES_ALL to stay coupled to note order.

export type NoteFrequency = { note: string; frequency: number };

export const FREQUENCIES: readonly NoteFrequency[] =
  NOTES_ALL.slice(0, 18).map((note, i) => ({ note, frequency: 3 ** i }));

export const NEW_FREQUENCIES: readonly NoteFrequency[] =
  NEW_NOTES_ALL.slice(0, 18).map((note, i) => ({ note, frequency: 3 ** i }));

// ── Lookup maps ───────────────────────────────────────────────────────────────
// note → frequency (public) and note → generation index (private).
// Built from the 18-note arrays so each note maps to its first (and correct) occurrence.
// O(1) access replaces O(n) findIndex / find in getScale and getFrequency.

export const FREQUENCY_MAP     = new Map(FREQUENCIES.map(f     => [f.note, f.frequency]));
export const NEW_FREQUENCY_MAP = new Map(NEW_FREQUENCIES.map(f => [f.note, f.frequency]));

const NOTE_INDEX_MAP     = new Map(FREQUENCIES.map((f, i)     => [f.note, i]));
const NEW_NOTE_INDEX_MAP = new Map(NEW_FREQUENCIES.map((f, i) => [f.note, i]));

// ── Wrap frequency arrays ─────────────────────────────────────────────────────
// 30-entry arrays mirroring NOTES_ALL layout, used exclusively by getScale.
// Entries 18–29 are copies of entries 0–11 — same NoteFrequency objects.

const FREQUENCIES_WRAP:     readonly NoteFrequency[] = [...FREQUENCIES,     ...FREQUENCIES.slice(0, 12)];
const NEW_FREQUENCIES_WRAP: readonly NoteFrequency[] = [...NEW_FREQUENCIES, ...NEW_FREQUENCIES.slice(0, 12)];

// ── Modes ─────────────────────────────────────────────────────────────────────
// NEW_MODES are named after the seven classical planets — see essay §IV.
// Order is fixed: index 0–6 maps to SCALE_DEGREE_KEYS and WANDERING_STARS.

export const MODES = [
  "Lydian", "Mixolydian", "Aeolian", "Locrian",
  "Ionian", "Dorian", "Phrygian",
] as const;

export const NEW_MODES = [
  "Lunar", "Mercurial", "Venusian", "Solar",
  "Martial", "Jovial", "Saturnine",
] as const;

export type Mode    = typeof MODES[number];
export type NewMode = typeof NEW_MODES[number];

const MODE_INDEX     = new Map(MODES.map((m, i)     => [m, i]));
const NEW_MODE_INDEX = new Map(NEW_MODES.map((m, i) => [m, i]));

// ── Scale degrees ─────────────────────────────────────────────────────────────

export const SCALE_DEGREES = {
  Tonic:       0,
  Supertonic:  1,
  Mediant:     2,
  Subdominant: 3,
  Dominant:    4,
  Submediant:  5,
  Subtonic:    6,
} as const;

export type ScaleDegree      = keyof typeof SCALE_DEGREES;
export type ScaleDegreeIndex = typeof SCALE_DEGREES[ScaleDegree];

export const SCALE_DEGREE_KEYS     = Object.keys(SCALE_DEGREES) as ScaleDegree[];
export const SCALE_DEGREE_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;

// ── Mode patterns ─────────────────────────────────────────────────────────────
// Each offset is the step count from the root along the circle of fifths.
// Lydian = 0 (brightest); negative values = flatter, more dissonant.

const MODE_OFFSETS = [0, -2, -4, -6, -1, -3, -5] as const;

export const MODE_PATTERNS: readonly { mode: Mode; pattern: readonly number[] }[] =
  MODES.map((mode, i) => ({
    mode,
    pattern: Array.from({ length: 7 }, (_, j) => MODE_OFFSETS[i] + j),
  }));

// ── Sorted notes ──────────────────────────────────────────────────────────────
// Primary tones only (no sharps, no x-tones), sorted alphabetically.
// Used by components that display notes in chromatic rather than generative order.

export const NOTES_1_ALL_SORTED: NoteFrequency[] = (() => {
  const noteSet = new Set(NOTES_1_ALL as readonly string[]);
  return FREQUENCIES
    .filter(f => noteSet.has(f.note))
    .sort((a, b) => a.note.localeCompare(b.note));
})();

// ── getScale ──────────────────────────────────────────────────────────────────
// Uses wrapSpiral() into the 30-entry FREQUENCIES_WRAP — a single strategy
// that handles all 84 root×mode combinations:
//
//   • rootIndex + offset ∈ [0..17]  → original or x-tone (no change)
//   • rootIndex + offset ∈ [18..29] → sharp-root Lydian x-tones (correct)
//   • rootIndex + offset < 0        → wraps to [18..29] (flat-mode wrap copy)
//
// F Lunar correctly yields F Cx Gx Dx Ax Ex Bx (ascending spiral).
// C Phrygian correctly yields C# G# D# A# F C G (flat wrap copy).

export type ScaleNote = NoteFrequency & {
  degree:     number;
  degreeName: ScaleDegree;
  numeral:    string;
};

export function getScale(
  rootNote: string,
  mode:     Mode | NewMode,
  sorted  = false,
  useNew  = false,
): ScaleNote[] {
  const freqWrap     = useNew ? NEW_FREQUENCIES_WRAP : FREQUENCIES_WRAP;
  const noteIndexMap = useNew ? NEW_NOTE_INDEX_MAP   : NOTE_INDEX_MAP;

  const rootIndex = noteIndexMap.get(rootNote);
  if (rootIndex === undefined) throw new Error(`Root note "${rootNote}" not found`);

  const modeIndex = (useNew ? NEW_MODE_INDEX : MODE_INDEX).get(mode as Mode & NewMode);
  if (modeIndex === undefined) throw new Error(`Mode "${mode}" not found`);

  const { pattern } = MODE_PATTERNS[modeIndex];
  const size        = freqWrap.length; // 30

  // No bounds guard needed: rootIndex ∈ [0..11], mode offsets ∈ [-6..+6],
  // so rootIndex + offset ∈ [-6..17] — always wraps safely within [0..29].

  // Degree assignments rotate around the root's position in the pattern.
  // For Lydian, offset 0 is at index 0 — degrees run I..VII as-is.
  // For other modes the root sits deeper (e.g. Phrygian index 5), so without
  // rotation index 0 would be mislabeled Mediant, Subtonic, etc.
  const rootOffsetIndex = pattern.indexOf(0);

  const scale: ScaleNote[] = pattern.map((offset, i) => {
    const idx       = ((rootIndex + offset) % size + size) % size;
    const degreeIdx = (i - rootOffsetIndex + 7) % 7;
    return {
      ...freqWrap[idx],
      degree:     degreeIdx + 1,
      degreeName: SCALE_DEGREE_KEYS[degreeIdx],
      numeral:    SCALE_DEGREE_NUMERALS[degreeIdx],
    };
  });

  if (!sorted) return scale;

  // Re-root after sort: rotate so the root note leads the sorted sequence.
  const sortedScale = [...scale].sort((a, b) => a.note.localeCompare(b.note));
  const rootPos     = sortedScale.findIndex(n => n.note === rootNote);
  return [...sortedScale.slice(rootPos), ...sortedScale.slice(0, rootPos)];
}

// ── getFrequency ──────────────────────────────────────────────────────────────

export function getFrequency(note: string, useNew = false): number | undefined {
  return (useNew ? NEW_FREQUENCY_MAP : FREQUENCY_MAP).get(note);
}

// ── reduceToOctave ────────────────────────────────────────────────────────────
// Shifts frequencyToReduce up or down by octaves (×2 or ÷2) until it lands in
// the same octave register as frequencyToMatch, then picks the closer neighbour.

export function reduceToOctave(frequencyToReduce: number, frequencyToMatch: number): number {
  if (frequencyToReduce <= 0 || frequencyToMatch <= 0) {
    throw new Error('Frequencies must be positive');
  }

  let r = frequencyToReduce;
  while (r >= frequencyToMatch * 2) r /= 2;
  while (r <  frequencyToMatch / 2) r *= 2;

  return Math.abs(r / 2 - frequencyToMatch) < Math.abs(r - frequencyToMatch) ? r / 2 : r;
}

// ── Sonic pattern ─────────────────────────────────────────────────────────────
// Semitone positions of a 7-note Pythagorean scale within the 12-note chromatic
// circle: [0, 2, 4, 6, 7, 9, 11] = W–W–W–H–W–W–H interval pattern.

export const SONIC_PATTERN = [0, 2, 4, 6, 7, 9, 11] as const;