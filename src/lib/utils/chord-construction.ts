// src/lib/utils/chords.ts
// ── Chord Detection ───────────────────────────────────────────────────────────
// Builds every chord possible within a 7-note scale derived from SONIC_PATTERN.
//
// SONIC_PATTERN = [0,2,4,6,7,9,11] — semitone positions on a 12-dot chromatic
// circle. The 7 gaps between consecutive degrees are [2,2,2,1,2,2,1].
// Depending on which dot you start from, you get a different mode/scale.
// Every chord is built purely from those 7 scale notes — no note is ever
// outside the scale, so no wolf intervals can occur within a single scale.
//
// DESIGN: all chord qualities and semitone intervals are pre-computed at module
// load from SONIC_PATTERN gaps alone. buildChord() is just array lookups — no
// math at call time, no frequency comparisons.
//
// CHORD FAMILIES:
//   Int__     dyads: Int2 Int3 Int5 Int6 Int7
//   Sus__     suspended triads: Sus2 Sus4
//   Shell3    open triad (root+third+seventh)
//   Quartal_  stacked fourths: Quartal3–6
//   Cluster_  packed adjacent degrees: Cluster3–6
//   Spread_   open spread voicing (inversions of Quartal_): Spread4–6
//   Add__     added-note tetrads: Add9 Add11 Add13
//   Sus5      pentatonic suspended pentad
//
// INVERSION PAIRS (same gap multiset on the circle):
//   Sus2 ↔ Sus4  |  Add9 ↔ Add11
//   Quartal4 ↔ Spread4  |  Quartal5 ↔ Spread5  |  Quartal6 ↔ Spread6
//
// ∅ = no widely accepted standard name

import { type ScaleNote, SONIC_PATTERN } from "./sounds";

// ── Gap Table ─────────────────────────────────────────────────────────────────
// Semitone steps between consecutive scale degrees, derived from SONIC_PATTERN.
// Stored as a circular array — index wraps modulo 7.

const GAPS: readonly number[] = (() => {
  const gaps: number[] = [];
  for (let i = 1; i < SONIC_PATTERN.length; i++)
    gaps.push(SONIC_PATTERN[i] - SONIC_PATTERN[i - 1]);
  gaps.push(12 - SONIC_PATTERN[SONIC_PATTERN.length - 1] + SONIC_PATTERN[0]);
  return gaps;
})();
// SONIC_PATTERN [0,2,4,6,7,9,11] → GAPS [2,2,2,1,2,2,1]

// Semitone distance from scale degree `from` stepping `steps` degrees forward.
function semitonesFrom(from: number, steps: number): number {
  let s = 0;
  for (let i = 0; i < steps; i++) s += GAPS[(from + i) % 7];
  return s;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChordQuality =
  // ── Dyads (2-note) ────────────────────────────────────────────────────────
  | "Int5"            // [0,4]  P5 (or TT- on degree 4)
  | "Int3"            // [0,2]  M3 or m3               ∅
  | "Int2"            // [0,1]  M2 or m2               ∅
  | "Int6"            // [0,5]  M6 or m6               ∅
  | "Int7"            // [0,6]  M7 or m7               ∅
  // ── Tertian triads (3-note) [0,2,4] ──────────────────────────────────────
  | "Major"           // M3 + P5
  | "Minor"           // m3 + P5
  | "Diminished"      // m3 + TT-   (degree 4 only in this scale)
  // ── Sus triads (3-note) ───────────────────────────────────────────────────
  | "Sus2"            // [0,1,4]  M2/m2 + P5  inverse: Sus4
  | "Sus4"            // [0,3,4]  P4/TT- + P5 inverse: Sus2
  // ── Non-tertian triads (3-note) ───────────────────────────────────────────
  | "Shell3"          // [0,2,6]  root + third + seventh  ∅
  | "Quartal3"        // [0,3,6]  stacked fourths  ∅  self-inverse
  | "Cluster3"        // [0,1,2]  packed adjacent degrees  ∅
  // ── Seventh chords (4-note) [0,2,4,6] ────────────────────────────────────
  | "Major7"          // M3+P5+M7    (degrees I, V)
  | "Dominant7"       // M3+P5+m7    (degree II)
  | "Minor7"          // m3+P5+m7    (degrees III, VI, VII)
  | "HalfDiminished7" // m3+TT-+m7  (degree IV)
  // ── Add tetrads (4-note) ──────────────────────────────────────────────────
  | "Add9"            // [0,1,2,4]  inverse: Add11  ∅
  | "Add11"           // [0,2,3,4]  inverse: Add9
  | "Add13"           // [0,2,4,5]  unique shape
  // ── Non-tertian tetrads (4-note) ──────────────────────────────────────────
  | "Quartal4"        // [0,2,3,6]  inverse: Spread4  ∅
  | "Spread4"         // [0,2,5,6]  inverse: Quartal4  ∅
  | "Cluster4"        // [0,1,2,3]  ∅
  // ── Ninth chords (5-note) [0,1,2,4,6] ────────────────────────────────────
  | "Major9"          // M3+P5 core  (degrees I, II, V)
  | "Minor9"          // m3+P5 core  (degrees III, IV, VI, VII)
  // ── Non-tertian pentads (5-note) ──────────────────────────────────────────
  | "Sus5"            // [0,1,2,4,5]  ∅
  | "Quartal5"        // [0,3,6,2,5]  inverse: Spread5  ∅
  | "Spread5"         // [0,2,3,5,6]  inverse: Quartal5  ∅
  | "Cluster5"        // [0,1,2,3,4]  ∅
  // ── Eleventh chords (6-note) [0,1,2,3,4,6] ───────────────────────────────
  | "Major11"         // M3 at degree step 2  (degrees I, II, V)
  | "Minor11"         // m3 at degree step 2  (degrees III, IV, VI, VII)
  // ── Non-tertian hexads (6-note) ───────────────────────────────────────────
  | "Quartal6"        // [0,1,2,3,5,6]  inverse: Spread6  ∅
  | "Spread6"         // [0,1,3,4,5,6]  inverse: Quartal6  ∅
  | "Cluster6"        // [0,1,2,3,4,5]  ∅
  // ── Thirteenth chords (7-note) [0,1,2,3,4,5,6] ───────────────────────────
  | "Major13"         // M3 at degree step 2  (degrees I, II, V)
  | "Minor13"         // m3 at degree step 2  (degrees III, IV, VI, VII)
  // ── Heptad voicings (7-note) ──────────────────────────────────────────────
  | "HeptQrt13"       // [0,3,6,2,5,1,4]  quartal voicing   ∅
  | "HeptQnt13";      // [0,4,1,5,2,6,3]  quintal voicing   ∅

const INTERVAL_NAME = new Map<number, string>([
  [0,"P1"],[1,"m2"],[2,"M2"],[3,"m3"],[4,"M3"],
  [5,"P4"],[6,"TT-"],[7,"P5"],[8,"m6"],[9,"M6"],
  [10,"m7"],[11,"M7"],
]);

// Symbol suffix for each quality
const QUALITY_SYMBOL: Readonly<Record<ChordQuality, string>> = {
  Int5:"5", Int3:"3", Int2:"2", Int6:"6", Int7:"7",
  Major:"", Minor:"m", Diminished:"dim",
  Sus2:"sus2", Sus4:"sus4",
  Shell3:"sh", Quartal3:"qrt", Cluster3:"cls",
  Major7:"maj7", Dominant7:"7", Minor7:"m7", HalfDiminished7:"ø7",
  Add9:"add9", Add11:"add11", Add13:"add13",
  Quartal4:"qrt4", Spread4:"sp4", Cluster4:"cls4",
  Major9:"maj9", Minor9:"m9",
  Sus5:"sus5", Quartal5:"qrt5", Spread5:"sp5", Cluster5:"cls5",
  Major11:"maj11", Minor11:"m11",
  Quartal6:"qrt6", Spread6:"sp6", Cluster6:"cls6",
  Major13:"maj13", Minor13:"m13",
  HeptQrt13:"hqrt", HeptQnt13:"hqnt",
};

export interface ChordDefinition {
  readonly quality:  ChordQuality;  // structural name (tertian qualities resolved per-degree)
  readonly degrees:  readonly number[];
  readonly size:     2 | 3 | 4 | 5 | 6 | 7;
}

export interface Chord {
  readonly root:      ScaleNote;
  readonly quality:   ChordQuality;
  readonly symbol:    string;         // e.g. "Cmaj7"
  readonly notes:     ScaleNote[];
  readonly degrees:   number[];       // resolved scale indexes (not offsets)
  readonly intervals: string[];       // semitone interval names from root
}

// ── Pre-computed Lookup Table ─────────────────────────────────────────────────
// For each (chord definition, root scale degree), store quality + intervals.
// Computed once at module load — buildChord() performs zero arithmetic.

interface Lookup {
  quality:   ChordQuality;
  intervals: string[];
}

// Resolve quality from semitone intervals
function resolveQuality(defQuality: ChordQuality, ints: number[]): ChordQuality {
  switch (defQuality) {
    case "Major":
    case "Minor":
    case "Diminished": {
      // Tertian triad [0,2,4]: third=ints[1], fifth=ints[2]
      const [, t, f] = ints;
      if (t === 4 && f === 7) return "Major";
      if (t === 3 && f === 7) return "Minor";
      if (t === 3 && f === 6) return "Diminished";
      return "Minor"; // fallback (shouldn't occur in-scale)
    }
    case "Major7":
    case "Dominant7":
    case "Minor7":
    case "HalfDiminished7": {
      // Seventh chord [0,2,4,6]: third=ints[1], fifth=ints[2], seventh=ints[3]
      const [, t, f, s] = ints;
      if (t === 4 && f === 7 && s === 11) return "Major7";
      if (t === 4 && f === 7 && s === 10) return "Dominant7";
      if (t === 3 && f === 7 && s === 10) return "Minor7";
      if (t === 3 && f === 6 && s === 10) return "HalfDiminished7";
      return "Minor7"; // fallback
    }
    case "Major9":
    case "Minor9": {
      // Ninth chord [0,1,2,4,6]: third at step 2 = ints[2]
      return ints[2] === 4 ? "Major9" : "Minor9";
    }
    case "Major11":
    case "Minor11": {
      // Eleventh chord [0,1,2,3,4,6]: third at step 2 = ints[2]
      return ints[2] === 4 ? "Major11" : "Minor11";
    }
    case "Major13":
    case "Minor13": {
      // Thirteenth chord [0,1,2,3,4,5,6]: third at step 2 = ints[2]
      return ints[2] === 4 ? "Major13" : "Minor13";
    }
    default:
      return defQuality;
  }
}

// The 30 structural chord definitions — quality field used as the resolver key
// for tertian families; non-tertian chords are their own identity.
const CHORD_DEFS: readonly { quality: ChordQuality; degrees: readonly number[]; size: 2|3|4|5|6|7 }[] = [
  // 2-note
  { quality:"Int5",    degrees:[0,4],           size:2 },
  { quality:"Int3",    degrees:[0,2],           size:2 },  // ∅
  { quality:"Int2",    degrees:[0,1],           size:2 },  // ∅
  { quality:"Int6",    degrees:[0,5],           size:2 },  // ∅
  { quality:"Int7",    degrees:[0,6],           size:2 },  // ∅
  // 3-note
  { quality:"Major",   degrees:[0,2,4],         size:3 },  // resolves per degree
  { quality:"Sus2",    degrees:[0,1,4],         size:3 },  // inverse: Sus4
  { quality:"Sus4",    degrees:[0,3,4],         size:3 },  // inverse: Sus2
  { quality:"Shell3",  degrees:[0,2,6],         size:3 },  // ∅
  { quality:"Quartal3",degrees:[0,3,6],         size:3 },  // ∅ self-inverse
  { quality:"Cluster3",degrees:[0,1,2],         size:3 },  // ∅
  // 4-note
  { quality:"Major7",  degrees:[0,2,4,6],       size:4 },  // resolves per degree
  { quality:"Add9",    degrees:[0,1,2,4],       size:4 },  // ∅ inverse: Add11
  { quality:"Add11",   degrees:[0,2,3,4],       size:4 },  //   inverse: Add9
  { quality:"Add13",   degrees:[0,2,4,5],       size:4 },
  { quality:"Quartal4",degrees:[0,2,3,6],       size:4 },  // ∅ inverse: Spread4
  { quality:"Spread4", degrees:[0,2,5,6],       size:4 },  // ∅ inverse: Quartal4
  { quality:"Cluster4",degrees:[0,1,2,3],       size:4 },  // ∅
  // 5-note
  { quality:"Major9",  degrees:[0,1,2,4,6],     size:5 },  // resolves per degree
  { quality:"Sus5",    degrees:[0,1,2,4,5],     size:5 },  // ∅
  { quality:"Quartal5",degrees:[0,3,6,2,5],     size:5 },  // ∅ inverse: Spread5
  { quality:"Spread5", degrees:[0,2,3,5,6],     size:5 },  // ∅ inverse: Quartal5
  { quality:"Cluster5",degrees:[0,1,2,3,4],     size:5 },  // ∅
  // 6-note
  { quality:"Major11", degrees:[0,1,2,3,4,6],   size:6 },  // resolves per degree
  { quality:"Quartal6",degrees:[0,1,2,3,5,6],   size:6 },  // ∅ inverse: Spread6
  { quality:"Spread6", degrees:[0,1,3,4,5,6],   size:6 },  // ∅ inverse: Quartal6
  { quality:"Cluster6",degrees:[0,1,2,3,4,5],   size:6 },  // ∅
  // 7-note
  { quality:"Major13", degrees:[0,1,2,3,4,5,6], size:7 },  // resolves per degree
  { quality:"HeptQrt13",degrees:[0,3,6,2,5,1,4],size:7 },  // ∅
  { quality:"HeptQnt13",degrees:[0,4,1,5,2,6,3],size:7 },  // ∅
];

// Pre-compute lookup[defIndex * 7 + rootDegree]
const LOOKUP: Lookup[] = CHORD_DEFS.flatMap((def, _di) =>
  Array.from({ length: 7 }, (_, rootDeg) => {
    const ints     = def.degrees.map(step => semitonesFrom(rootDeg, step));
    const quality  = resolveQuality(def.quality, ints);
    const intervals = ints.map(s => INTERVAL_NAME.get(s) ?? `${s}st`);
    return { quality, intervals };
  })
);

// Expose the final definitions (with lookup index embedded via array position)
export const CHORD_DEFINITIONS: readonly ChordDefinition[] = CHORD_DEFS.map(d => ({
  quality: d.quality,
  degrees: d.degrees,
  size:    d.size,
}));

// ── Core Builder ──────────────────────────────────────────────────────────────

function buildChord(
  scale:   ScaleNote[],
  rootIdx: number,
  defIdx:  number,
): Chord {
  const def     = CHORD_DEFS[defIdx];
  const { quality, intervals } = LOOKUP[defIdx * 7 + rootIdx];

  return {
    root:     scale[rootIdx],
    quality,
    symbol:   `${scale[rootIdx].note}${QUALITY_SYMBOL[quality]}`,
    notes:    def.degrees.map(o => scale[(rootIdx + o) % 7]),
    degrees:  def.degrees.map(o => (rootIdx + o) % 7),
    intervals,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHORD_QUALITY_ORDER: ChordQuality[] = [
  // Dyads
  "Int2", "Int3", "Int5", "Int6", "Int7",
  // Triads
  "Major", "Minor", "Diminished",
  "Sus2", "Sus4",
  "Shell3", "Quartal3", "Cluster3",
  // 4-note
  "Major7", "Dominant7", "Minor7", "HalfDiminished7",
  "Add9", "Add11", "Add13",
  "Quartal4", "Spread4", "Cluster4",
  // 5-note
  "Major9", "Minor9",
  "Sus5", "Quartal5", "Spread5", "Cluster5",
  // 6-note
  "Major11", "Minor11",
  "Quartal6", "Spread6", "Cluster6",
  // 7-note
  "Major13", "Minor13",
  "HeptQrt13", "HeptQnt13",
];


function buildAll(scale: ScaleNote[], defIndices: readonly number[]): Chord[] {
  const out: Chord[] = [];
  for (let rootIdx = 0; rootIdx < 7; rootIdx++)
    for (const di of defIndices)
      out.push(buildChord(scale, rootIdx, di));
  return out;
}

function buildAllWithInversions(scale: ScaleNote[], defIndices: readonly number[]): Chord[] {
  const out: Chord[] = [];
  const chordMap = new Map<string, Chord>(); // key: sorted note names

  for (let rootIdx = 0; rootIdx < 7; rootIdx++) {
    for (const di of defIndices) {
      const chord = buildChord(scale, rootIdx, di);
      // create a key based on sorted note names
      const key = chord.notes.map(n => n.note).sort().join(",");

      if (chordMap.has(key)) {
        // already exists → mark as inversion
        const parentChord = chordMap.get(key)!;
        out.push({
          ...chord,
          symbol: `${chord.symbol} (inversion of ${parentChord.symbol})`,
        });
      } else {
        // first occurrence → store as main chord
        chordMap.set(key, chord);
        out.push(chord);
      }
    }
  }
  return out;
}

function buildAllHideInversionsSorted(scale: ScaleNote[], defIndices: readonly number[]): Chord[] {
  const out: Chord[] = [];
  const chordMap = new Set<string>(); // key: sorted note names

  for (let rootIdx = 0; rootIdx < 7; rootIdx++) {
    for (const di of defIndices) {
      const chord = buildChord(scale, rootIdx, di);
      const key = chord.notes.map(n => n.note).sort().join(",");

      if (!chordMap.has(key)) {
        chordMap.add(key);
        out.push(chord);
      }
    }
  }

  // Sort by predefined chord quality order
  out.sort((a, b) => {
    const iA = CHORD_QUALITY_ORDER.indexOf(a.quality);
    const iB = CHORD_QUALITY_ORDER.indexOf(b.quality);
    return iA - iB;
  });

  return out;
}



function validate(scale: ScaleNote[]): void {
  if (scale.length !== 7)
    throw new Error(`Scale must have exactly 7 notes, got ${scale.length}`);
}

// Pre-computed index lists by size
const IDX_BY_SIZE = {
  2: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 2),
  3: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 3),
  4: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 4),
  5: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 5),
  6: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 6),
  7: CHORD_DEFS.map((_,i)=>i).filter(i => CHORD_DEFS[i].size === 7),
} as const;

// ── Public API ────────────────────────────────────────────────────────────────
// All functions take a ScaleNote[] from getScale(rootNote, mode).
// The scale already selects which 7 of the 12 chromatic positions to use.

export function getDyads(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[2]);
}

export function getTriads(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[3]);
}

export function getTetrachords(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[4]);
}

export function getPentachords(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[5]);
}

export function getHexachords(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[6]);
}

export function getHeptachords(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, IDX_BY_SIZE[7]);
}

export function getAllChords(scale: ScaleNote[]): Chord[] {
  validate(scale); return buildAllHideInversionsSorted(scale, CHORD_DEFS.map((_,i)=>i));
}

export function getChordCount(scale: ScaleNote[]): number {
  validate(scale); return CHORD_DEFS.length * scale.length;
}

/*
    Total chords including inversions: 210
    Inverted chords removed by buildAllHideInversions(): 35
    Unique (non-inversion) chords: 175
*/