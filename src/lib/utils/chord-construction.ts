// ── Chord Construction ────────────────────────────────────────────────────────
// This file builds every possible chord that can be formed within a 7-note
// Pythagorean scale. It is the harmonic engine of the whole system.
//
// ── WHAT IS A PYTHAGOREAN SCALE? ─────────────────────────────────────────────
// A Pythagorean scale is built by stacking perfect fifths (frequency ratio 3:2)
// and folding them back into a single octave. The result is 7 notes with a
// specific pattern of gaps when laid out on the 12-semitone chromatic circle:
//
//   SONIC_PATTERN = [0, 2, 4, 6, 7, 9, 11]
//
// These are the semitone positions of the 7 scale degrees. Think of a clock
// face with 12 positions (semitones) — the scale occupies 7 of them.
// The gaps between consecutive positions are always [2,2,2,1,2,2,1],
// a.k.a. the Whole-Whole-Whole-Half-Whole-Whole-Half interval pattern.
//
// This gap pattern is INVARIANT — it never changes regardless of which root
// note or mode you choose. Choosing a different root or mode just rotates
// which pitch names sit at each position, not the shape itself.
//
// ── WHAT IS A CHORD? ─────────────────────────────────────────────────────────
// A chord is a subset of the 7 scale notes played simultaneously, chosen by
// picking specific scale degrees (positions in the scale, numbered 0–6).
// For example, degrees [0,2,4] means: root note, plus the note 2 steps above
// it in the scale, plus the note 4 steps above it — a classic triad.
//
// ── ARCHITECTURE — WHY NO MATH AT CALL TIME? ─────────────────────────────────
// Computing semitone intervals from scratch on every chord lookup would be
// wasteful. Instead, all chord qualities and semitone intervals are computed
// ONCE at module load into a flat LOOKUP array. After that, building any
// chord is just two array reads — zero arithmetic.
//
// The LOOKUP is indexed by:  defIndex * 7 + rootDegree
// Where defIndex   = which chord shape (0–29, one per CHORD_DEFS entry)
//       rootDegree = which of the 7 scale notes is the root (0–6)
//
// ── WHAT IS AN INVERSION? ────────────────────────────────────────────────────
// An inversion occurs when two chords contain exactly the same set of notes
// but have different roots — i.e. a different note is emphasised as the bass.
//
// Classic example: C Sus2 = {C, D, G}  and  G Sus4 = {G, C, D}
// Same three notes, different root. They are inversions of each other.
//
// This system detects inversions by comparing sorted note-name sets.
// The first chord encountered with a given note-set is the "primary".
// All subsequent chords with the same note-set are its inversions.
//
// ── NAMING CONVENTION — INVERSE PAIRS ────────────────────────────────────────
// When two chords are inversions, they are named as a matched pair using
// the interval that characterises each voicing, just like Sus2 ↔ Sus4:
//
//   Sus2    ↔  Sus4      suspended 2nd  vs suspended 4th
//   Quartal ↔  Quintal   stacked 4ths   vs stacked 5ths
//                        (a 4th flipped upside-down becomes a 5th)
//
// Quartal3 [0,3,6] is self-inverse — all its inversions are also Quartal3.
// Quartal4/Quintal4 and Quartal6/Quintal6 share the same naming logic but
// are NOT identical pitch-class sets — they are complementary voicings.
//
// ── CHORD FAMILY GLOSSARY ────────────────────────────────────────────────────
//
//   STANDARD (exist in common music theory textbooks):
//   Major / Minor / Diminished         the three basic triads
//   Major7 / Dominant7 / Minor7 / HalfDiminished7  seventh chords
//   Major9 / Minor9 / Major11 / Minor11 / Major13 / Minor13  extended chords
//   Sus2 / Sus4    suspended triads (replace 3rd with 2nd or 4th)
//   Add9 / Add11 / Add13   add an extension WITHOUT including the 7th
//
//   SEMI-STANDARD (real concepts, non-standard labels used here):
//   Int__    two-note intervals (dyads). Not chords in the classical sense but
//            included for completeness. Int5 = power chord. The number is the
//            upper scale degree offset (not a semitone count).
//   Shell3   "shell voicing" — a real jazz term. Root + 3rd + 7th, 5th omitted.
//            The 3rd defines major/minor quality; the 7th adds colour.
//   Quartal_ "quartal harmony" — a real 20th-century technique (Hindemith,
//            McCoy Tyner, Herbie Hancock). Notes stacked in 4ths, not 3rds.
//            Number suffix = total note count: Quartal3 Quartal4 Quartal5 Quartal6 Quartal7.
//            Quartal7 is the complete scale voiced in ascending 4ths — the apex of the family.
//   Quintal_ the inverse of Quartal. Stacked 5ths. A 4th flipped over the
//            octave becomes a 5th, so they naturally pair.
//            Number suffix = total note count: Quintal4 Quintal5 Quintal6 Quintal7.
//            Quintal7 mirrors the Pythagorean generative spiral (built by stacking 5ths).
//   Cluster_ "cluster chord" — a real term (Henry Cowell, Bartók). Notes packed
//            densely in adjacent scale degrees. Tense, dissonant, chromatic feel.
//            Number suffix = total note count.
//
//   INVENTED FOR THIS SYSTEM (no standard precedent):
//   Lim      short for "Liminal". 5 notes [0,1,2,4,5]. Suspended between the
//            pentatonic (5-note) and heptatonic (7-note) worlds, belonging to
//            neither. "Liminal" (Latin: limen = threshold) names this in-between state.
//
// ∅ = no widely accepted standard name in common practice

import { type ScaleNote, SONIC_PATTERN } from '$lib/utils/sounds';

// ── Error ─────────────────────────────────────────────────────────────────────
// A dedicated error class lets callers distinguish chord-construction failures
// from unrelated runtime errors using `instanceof ChordError`.

export class ChordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChordError';
  }
}

// ── Gap Table ─────────────────────────────────────────────────────────────────
// GAPS stores the semitone distance between each pair of consecutive scale
// degrees, derived from SONIC_PATTERN. It is circular — degree 6 wraps back
// to degree 0 across the octave boundary.
//
// Derivation from SONIC_PATTERN = [0,2,4,6,7,9,11]:
//   gap[0] = 2-0  = 2   (degree 0 → degree 1)
//   gap[1] = 4-2  = 2   (degree 1 → degree 2)
//   gap[2] = 6-4  = 2   (degree 2 → degree 3)
//   gap[3] = 7-6  = 1   (degree 3 → degree 4)
//   gap[4] = 9-7  = 2   (degree 4 → degree 5)
//   gap[5] = 11-9 = 2   (degree 5 → degree 6)
//   gap[6] = 12-11+0=1  (degree 6 → degree 0, wrapping over the octave)
//
// Result: GAPS = [2, 2, 2, 1, 2, 2, 1]
// To traverse the scale circularly: GAPS[(degree + step) % 7]

const GAPS: readonly number[] = (() => {
  const gaps: number[] = [];
  for (let i = 1; i < SONIC_PATTERN.length; i++)
    gaps.push(SONIC_PATTERN[i] - SONIC_PATTERN[i - 1]);
  // The last gap wraps across the octave: distance from the 7th degree (11)
  // back to the 1st degree (0), travelling through the octave boundary (12).
  gaps.push(12 - SONIC_PATTERN[SONIC_PATTERN.length - 1] + SONIC_PATTERN[0]);
  return gaps;
})();

// Returns the total semitone distance from scale degree `from` when stepping
// `steps` degrees upward through the scale (wrapping circularly via modulo).
//
// Example: semitonesFrom(0, 4) = GAPS[0]+GAPS[1]+GAPS[2]+GAPS[3] = 2+2+2+1 = 7
// Translation: from degree 0, 4 steps up = 7 semitones = a perfect 5th (P5).
//
// Example: semitonesFrom(3, 3) = GAPS[3]+GAPS[4]+GAPS[5] = 1+2+2 = 5
// Translation: from degree 3, 3 steps up = 5 semitones = a perfect 4th (P4).

function semitonesFrom(from: number, steps: number): number {
  let s = 0;
  for (let i = 0; i < steps; i++) s += GAPS[(from + i) % 7];
  return s;
}

// ── Chord Quality Type ────────────────────────────────────────────────────────
// The complete set of chord qualities in this system.
// The degree offset array in brackets (e.g. [0,2,4]) shows which scale degrees
// form the chord — 0 is always the root. "Resolves per root" means the exact
// quality is determined by semitone arithmetic, not fixed in the definition.

export type ChordQuality =
  // ── Dyads — 2-note intervals ──────────────────────────────────────────────
  // "Int" = interval. Two notes only — not a chord in the classical sense but
  // included for completeness. The number = the upper scale degree offset.
  // Int5 (degree offset 4 = P5) is the power chord of rock music.
  // All dyad qualities are fixed — they do not resolve per root.
  | 'Int2'             // [0,1]  major or minor 2nd depending on root       ∅
  | 'Int3'             // [0,2]  major or minor 3rd depending on root       ∅
  | 'Int5'             // [0,4]  perfect 5th (tritone on degree 4 only)
  | 'Int6'             // [0,5]  major or minor 6th depending on root       ∅
  | 'Int7'             // [0,6]  major or minor 7th depending on root       ∅

  // ── Tertian triads — 3-note chords built in 3rds ──────────────────────────
  // "Tertian" = built from stacked 3rds (every other scale degree).
  // This has been the foundation of Western harmony for 500+ years.
  // All three qualities are outcomes of the same degree pattern [0,2,4];
  // which one appears depends on the semitone intervals at that root degree.
  | 'Major'            // [0,2,4]  major 3rd (4st) + perfect 5th (7st)
  | 'Minor'            // [0,2,4]  minor 3rd (3st) + perfect 5th (7st)
  | 'Diminished'       // [0,2,4]  minor 3rd (3st) + tritone (6st) — degree IV only

  // ── Suspended triads — 3-note, 3rd replaced by 2nd or 4th ────────────────
  // "Suspended" = the 3rd is removed and replaced by an adjacent interval.
  // This leaves the chord tonally ambiguous — unresolved, "suspended in air".
  // Sus2 and Sus4 are inversions of each other:
  //   C Sus2 = {C,D,G}  ↔  G Sus4 = {G,C,D} — same notes, different root.
  | 'Sus2'             // [0,1,4]  2nd + 5th    inverse: Sus4
  | 'Sus4'             // [0,3,4]  4th + 5th    inverse: Sus2

  // ── Non-tertian triads — 3-note, not built in 3rds ───────────────────────
  // Shell3: jazz "shell voicing" — root + 3rd + 7th, 5th deliberately omitted.
  //   The 3rd defines major/minor; the 7th adds colour. Open, airy sound.
  // Quartal3: three notes each a 4th apart, pattern [0,3,6].
  //   Self-inverse — every inversion of a Quartal3 is also a Quartal3.
  // Cluster3: three adjacent scale degrees [0,1,2] — densest, most dissonant.
  | 'Shell3'           // [0,2,6]  root + 3rd + 7th, no 5th                 ∅
  | 'Quartal3'         // [0,3,6]  stacked 4ths, 3 notes — self-inverse      ∅
  | 'Cluster3'         // [0,1,2]  3 adjacent degrees, maximum density       ∅

  // ── Seventh chords — 4-note tertian [0,2,4,6] ────────────────────────────
  // A triad with one more 3rd stacked on top — the 7th interval above root.
  // The four outcomes cover every possibility in this scale:
  //   Major7:          M3 + P5 + M7  — bright, stable (degrees I, V)
  //   Dominant7:       M3 + P5 + m7  — tense, wants to move (degree II)
  //   Minor7:          m3 + P5 + m7  — dark, floating (degrees III, VI, VII)
  //   HalfDiminished7: m3 + Tt + m7 — most unstable (degree IV only)
  | 'Major7'           // resolves per root — see above
  | 'Dominant7'        // resolves per root — see above
  | 'Minor7'           // resolves per root — see above
  | 'HalfDiminished7'  // resolves per root — see above

  // ── Added-note tetrads — 4-note, extra note without the 7th ──────────────
  // "Add" chords are triads with one extension note added directly —
  // without first including the 7th (that would make it a 9th/11th/13th chord).
  // Add9 ↔ Add11 are inversions of each other.
  // Add13 has a unique note-set with no inversion pair in this scale.
  | 'Add9'             // [0,1,2,4]  triad + 2nd above root    inverse: Add11  ∅
  | 'Add11'            // [0,2,3,4]  triad + 4th above root    inverse: Add9
  | 'Add13'            // [0,2,4,5]  triad + 6th above root    unique shape

  // ── Non-tertian tetrads — 4-note, not built in 3rds ──────────────────────
  // Quartal4 ↔ Quintal4: a 4th-based and 5th-based voicing.
  //   These are NOT identical pitch-class sets (unlike Quartal5/Quintal5)
  //   but follow the same 4th/5th naming convention as a complementary pair.
  // Cluster4: four adjacent degrees [0,1,2,3] — extremely dense.
  | 'Quartal4'         // [0,2,3,6]  4th-based 4-note chord    ∅ inverse: Quintal4
  | 'Quintal4'         // [0,2,5,6]  5th-based 4-note chord    ∅ inverse: Quartal4
  | 'Cluster4'         // [0,1,2,3]  4 adjacent degrees        ∅

  // ── Ninth chords — 5-note tertian [0,1,2,4,6] ────────────────────────────
  // A 9th chord = 7th chord + the note a 9th above the root (= 2nd + an octave).
  // The "9" names the highest interval, not the note count.
  // Major9 vs Minor9 is determined by whether the 3rd at step 2 is M3 or m3.
  | 'Major9'           // [0,1,2,4,6]  M3 at step 2  (degrees I, II, V)
  | 'Minor9'           // [0,1,2,4,6]  m3 at step 2  (degrees III, IV, VI, VII)

  // ── Non-tertian pentads — 5-note, not built in 3rds ──────────────────────
  // Lim (Liminal): [0,1,2,4,5] — 5 notes at the threshold between pentatonic
  //   and heptatonic worlds. Suspended, ambiguous, neither here nor there.
  //   "Liminal" (Latin: limen = threshold) names this in-between state.
  // Quartal5 ↔ Quintal5: TRUE inversions — verified same pitch-class set.
  //   Quartal5 sorted semitones = Quintal5 sorted semitones. ✓
  // Cluster5: five adjacent degrees [0,1,2,3,4] — one note from the full scale.
  | 'Lim'              // [0,1,2,4,5]  liminal pentad — threshold quality    ∅
  | 'Quartal5'         // [0,3,6,2,5]  stacked 4ths, 5 notes  ∅ inverse: Quintal5
  | 'Quintal5'         // [0,2,3,5,6]  stacked 5ths, 5 notes  ∅ inverse: Quartal5
  | 'Cluster5'         // [0,1,2,3,4]  5 adjacent degrees      ∅

  // ── Eleventh chords — 6-note tertian [0,1,2,3,4,6] ──────────────────────
  // An 11th chord = 9th chord + note an 11th above root (= 4th + an octave).
  // Major11 vs Minor11 determined by the 3rd at step 2.
  | 'Major11'          // [0,1,2,3,4,6]  M3 at step 2  (degrees I, II, V)
  | 'Minor11'          // [0,1,2,3,4,6]  m3 at step 2  (degrees III, IV, VI, VII)

  // ── Non-tertian hexads — 6-note, not built in 3rds ───────────────────────
  // Quartal6 ↔ Quintal6: 6-note quartal/quintal voicings.
  //   Like Quartal4/Quintal4, complementary voicings (not identical note-sets)
  //   following the same 4th/5th naming convention.
  // Cluster6: six adjacent degrees — only one note away from the full scale.
  | 'Quartal6'         // [0,1,2,3,5,6]  4th-based 6-note chord  ∅ inverse: Quintal6
  | 'Quintal6'         // [0,1,3,4,5,6]  5th-based 6-note chord  ∅ inverse: Quartal6
  | 'Cluster6'         // [0,1,2,3,4,5]  6 adjacent degrees       ∅

  // ── Thirteenth chords — 7-note tertian [0,1,2,3,4,5,6] ──────────────────
  // A 13th chord uses all 7 scale notes voiced in ascending 3rds — the complete
  // tertian stack. The "13th" is the 6th degree an octave higher.
  // Major13 vs Minor13 determined by the 3rd at step 2.
  | 'Major13'          // [0,1,2,3,4,5,6]  M3 at step 2  (degrees I, II, V)
  | 'Minor13'          // [0,1,2,3,4,5,6]  m3 at step 2  (degrees III, IV, VI, VII)

  // ── Quartal7 / Quintal7 — 7-note apex of the Quartal/Quintal families ─────
  // The natural completion of the Quartal and Quintal families — all 7 scale
  // notes voiced by stacking a single interval type rather than by degree order.
  //
  // Quartal7: degrees [0,3,6,2,5,1,4] — every step is a 4th.
  //   Cycles through all 7 degrees via the circle of 4ths.
  //   Maximally open and tonally ambiguous — no note feels like a clear root.
  //
  // Quintal7: degrees [0,4,1,5,2,6,3] — every step is a 5th.
  //   The exact inverse of Quartal7. Mirrors the Pythagorean generative spiral
  //   (the whole scale was built by stacking 5ths in the first place).
  //   The most structurally "native" full voicing of a Pythagorean scale.
  | 'Quartal7'         // [0,3,6,2,5,1,4]  all 7 notes in ascending 4ths   ∅
  | 'Quintal7';        // [0,4,1,5,2,6,3]  all 7 notes in ascending 5ths   ∅

// ── Interval Name Map ─────────────────────────────────────────────────────────
// Maps a semitone count (0–11) to its standard interval abbreviation.
// P = Perfect, M = Major, m = minor, Tt = Tritone (aug. 4th / dim. 5th).
// Used to populate the human-readable `intervals` array on each Chord object.

const INTERVAL_NAME = new Map<number, string>([
  [0, 'U' ], [1, 'm2'], [2,  'M2'], [3, 'm3'], [4, 'M3'],
  [5, 'P4'], [6, 'Tt'], [7,  'P5'], [8, 'm6'], [9, 'M6'],
  [10,'m7'], [11,'M7'],
]);

// ── Quality Symbol Map ────────────────────────────────────────────────────────
// Maps each ChordQuality to a short suffix appended to the root note name
// to form the chord symbol shown in the UI.
// Major has an empty suffix — "C" alone means C major by convention.
// Example: root="C", quality="Major7" → symbol = "C" + "maj7" = "Cmaj7"

const QUALITY_SYMBOL: Readonly<Record<ChordQuality, string>> = {
  Int2:'2',  Int3:'3',  Int5:'5',  Int6:'6',  Int7:'7',
  Major:'',  Minor:'m', Diminished:'dim',
  Sus2:'sus2', Sus4:'sus4',
  Shell3:'sh', Quartal3:'qrt', Cluster3:'cls',
  Major7:'maj7', Dominant7:'7', Minor7:'m7', HalfDiminished7:'ø7',
  Add9:'add9', Add11:'add11', Add13:'add13',
  Quartal4:'qrt4', Quintal4:'qnt4', Cluster4:'cls4',
  Major9:'maj9', Minor9:'m9',
  Lim:'lim', Quartal5:'qrt5', Quintal5:'qnt5', Cluster5:'cls5',
  Major11:'maj11', Minor11:'m11',
  Quartal6:'qrt6', Quintal6:'qnt6', Cluster6:'cls6',
  Major13:'maj13', Minor13:'m13',
  Quartal7:'qrt7', Quintal7:'qnt7',
};

// ── Chord Definition Interface ────────────────────────────────────────────────
// A ChordDef is the static blueprint for one chord shape. It does not depend
// on which scale is active — it only describes the structure.
//
//   quality  the family name. For non-tertian chords this is the final quality.
//            For tertian chords it acts as a resolver key for resolveQuality().
//   degrees  scale degree offsets from the root. Always starts with 0 (root).
//            e.g. [0,2,4] = root + 2 steps up + 4 steps up.
//   size     total note count. Stored explicitly to avoid recomputing .length.

interface ChordDef {
  readonly quality:  ChordQuality;
  readonly degrees:  readonly number[];
  readonly size:     2 | 3 | 4 | 5 | 6 | 7;
}

// ── Chord Definitions ─────────────────────────────────────────────────────────
// The 30 structural templates defining every chord shape in this system.
// These are degree OFFSETS from the root — they do not change with root or mode.
// The actual notes are resolved at build time by mapping offsets into the scale.
//
// Tertian family entries (Major, Major7, Major9, Major11, Major13) list their
// "family entry" quality as the resolver key — resolveQuality() refines per root.

const CHORD_DEFS: readonly ChordDef[] = [
  // ── Dyads (2-note) ─────────────────────────────────────────────────────────
  { quality:'Int5',     degrees:[0,4],             size:2 }, // P5 / tritone
  { quality:'Int3',     degrees:[0,2],             size:2 }, // 3rd
  { quality:'Int2',     degrees:[0,1],             size:2 }, // 2nd
  { quality:'Int6',     degrees:[0,5],             size:2 }, // 6th
  { quality:'Int7',     degrees:[0,6],             size:2 }, // 7th

  // ── Triads (3-note) ─────────────────────────────────────────────────────────
  { quality:'Major',    degrees:[0,2,4],           size:3 }, // resolves: Major / Minor / Diminished
  { quality:'Sus2',     degrees:[0,1,4],           size:3 }, // inverse: Sus4
  { quality:'Sus4',     degrees:[0,3,4],           size:3 }, // inverse: Sus2
  { quality:'Shell3',   degrees:[0,2,6],           size:3 }, // root + 3rd + 7th, no 5th
  { quality:'Quartal3', degrees:[0,3,6],           size:3 }, // stacked 4ths, self-inverse
  { quality:'Cluster3', degrees:[0,1,2],           size:3 }, // densest 3-note shape

  // ── Tetrads (4-note) ────────────────────────────────────────────────────────
  { quality:'Major7',   degrees:[0,2,4,6],         size:4 }, // resolves: Major7 / Dominant7 / Minor7 / HalfDim7
  { quality:'Add9',     degrees:[0,1,2,4],         size:4 }, // triad + 2nd — inverse: Add11
  { quality:'Add11',    degrees:[0,2,3,4],         size:4 }, // triad + 4th — inverse: Add9
  { quality:'Add13',    degrees:[0,2,4,5],         size:4 }, // triad + 6th — unique shape
  { quality:'Quartal4', degrees:[0,2,3,6],         size:4 }, // 4th-based voicing — inverse: Quintal4
  { quality:'Quintal4', degrees:[0,2,5,6],         size:4 }, // 5th-based voicing — inverse: Quartal4
  { quality:'Cluster4', degrees:[0,1,2,3],         size:4 }, // densest 4-note shape

  // ── Pentads (5-note) ────────────────────────────────────────────────────────
  { quality:'Major9',   degrees:[0,1,2,4,6],       size:5 }, // resolves: Major9 / Minor9
  { quality:'Lim',      degrees:[0,1,2,4,5],       size:5 }, // liminal — threshold pentad
  { quality:'Quartal5', degrees:[0,3,6,2,5],       size:5 }, // stacked 4ths — inverse: Quintal5
  { quality:'Quintal5', degrees:[0,2,3,5,6],       size:5 }, // stacked 5ths — inverse: Quartal5
  { quality:'Cluster5', degrees:[0,1,2,3,4],       size:5 }, // densest 5-note shape

  // ── Hexads (6-note) ─────────────────────────────────────────────────────────
  { quality:'Major11',  degrees:[0,1,2,3,4,6],     size:6 }, // resolves: Major11 / Minor11
  { quality:'Quartal6', degrees:[0,1,2,3,5,6],     size:6 }, // 4th-based voicing — inverse: Quintal6
  { quality:'Quintal6', degrees:[0,1,3,4,5,6],     size:6 }, // 5th-based voicing — inverse: Quartal6
  { quality:'Cluster6', degrees:[0,1,2,3,4,5],     size:6 }, // densest 6-note shape

  // ── Heptads (7-note) ────────────────────────────────────────────────────────
  { quality:'Major13',  degrees:[0,1,2,3,4,5,6],   size:7 }, // resolves: Major13 / Minor13
  { quality:'Quartal7',    degrees:[0,3,6,2,5,1,4],   size:7 }, // full scale voiced in 4ths
  { quality:'Quintal7',    degrees:[0,4,1,5,2,6,3],   size:7 }, // full scale voiced in 5ths
];

// ── Quality Resolution ────────────────────────────────────────────────────────
// For tertian chord families, the specific quality (e.g. Major vs Minor vs
// Diminished) is determined by the actual semitone intervals at a given root
// degree — the chord template alone is not enough to know.
//
// Non-tertian chords are their own fixed identity and always hit `default`.
//
// `ints` is the cumulative semitone array from the root:
//   ints[0] = 0 always (root to itself)
//   ints[1] = semitones to the 2nd chord note
//   ints[2] = semitones to the 3rd chord note
//   ints[3] = semitones to the 4th chord note (for seventh chords)

function resolveQuality(defQuality: ChordQuality, ints: readonly number[]): ChordQuality {
  switch (defQuality) {

    // Tertian triad [0,2,4]:
    //   ints[1] = 3rd interval: 4 = major (M3),  3 = minor (m3)
    //   ints[2] = 5th interval: 7 = perfect (P5), 6 = tritone (Tt / diminished 5th)
    case 'Major':
    case 'Minor':
    case 'Diminished': {
      const [, third, fifth] = ints;
      if (third === 4 && fifth === 7) return 'Major';
      if (third === 3 && fifth === 7) return 'Minor';
      if (third === 3 && fifth === 6) return 'Diminished';
      throw new ChordError(`Unexpected triad intervals: third=${third}st, fifth=${fifth}st`);
    }

    // Seventh chord [0,2,4,6]:
    //   ints[1]=3rd, ints[2]=5th, ints[3]=7th: 11=major 7th (M7), 10=minor 7th (m7)
    case 'Major7':
    case 'Dominant7':
    case 'Minor7':
    case 'HalfDiminished7': {
      const [, third, fifth, seventh] = ints;
      if (third === 4 && fifth === 7 && seventh === 11) return 'Major7';
      if (third === 4 && fifth === 7 && seventh === 10) return 'Dominant7';
      if (third === 3 && fifth === 7 && seventh === 10) return 'Minor7';
      if (third === 3 && fifth === 6 && seventh === 10) return 'HalfDiminished7';
      throw new ChordError(`Unexpected 7th chord intervals: third=${third}st, fifth=${fifth}st, seventh=${seventh}st`);
    }

    // Extended chords — 9th, 11th, 13th:
    // All three families use the same test. The degree patterns for Major9,
    // Major11, and Major13 all place the 3rd at ints[2] (the 3rd array element).
    // ints[2] = 4 means a major 3rd (M3) → Major family.
    // ints[2] = 3 means a minor 3rd (m3) → Minor family.
    case 'Major9':  case 'Minor9':  return ints[2] === 4 ? 'Major9'  : 'Minor9';
    case 'Major11': case 'Minor11': return ints[2] === 4 ? 'Major11' : 'Minor11';
    case 'Major13': case 'Minor13': return ints[2] === 4 ? 'Major13' : 'Minor13';

    // Non-tertian chords are fixed identities — quality never changes with root.
    default: return defQuality;
  }
}

// ── Pre-computed Lookup Table ─────────────────────────────────────────────────
// LOOKUP is a flat array of 210 entries (30 defs × 7 roots), built ONCE at
// module load. After this, buildChord() performs zero arithmetic — it only
// reads from this array.
//
// Why flat instead of nested?
//   Flat arrays have better CPU cache locality. Sequential memory reads are
//   faster than pointer chasing through nested arrays.
//
// Index formula:  defIndex * 7 + rootDeg
//   defIndex ∈ [0..29] — which of the 30 chord templates (CHORD_DEFS index)
//   rootDeg  ∈ [0..6]  — which of the 7 scale degrees is the root
//
// Example: CHORD_DEFS[5] = Major triad, rootDeg=0 → LOOKUP[5*7+0] = Major
//          CHORD_DEFS[5] = Major triad, rootDeg=3 → LOOKUP[5*7+3] = Minor (or Dim)

interface LookupEntry {
  readonly quality:   ChordQuality;      // resolved quality for this def+root pair
  readonly intervals: readonly string[]; // interval names, e.g. ['U','M3','P5']
}

const LOOKUP: readonly LookupEntry[] = CHORD_DEFS.flatMap((def) =>
  Array.from({ length: 7 }, (_, rootDeg) => {
    // Raw semitone distances from this root to each chord note
    const ints      = def.degrees.map(step => semitonesFrom(rootDeg, step));
    // Resolve the exact quality based on those intervals
    const quality   = resolveQuality(def.quality, ints);
    // Map each semitone count to its name; fallback to "${n}st" for unknowns
    const intervals = ints.map(s => INTERVAL_NAME.get(s) ?? `${s}st`);
    return { quality, intervals };
  })
);

// ── Public Interfaces ─────────────────────────────────────────────────────────

// ChordDefinition is the simplified, public-facing version of ChordDef.
// Exported for external inspection — chord explorer UI, essay tables, tests.
export interface ChordDefinition {
  readonly quality:  ChordQuality;
  readonly degrees:  readonly number[];
  readonly size:     2 | 3 | 4 | 5 | 6 | 7;
}

// Chord is a fully resolved chord instance for a specific root in a specific scale.
// All fields are readonly — chords are immutable value objects.
export interface Chord {
  readonly root:      ScaleNote;             // the root note of this chord
  readonly quality:   ChordQuality;          // resolved quality, e.g. 'Minor7'
  readonly symbol:    string;                // display label, e.g. "Cmaj7" or "Gm (inv. of Cmaj7)"
  readonly notes:     readonly ScaleNote[];  // the actual scale notes in chord order
  readonly degrees:   readonly number[];     // resolved scale indices, e.g. [0,2,4]
  readonly intervals: readonly string[];     // interval names from root, e.g. ['U','m3','P5']
}

// ChordOptions controls which chords buildChords returns.
// Omit entirely or pass {} to get the default clean view.
export interface ChordOptions {
  // true  (default) — each unique note-set appears exactly once.
  //                   Inversion duplicates are silently dropped.
  // false           — all 7×n chords are included.
  //                   Inversions are labelled in their symbol field.
  hideInversions?: boolean;
}

// ── Chord Quality Sort Order ──────────────────────────────────────────────────
// Defines the canonical display order used in the UI:
//   dyads → triads → tetrads → pentads → hexads → heptads
//   within each size: tertian families listed before non-tertian
//
// CHORD_QUALITY_RANK converts this into an O(1) Map lookup for the sort
// comparator, avoiding an O(n) indexOf call on every comparison.

const CHORD_QUALITY_ORDER: readonly ChordQuality[] = [
  // Dyads
  'Int2','Int3','Int5','Int6','Int7',
  // Triads — tertian first, then suspended, then non-tertian
  'Major','Minor','Diminished',
  'Sus2','Sus4',
  'Shell3','Quartal3','Cluster3',
  // Tetrads
  'Major7','Dominant7','Minor7','HalfDiminished7',
  'Add9','Add11','Add13',
  'Quartal4','Quintal4','Cluster4',
  // Pentads
  'Major9','Minor9',
  'Lim','Quartal5','Quintal5','Cluster5',
  // Hexads
  'Major11','Minor11',
  'Quartal6','Quintal6','Cluster6',
  // Heptads
  'Major13','Minor13',
  'Quartal7','Quintal7',
];

const CHORD_QUALITY_RANK: ReadonlyMap<ChordQuality, number> = new Map(
  CHORD_QUALITY_ORDER.map((q, i) => [q, i])
);

// ── Core Chord Builder ────────────────────────────────────────────────────────
// Assembles one Chord object for a given root index and definition index.
// All heavy lifting is done in LOOKUP — this function is pure array access.

function buildChord(scale: ScaleNote[], rootIdx: number, defIdx: number): Chord {
  const def                    = CHORD_DEFS[defIdx];
  const { quality, intervals } = LOOKUP[defIdx * 7 + rootIdx];

  return {
    root:      scale[rootIdx],
    quality,
    // QUALITY_SYMBOL[quality] is '' for Major, 'm' for Minor, 'maj7' for Major7, etc.
    symbol:    `${scale[rootIdx].note}${QUALITY_SYMBOL[quality]}`,
    // (rootIdx + o) % 7 wraps degree offsets around the 7-note circular scale
    notes:     def.degrees.map(o => scale[(rootIdx + o) % 7]),
    degrees:   def.degrees.map(o => (rootIdx + o) % 7),
    intervals,
  };
}

// ── Scale Validation ──────────────────────────────────────────────────────────
// Guards every public API entry point. Throws a descriptive ChordError rather
// than letting the code silently produce wrong results from bad input.
// Called before buildChords so errors surface at the right call site.

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
// The single internal function all public API functions delegate to.
// Iterates every (root 0–6) × (chord definition in defIndices) combination,
// builds each chord, handles inversion detection, then sorts by quality rank.
//
// HOW INVERSION DETECTION WORKS:
//   Each chord's note set is converted to a canonical string key by sorting
//   the note names alphabetically and joining with commas. This means C-E-G
//   and E-G-C both produce the key "C,E,G" — same pitch-class set.
//   The first chord to claim a key is the "primary". Any later chord with the
//   same key is an inversion of that primary.
//
//   hideInversions=true:  inversions are silently dropped → clean unique view
//   hideInversions=false: inversions are included, labelled in symbol field

function buildChords(
  scale:      ScaleNote[],
  defIndices: readonly number[],
  { hideInversions = true }: ChordOptions,
): Chord[] {
  // Maps sorted-note-name key → the first (primary) chord with that note-set
  const seen = new Map<string, Chord>();
  const out:  Chord[] = [];

  for (let rootIdx = 0; rootIdx < 7; rootIdx++) {
    for (const di of defIndices) {
      const chord = buildChord(scale, rootIdx, di);

      // Canonical key: sort alphabetically so C-E-G and E-G-C give "C,E,G"
      const key = chord.notes.map(n => n.note).sort().join(',');

      if (hideInversions) {
        if (!seen.has(key)) {
          seen.set(key, chord);
          out.push(chord);
        }
        // seen already has this key → inversion → skip silently

      } else {
        const primary = seen.get(key);
        if (primary) {
          // Include but label it so the viewer can trace it to its primary
          out.push({ ...chord, symbol: `${chord.symbol} (inv. of ${primary.symbol})` });
        } else {
          seen.set(key, chord);
          out.push(chord);
        }
      }
    }
  }

  // Sort by canonical quality order using O(1) rank Map lookup.
  // Chords not in CHORD_QUALITY_RANK (should never happen) sort to the end.
  return out.sort(
    (a, b) => (CHORD_QUALITY_RANK.get(a.quality) ?? 999)
            - (CHORD_QUALITY_RANK.get(b.quality) ?? 999)
  );
}

// ── Pre-computed Index Lists ──────────────────────────────────────────────────
// CHORD_DEFS indices grouped by chord size, computed once at module load.
// This lets each public function pass the right subset to buildChords without
// re-filtering the array on every call.

const IDX_BY_SIZE: Readonly<Record<2|3|4|5|6|7, readonly number[]>> = {
  2: CHORD_DEFS.flatMap((d, i) => d.size === 2 ? [i] : []),
  3: CHORD_DEFS.flatMap((d, i) => d.size === 3 ? [i] : []),
  4: CHORD_DEFS.flatMap((d, i) => d.size === 4 ? [i] : []),
  5: CHORD_DEFS.flatMap((d, i) => d.size === 5 ? [i] : []),
  6: CHORD_DEFS.flatMap((d, i) => d.size === 6 ? [i] : []),
  7: CHORD_DEFS.flatMap((d, i) => d.size === 7 ? [i] : []),
};

// All 30 definition indices in order — used by getAllChords for a full view
const ALL_INDICES: readonly number[] = CHORD_DEFS.map((_, i) => i);

// ── Public API ────────────────────────────────────────────────────────────────
// Each function validates the scale, selects the right size group, and delegates
// to buildChords. All accept an optional ChordOptions:
//   omitted / {}               → hideInversions: true  (clean unique-set view)
//   { hideInversions: false }  → full set with inversions labelled in symbol

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

// All sizes in one call — useful for a master chord reference or search view.
export function getAllChords(scale: ScaleNote[], options?: ChordOptions): Chord[] {
  validateScale(scale);
  return buildChords(scale, ALL_INDICES, options ?? {});
}

// Theoretical maximum chord count — all roots × all definitions, before dedup.
// Useful for progress indicators, stats panels, or sanity checks in tests.
export function getChordCount(): number {
  return CHORD_DEFS.length * 7;
}

// Structural templates exposed for external inspection —
// chord explorer UI, essay synthesis tables, automated testing, etc.
export const CHORD_DEFINITIONS: readonly ChordDefinition[] = CHORD_DEFS.map(d => ({
  quality: d.quality,
  degrees: d.degrees,
  size:    d.size,
}));

/*
  ── Counts ────────────────────────────────────────────────────────────────────
  Total chord templates:                         30
  Total chords (all roots × all definitions):    30 × 7 = 210
  Unique note-sets (hideInversions = true):              175
  Inversion duplicates removed:                           35
*/