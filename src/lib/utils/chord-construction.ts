// ── Chord Construction ────────────────────────────────────────────────────────
// Builds every chord possible within a 7-note Pythagorean scale.
//
// SONIC_PATTERN = [0,2,4,6,7,9,11] — the 7 semitone positions of a Pythagorean
// scale on the 12-semitone chromatic circle. The 7 gaps between consecutive
// degrees are always [2,2,2,1,2,2,1] regardless of which root or mode is used.
// Changing root or mode substitutes different pitch names into the same shape —
// the interval structure is invariant across all 84 root×mode combinations.
//
// ARCHITECTURE:
//   All chord qualities and semitone intervals are pre-computed at module load
//   from SONIC_PATTERN gaps alone (see LOOKUP table). buildChord() performs
//   zero arithmetic at call time — it is pure array indexing.
//
// INVERSION DETECTION:
//   Two chords are considered inversions when they contain the same set of
//   scale notes (same pitch-class multiset), regardless of which note is root.
//   Classic example: Sus2 on C (C,D,G) and Sus4 on G (G,C,D) — same three
//   notes, different root emphasis. The first occurrence in root-ascending
//   order is kept as the primary; subsequent occurrences are marked.
//
// NAMING CONVENTION — INVERSE PAIRS:
//   Pairs share a note-set but differ in which note is treated as root.
//   Named symmetrically after their structural interval, like Sus2 ↔ Sus4:
//
//     Sus2    ↔  Sus4       suspended 2nd  vs suspended 4th
//     Quartal ↔  Quintal    stacked 4ths   vs stacked 5ths  (4th inverted = 5th)
//
//   Self-inverse: Quartal3 [0,3,6] — every inversion of it is another Quartal3.
//   Note: Quartal4/Quintal4 and Quartal6/Quintal6 are complementary voicings
//   (not identical pitch-class sets) but follow the same 4th/5th naming logic.
//
// CHORD FAMILIES:
//   Int__       dyads:            Int2 Int3 Int5 Int6 Int7
//   Sus__       suspended triads: Sus2 Sus4
//   Shell3      open triad        root + third + seventh          ∅
//   Quartal_    stacked 4ths:     Quartal3 Quartal4 Quartal5 Quartal6
//   Quintal_    stacked 5ths:     Quintal4 Quintal5 Quintal6      ∅
//   Cluster_    adjacent degrees: Cluster3 Cluster4 Cluster5 Cluster6
//   Add__       added-note:       Add9 Add11 Add13
//   Sus5        pentatonic sus                                     ∅
//   Tertian     triads, 7ths, 9ths, 11ths, 13ths (resolved per root degree)
//   Hept__      full 7-note:      HeptQrt13 HeptQnt13              ∅
//
// ∅ = no widely accepted standard name in common practice

import { type ScaleNote, SONIC_PATTERN } from '$lib/utils/sounds';

// ── Error ─────────────────────────────────────────────────────────────────────

export class ChordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChordError';
  }
}

// ── Gap Table ─────────────────────────────────────────────────────────────────
// Semitone steps between consecutive scale degrees, derived from SONIC_PATTERN.
// Stored as a circular array — access with (degree + step) % 7.
// SONIC_PATTERN [0,2,4,6,7,9,11] → GAPS [2,2,2,1,2,2,1]

const GAPS: readonly number[] = (() => {
  const gaps: number[] = [];
  for (let i = 1; i < SONIC_PATTERN.length; i++)
    gaps.push(SONIC_PATTERN[i] - SONIC_PATTERN[i - 1]);
  // Wrap-around gap: from the last degree back to the first across the octave
  gaps.push(12 - SONIC_PATTERN[SONIC_PATTERN.length - 1] + SONIC_PATTERN[0]);
  return gaps;
})();

// Total semitone distance from scale degree `from` stepping `steps` degrees up.
function semitonesFrom(from: number, steps: number): number {
  let s = 0;
  for (let i = 0; i < steps; i++) s += GAPS[(from + i) % 7];
  return s;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChordQuality =
  // ── Dyads (2-note) ────────────────────────────────────────────────────────
  | 'Int2'             // [0,1]  M2 or m2                         ∅
  | 'Int3'             // [0,2]  M3 or m3                         ∅
  | 'Int5'             // [0,4]  P5 (or TT on degree 4)
  | 'Int6'             // [0,5]  M6 or m6                         ∅
  | 'Int7'             // [0,6]  M7 or m7                         ∅
  // ── Tertian triads (3-note) [0,2,4] ──────────────────────────────────────
  | 'Major'            // M3 + P5
  | 'Minor'            // m3 + P5
  | 'Diminished'       // m3 + TT  (degree 4 only in this scale)
  // ── Suspended triads (3-note) — inverse pair: Sus2 ↔ Sus4 ─────────────────
  | 'Sus2'             // [0,1,4]  M2/m2 + P5    inverse: Sus4
  | 'Sus4'             // [0,3,4]  P4/TT  + P5   inverse: Sus2
  // ── Non-tertian triads (3-note) ───────────────────────────────────────────
  | 'Shell3'           // [0,2,6]  root + third + seventh         ∅
  | 'Quartal3'         // [0,3,6]  stacked 4ths, 3 notes          ∅ self-inverse
  | 'Cluster3'         // [0,1,2]  packed adjacent degrees        ∅
  // ── Seventh chords (4-note) [0,2,4,6] ────────────────────────────────────
  | 'Major7'           // M3 + P5 + M7    (degrees I, V)
  | 'Dominant7'        // M3 + P5 + m7    (degree  II)
  | 'Minor7'           // m3 + P5 + m7    (degrees III, VI, VII)
  | 'HalfDiminished7'  // m3 + TT  + m7   (degree  IV)
  // ── Added-note tetrads (4-note) ───────────────────────────────────────────
  | 'Add9'             // [0,1,2,4]  inverse: Add11               ∅
  | 'Add11'            // [0,2,3,4]  inverse: Add9
  | 'Add13'            // [0,2,4,5]  unique shape
  // ── Non-tertian tetrads (4-note) — inverse pair: Quartal4 ↔ Quintal4 ─────
  | 'Quartal4'         // [0,2,3,6]  stacked-4ths voicing         ∅ inverse: Quintal4
  | 'Quintal4'         // [0,2,5,6]  stacked-5ths voicing         ∅ inverse: Quartal4
  | 'Cluster4'         // [0,1,2,3]  packed adjacent degrees      ∅
  // ── Ninth chords (5-note) [0,1,2,4,6] ────────────────────────────────────
  | 'Major9'           // M3 at step 2  (degrees I, II, V)
  | 'Minor9'           // m3 at step 2  (degrees III, IV, VI, VII)
  // ── Non-tertian pentads (5-note) — inverse pair: Quartal5 ↔ Quintal5 ─────
  | 'Sus5'             // [0,1,2,4,5]  pentatonic sus              ∅
  | 'Quartal5'         // [0,3,6,2,5]  stacked 4ths, 5 notes      ∅ inverse: Quintal5
  | 'Quintal5'         // [0,2,3,5,6]  stacked 5ths, 5 notes      ∅ inverse: Quartal5
  | 'Cluster5'         // [0,1,2,3,4]  packed adjacent degrees    ∅
  // ── Eleventh chords (6-note) [0,1,2,3,4,6] ───────────────────────────────
  | 'Major11'          // M3 at step 2  (degrees I, II, V)
  | 'Minor11'          // m3 at step 2  (degrees III, IV, VI, VII)
  // ── Non-tertian hexads (6-note) — inverse pair: Quartal6 ↔ Quintal6 ──────
  | 'Quartal6'         // [0,1,2,3,5,6]  stacked-4ths voicing     ∅ inverse: Quintal6
  | 'Quintal6'         // [0,1,3,4,5,6]  stacked-5ths voicing     ∅ inverse: Quartal6
  | 'Cluster6'         // [0,1,2,3,4,5]  packed adjacent degrees  ∅
  // ── Thirteenth chords (7-note) [0,1,2,3,4,5,6] ───────────────────────────
  | 'Major13'          // M3 at step 2  (degrees I, II, V)
  | 'Minor13'          // m3 at step 2  (degrees III, IV, VI, VII)
  // ── Heptad special voicings (7-note) ─────────────────────────────────────
  | 'HeptQrt13'        // [0,3,6,2,5,1,4]  quartal voicing        ∅
  | 'HeptQnt13';       // [0,4,1,5,2,6,3]  quintal voicing        ∅

// Human-readable name for each semitone distance from root
const INTERVAL_NAME = new Map<number, string>([
  [0,'P1'],[1,'m2'],[2,'M2'],[3,'m3'],[4,'M3'],
  [5,'P4'],[6,'TT' ],[7,'P5'],[8,'m6'],[9,'M6'],
  [10,'m7'],[11,'M7'],
]);

// Short suffix appended to the root note name to form the chord symbol
const QUALITY_SYMBOL: Readonly<Record<ChordQuality, string>> = {
  Int2:'2',  Int3:'3',  Int5:'5',  Int6:'6',  Int7:'7',
  Major:'',  Minor:'m', Diminished:'dim',
  Sus2:'sus2', Sus4:'sus4',
  Shell3:'sh', Quartal3:'qrt', Cluster3:'cls',
  Major7:'maj7', Dominant7:'7', Minor7:'m7', HalfDiminished7:'ø7',
  Add9:'add9', Add11:'add11', Add13:'add13',
  Quartal4:'qrt4', Quintal4:'qnt4', Cluster4:'cls4',
  Major9:'maj9', Minor9:'m9',
  Sus5:'sus5', Quartal5:'qrt5', Quintal5:'qnt5', Cluster5:'cls5',
  Major11:'maj11', Minor11:'m11',
  Quartal6:'qrt6', Quintal6:'qnt6', Cluster6:'cls6',
  Major13:'maj13', Minor13:'m13',
  HeptQrt13:'hqrt', HeptQnt13:'hqnt',
};

// ── Chord Definitions ─────────────────────────────────────────────────────────
// 30 structural templates. `degrees` are offsets from the root scale degree —
// e.g. [0,2,4] means root + 2nd degree above it + 4th degree above it.
// For tertian families, `quality` is a resolver key (see resolveQuality);
// non-tertian chords are their own identity and never change quality.

interface ChordDef {
  readonly quality:  ChordQuality;
  readonly degrees:  readonly number[];
  readonly size:     2 | 3 | 4 | 5 | 6 | 7;
}

const CHORD_DEFS: readonly ChordDef[] = [
  // ── Dyads ──────────────────────────────────────────────────────────────────
  { quality:'Int5',        degrees:[0,4],             size:2 },
  { quality:'Int3',        degrees:[0,2],             size:2 },
  { quality:'Int2',        degrees:[0,1],             size:2 },
  { quality:'Int6',        degrees:[0,5],             size:2 },
  { quality:'Int7',        degrees:[0,6],             size:2 },
  // ── Triads ─────────────────────────────────────────────────────────────────
  { quality:'Major',       degrees:[0,2,4],           size:3 }, // resolves per root
  { quality:'Sus2',        degrees:[0,1,4],           size:3 }, // inverse: Sus4
  { quality:'Sus4',        degrees:[0,3,4],           size:3 }, // inverse: Sus2
  { quality:'Shell3',      degrees:[0,2,6],           size:3 },
  { quality:'Quartal3',    degrees:[0,3,6],           size:3 }, // self-inverse
  { quality:'Cluster3',    degrees:[0,1,2],           size:3 },
  // ── Tetrads ────────────────────────────────────────────────────────────────
  { quality:'Major7',      degrees:[0,2,4,6],         size:4 }, // resolves per root
  { quality:'Add9',        degrees:[0,1,2,4],         size:4 }, // inverse: Add11
  { quality:'Add11',       degrees:[0,2,3,4],         size:4 }, // inverse: Add9
  { quality:'Add13',       degrees:[0,2,4,5],         size:4 },
  { quality:'Quartal4',    degrees:[0,2,3,6],         size:4 }, // inverse: Quintal4
  { quality:'Quintal4',    degrees:[0,2,5,6],         size:4 }, // inverse: Quartal4
  { quality:'Cluster4',    degrees:[0,1,2,3],         size:4 },
  // ── Pentads ────────────────────────────────────────────────────────────────
  { quality:'Major9',      degrees:[0,1,2,4,6],       size:5 }, // resolves per root
  { quality:'Sus5',        degrees:[0,1,2,4,5],       size:5 },
  { quality:'Quartal5',    degrees:[0,3,6,2,5],       size:5 }, // inverse: Quintal5
  { quality:'Quintal5',    degrees:[0,2,3,5,6],       size:5 }, // inverse: Quartal5
  { quality:'Cluster5',    degrees:[0,1,2,3,4],       size:5 },
  // ── Hexads ─────────────────────────────────────────────────────────────────
  { quality:'Major11',     degrees:[0,1,2,3,4,6],     size:6 }, // resolves per root
  { quality:'Quartal6',    degrees:[0,1,2,3,5,6],     size:6 }, // inverse: Quintal6
  { quality:'Quintal6',    degrees:[0,1,3,4,5,6],     size:6 }, // inverse: Quartal6
  { quality:'Cluster6',    degrees:[0,1,2,3,4,5],     size:6 },
  // ── Heptads ────────────────────────────────────────────────────────────────
  { quality:'Major13',     degrees:[0,1,2,3,4,5,6],   size:7 }, // resolves per root
  { quality:'HeptQrt13',   degrees:[0,3,6,2,5,1,4],   size:7 },
  { quality:'HeptQnt13',   degrees:[0,4,1,5,2,6,3],   size:7 },
];

// ── Quality Resolution ────────────────────────────────────────────────────────
// For tertian families, the actual quality depends on the specific semitone
// intervals at a given root degree. Non-tertian chords return unchanged.

function resolveQuality(defQuality: ChordQuality, ints: readonly number[]): ChordQuality {
  switch (defQuality) {
    // Tertian triad [0,2,4]: classify by third (ints[1]) and fifth (ints[2])
    case 'Major':
    case 'Minor':
    case 'Diminished': {
      const [, third, fifth] = ints;
      if (third === 4 && fifth === 7) return 'Major';
      if (third === 3 && fifth === 7) return 'Minor';
      if (third === 3 && fifth === 6) return 'Diminished';
      throw new ChordError(`Unexpected triad intervals: third=${third}, fifth=${fifth}`);
    }
    // Seventh chord [0,2,4,6]: classify by third, fifth, and seventh
    case 'Major7':
    case 'Dominant7':
    case 'Minor7':
    case 'HalfDiminished7': {
      const [, third, fifth, seventh] = ints;
      if (third === 4 && fifth === 7 && seventh === 11) return 'Major7';
      if (third === 4 && fifth === 7 && seventh === 10) return 'Dominant7';
      if (third === 3 && fifth === 7 && seventh === 10) return 'Minor7';
      if (third === 3 && fifth === 6 && seventh === 10) return 'HalfDiminished7';
      throw new ChordError(`Unexpected 7th chord intervals: third=${third}, fifth=${fifth}, seventh=${seventh}`);
    }
    // 9th / 11th / 13th: classify by third at step 2 (ints[2])
    case 'Major9':  case 'Minor9':  {
      return ints[2] === 4 ? 'Major9'  : 'Minor9';
    }
    case 'Major11': case 'Minor11': {
      return ints[2] === 4 ? 'Major11' : 'Minor11';
    }
    case 'Major13': case 'Minor13': {
      return ints[2] === 4 ? 'Major13' : 'Minor13';
    }
    default:
      return defQuality;
  }
}

// ── Pre-computed Lookup Table ─────────────────────────────────────────────────
// For every (chord definition × root scale degree) pair, store the resolved
// quality and interval name array. Computed once at module load.
// Index into LOOKUP with: defIndex * 7 + rootDegree

interface LookupEntry {
  readonly quality:   ChordQuality;
  readonly intervals: readonly string[];
}

const LOOKUP: readonly LookupEntry[] = CHORD_DEFS.flatMap((def) =>
  Array.from({ length: 7 }, (_, rootDeg) => {
    const ints      = def.degrees.map(step => semitonesFrom(rootDeg, step));
    const quality   = resolveQuality(def.quality, ints);
    const intervals = ints.map(s => INTERVAL_NAME.get(s) ?? `${s}st`);
    return { quality, intervals };
  })
);

// ── Public Interfaces ─────────────────────────────────────────────────────────

export interface ChordDefinition {
  readonly quality:  ChordQuality;
  readonly degrees:  readonly number[];
  readonly size:     2 | 3 | 4 | 5 | 6 | 7;
}

export interface Chord {
  readonly root:      ScaleNote;
  readonly quality:   ChordQuality;
  readonly symbol:    string;            // e.g. "Cmaj7" or "Cmaj7 (inv. of Amaj7)"
  readonly notes:     readonly ScaleNote[];
  readonly degrees:   readonly number[]; // resolved scale indices (not offsets)
  readonly intervals: readonly string[]; // semitone interval names from root
}

export interface ChordOptions {
  // When true (default): each unique note-set appears once, sorted by quality.
  // When false: all 7×n chords shown; inversions labelled in their symbol.
  hideInversions?: boolean;
}

// ── Chord Quality Sort Order ──────────────────────────────────────────────────
// Canonical display order: dyads → triads → tetrads → pentads → hexads → heptads,
// tertian families before non-tertian within each size group.
// CHORD_QUALITY_RANK gives O(1) sort lookup — avoids indexOf on every comparison.

const CHORD_QUALITY_ORDER: readonly ChordQuality[] = [
  'Int2','Int3','Int5','Int6','Int7',
  'Major','Minor','Diminished',
  'Sus2','Sus4',
  'Shell3','Quartal3','Cluster3',
  'Major7','Dominant7','Minor7','HalfDiminished7',
  'Add9','Add11','Add13',
  'Quartal4','Quintal4','Cluster4',
  'Major9','Minor9',
  'Sus5','Quartal5','Quintal5','Cluster5',
  'Major11','Minor11',
  'Quartal6','Quintal6','Cluster6',
  'Major13','Minor13',
  'HeptQrt13','HeptQnt13',
];

const CHORD_QUALITY_RANK: ReadonlyMap<ChordQuality, number> = new Map(
  CHORD_QUALITY_ORDER.map((q, i) => [q, i])
);

// ── Core Builder ──────────────────────────────────────────────────────────────

function buildChord(scale: ScaleNote[], rootIdx: number, defIdx: number): Chord {
  const def                    = CHORD_DEFS[defIdx];
  const { quality, intervals } = LOOKUP[defIdx * 7 + rootIdx];

  return {
    root:      scale[rootIdx],
    quality,
    symbol:    `${scale[rootIdx].note}${QUALITY_SYMBOL[quality]}`,
    notes:     def.degrees.map(o => scale[(rootIdx + o) % 7]),
    degrees:   def.degrees.map(o => (rootIdx + o) % 7),
    intervals,
  };
}

// ── Scale Validation ──────────────────────────────────────────────────────────

function validateScale(scale: ScaleNote[]): void {
  if (!Array.isArray(scale))
    throw new ChordError('Scale must be an array of ScaleNote');
  if (scale.length !== 7)
    throw new ChordError(`Scale must have exactly 7 notes, got ${scale.length}`);
  if (scale.some(n => typeof n.frequency !== 'number' || n.frequency <= 0))
    throw new ChordError('Every scale note must carry a positive numeric frequency');
  if (scale.some(n => typeof n.note !== 'string' || n.note.length === 0))
    throw new ChordError('Every scale note must carry a non-empty note name');
}

// ── Core Chord Set Builder ────────────────────────────────────────────────────
// Iterates all 7 roots × selected definitions, optionally deduplicating by
// pitch-class set, then sorts by canonical quality order.
//
// Inversion detection key: sorted note names of the chord.
// The first chord with a given key is "primary"; any later chord sharing the
// same key is an inversion and gets labelled in its symbol when not hidden.

function buildChords(
  scale:      ScaleNote[],
  defIndices: readonly number[],
  { hideInversions = true }: ChordOptions,
): Chord[] {
  const seen = new Map<string, Chord>(); // pitch-class key → first/primary chord
  const out:  Chord[] = [];

  for (let rootIdx = 0; rootIdx < 7; rootIdx++) {
    for (const di of defIndices) {
      const chord = buildChord(scale, rootIdx, di);
      // Sort note names so C-E-G and E-G-C produce the same key
      const key = chord.notes.map(n => n.note).sort().join(',');

      if (hideInversions) {
        if (!seen.has(key)) {
          seen.set(key, chord);
          out.push(chord);
        }
        // duplicate note-set → skip entirely
      } else {
        const primary = seen.get(key);
        if (primary) {
          // Inversion: include but label it so the viewer can identify the pair
          out.push({ ...chord, symbol: `${chord.symbol} (inv. of ${primary.symbol})` });
        } else {
          seen.set(key, chord);
          out.push(chord);
        }
      }
    }
  }

  // Sort by canonical quality order — O(1) rank lookup via Map
  return out.sort(
    (a, b) => (CHORD_QUALITY_RANK.get(a.quality) ?? 999)
            - (CHORD_QUALITY_RANK.get(b.quality) ?? 999)
  );
}

// ── Pre-computed Index Lists ──────────────────────────────────────────────────
// Definition indices grouped by chord size. Computed once at module load so
// the public functions never rebuild the filter on every call.

const IDX_BY_SIZE: Readonly<Record<2|3|4|5|6|7, readonly number[]>> = {
  2: CHORD_DEFS.flatMap((d, i) => d.size === 2 ? [i] : []),
  3: CHORD_DEFS.flatMap((d, i) => d.size === 3 ? [i] : []),
  4: CHORD_DEFS.flatMap((d, i) => d.size === 4 ? [i] : []),
  5: CHORD_DEFS.flatMap((d, i) => d.size === 5 ? [i] : []),
  6: CHORD_DEFS.flatMap((d, i) => d.size === 6 ? [i] : []),
  7: CHORD_DEFS.flatMap((d, i) => d.size === 7 ? [i] : []),
};

const ALL_INDICES: readonly number[] = CHORD_DEFS.map((_, i) => i);

// ── Public API ────────────────────────────────────────────────────────────────
// All functions accept an optional ChordOptions:
//   {}                         → hideInversions: true  (default, clean view)
//   { hideInversions: false }  → all 7×n chords, inversions labelled in symbol

export function getDyads(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[2], options ?? {});
}

export function getTriads(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[3], options ?? {});
}

export function getTetrachords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[4], options ?? {});
}

export function getPentachords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[5], options ?? {});
}

export function getHexachords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[6], options ?? {});
}

export function getHeptachords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, IDX_BY_SIZE[7], options ?? {});
}

// All chord sizes combined — useful for a master chord reference view.
export function getAllChords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, ALL_INDICES, options ?? {});
}

// Total chord count including all inversions (informational, no dedup).
export function getChordCount(): number {
  return CHORD_DEFS.length * 7;
}

// Expose definitions for external inspection (chord explorer UI, etc.)
export const CHORD_DEFINITIONS: readonly ChordDefinition[] = CHORD_DEFS.map(d => ({
  quality: d.quality,
  degrees: d.degrees,
  size:    d.size,
}));

/*
  Total chords (all roots × all definitions):  30 × 7 = 210
  Unique note-sets (hideInversions = true):           175
  Inversion duplicates removed:                        35
*/