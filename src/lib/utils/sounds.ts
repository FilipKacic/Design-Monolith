/* ============================================================================
   Pythagorean Spiral + Chromatic Wrap Scale Engine
   ----------------------------------------------------------------------------
   • Circle-of-fifths generation
   • 18-tone ascending spiral
   • Optional 12-tone chromatic wrapping
   • Mode-based scale construction
   • Frequency lookup (3^n)
   • Octave reduction utilities

   Designed for modern TypeScript / SvelteKit projects.
============================================================================ */


/* ============================================================================
   Notes — Generative Order
============================================================================ */

export const NOTES_1       = ["C","G","D","A","E","B","F#"] as const;
export const NEW_NOTES_1   = ["A","E","B","F","C","G","D"] as const;

export const NOTES_1_SHARP     = ["C#","G#","D#","A#","F"] as const;
export const NEW_NOTES_1_SHARP = ["A#","E#","B#","F#","C#"] as const;

export const NOTES_1_ALL     = [...NOTES_1,     ...NOTES_1_SHARP] as const;
export const NEW_NOTES_1_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP] as const;

export const NOTES_2     = ["Cx","Gx","Dx","Ax","Ex","Bx"] as const;
export const NEW_NOTES_2 = ["Ax","Ex","Bx","Fx","Cx","Gx"] as const;

export const NOTES_ALL     = [...NOTES_1,     ...NOTES_1_SHARP,     ...NOTES_2] as const;
export const NEW_NOTES_ALL = [...NEW_NOTES_1, ...NEW_NOTES_1_SHARP, ...NEW_NOTES_2] as const;


/* ============================================================================
   Frequency Generation — Pythagorean Powers of 3
============================================================================ */

export type NoteFrequency = {
  note: string;
  frequency: number;
};

export const FREQUENCIES = NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i,
})) as readonly NoteFrequency[];

export const NEW_FREQUENCIES = NEW_NOTES_ALL.map((note, i) => ({
  note,
  frequency: 3 ** i,
})) as readonly NoteFrequency[];


/* ============================================================================
   Lookup Maps (O(1))
============================================================================ */

export const FREQUENCY_MAP     = new Map(FREQUENCIES.map(f => [f.note, f.frequency]));
export const NEW_FREQUENCY_MAP = new Map(NEW_FREQUENCIES.map(f => [f.note, f.frequency]));

const NOTE_INDEX_MAP     = new Map(FREQUENCIES.map((f,i)=>[f.note,i]));
const NEW_NOTE_INDEX_MAP = new Map(NEW_FREQUENCIES.map((f,i)=>[f.note,i]));


/* ============================================================================
   Chromatic System Definition
============================================================================ */

export const CHROMATIC_SIZE = 12;


/* ============================================================================
   Modes
============================================================================ */

export const MODES = [
  "Lydian","Mixolydian","Aeolian","Locrian",
  "Ionian","Dorian","Phrygian",
] as const;

export const NEW_MODES = [
  "Lunar","Mercurial","Venusian","Solar",
  "Martial","Jovial","Saturnine",
] as const;

export type Mode    = typeof MODES[number];
export type NewMode = typeof NEW_MODES[number];

const MODE_INDEX     = new Map(MODES.map((m,i)=>[m,i]));
const NEW_MODE_INDEX = new Map(NEW_MODES.map((m,i)=>[m,i]));


/* ============================================================================
   Scale Degrees
============================================================================ */

export const SCALE_DEGREES = {
  Tonic:0,
  Supertonic:1,
  Mediant:2,
  Subdominant:3,
  Dominant:4,
  Submediant:5,
  Subtonic:6,
} as const;

export type ScaleDegree = keyof typeof SCALE_DEGREES;

export const SCALE_DEGREE_KEYS = Object.keys(SCALE_DEGREES) as ScaleDegree[];
export const SCALE_DEGREE_NUMERALS = ["I","II","III","IV","V","VI","VII"] as const;


/* ============================================================================
   Mode Patterns — Circle of Fifths Offsets
============================================================================ */

const MODE_OFFSETS = [0,-2,-4,-6,-1,-3,-5] as const;

const MODE_PATTERNS: ReadonlyArray<{
  mode: Mode;
  pattern: readonly number[];
}> = MODE_OFFSETS.map((offset, i) => ({
  mode: MODES[i],
  pattern: Array.from({ length: 7 }, (_, j) => offset + j),
}));

/* ============================================================================
   Index Wrapping Utilities
============================================================================ */

function mod(n:number, m:number):number {
  return ((n % m) + m) % m;
}

function wrapChromatic(index:number):number {
  return mod(index, CHROMATIC_SIZE);
}

function wrapSpiral(index:number, size:number):number {
  return mod(index, size);
}

/* ============================================================================
   Scale Generation Strategy
============================================================================ */

export type IndexStrategy =
  | "linear"   // strict spiral
  | "wrap12"  // 12-tone chromatic wrap (default)
  | "wrapSpiral"; 


export type ScaleNote = NoteFrequency & {
  degree:number;
  degreeName:ScaleDegree;
  numeral:string;
};


/* ============================================================================
   getScale — Core Engine
============================================================================ */

export function getScale(
  rootNote:string,
  mode:Mode|NewMode,
  sorted=false,
  useNew=false,
  strategy:IndexStrategy="wrapSpiral",
):ScaleNote[] {

const freqArray    = useNew ? NEW_FREQUENCIES : FREQUENCIES;
const noteIndexMap = useNew ? NEW_NOTE_INDEX_MAP : NOTE_INDEX_MAP;

const rootIndex = noteIndexMap.get(rootNote);
if(rootIndex===undefined) throw new Error(`Root note "${rootNote}" not found`);

let modeIndex: number | undefined;

if (useNew) {
  if (!NEW_MODE_INDEX.has(mode as NewMode)) {
    throw new Error(`Mode "${mode}" not found`);
  }
  modeIndex = NEW_MODE_INDEX.get(mode as NewMode);
} else {
  if (!MODE_INDEX.has(mode as Mode)) {
    throw new Error(`Mode "${mode}" not found`);
  }
  modeIndex = MODE_INDEX.get(mode as Mode);
}

if(modeIndex===undefined) throw new Error(`Mode "${mode}" not found`);

const pattern = MODE_PATTERNS[modeIndex].pattern;

const scale:ScaleNote[] = pattern.map((offset,i)=>{

  let idx = rootIndex + offset;

  if (strategy === "linear") {
    if (idx < 0 || idx >= freqArray.length) {
      throw new Error(`Index ${idx} outside spiral range`);
    }
  }
  else if (strategy === "wrap12") {
    idx = wrapChromatic(idx);
  }
  else if (strategy === "wrapSpiral") {
    idx = wrapSpiral(idx, freqArray.length);
  }

  return {
    ...freqArray[idx],
    degree:i+1,
    degreeName:SCALE_DEGREE_KEYS[i],
    numeral:SCALE_DEGREE_NUMERALS[i],
  };
});

  if(!sorted) return scale;

  const sortedScale = [...scale].sort((a,b)=>a.note.localeCompare(b.note));
  const rootPos = sortedScale.findIndex(n=>n.note===rootNote);
  return [...sortedScale.slice(rootPos), ...sortedScale.slice(0,rootPos)];
}


/* ============================================================================
   Frequency Lookup
============================================================================ */

export function getFrequency(note:string,useNew=false){
  return (useNew ? NEW_FREQUENCY_MAP : FREQUENCY_MAP).get(note);
}


/* ============================================================================
   Octave Reduction
============================================================================ */

export function reduceToOctave(f:number,target:number):number{
  if(f<=0 || target<=0) throw new Error("Frequencies must be positive");

  let r=f;
  while(r>=target*2) r/=2;
  while(r<target/2) r*=2;

  return Math.abs(r/2-target) < Math.abs(r-target) ? r/2 : r;
}


/* ============================================================================
   Sonic Pattern — Pythagorean Heptatonic Layout
============================================================================ */

export const SONIC_PATTERN = [0,2,4,6,7,9,11] as const;