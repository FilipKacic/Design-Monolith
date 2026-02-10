// src/lib/constants/sounds.ts
const pow3 = (n: number) => 3 ** n;

export const NOTES = [
  'C',  // the first note should be called by the first letter in the alphabet, not C
  'C#',
  'D',
  'D#',
  'E',
  'F',  // the twelfth note comes after the fifth note in the circle of fifths
  'F#', // the seventh note should be called by the seventh letter in the alphabet
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const SOUNDS = Object.fromEntries(
  NOTES.map((note, index) => [note, pow3(index)])
) as { readonly [K in typeof NOTES[number]]: number };

export type SoundName = keyof typeof SOUNDS;

export function getSound(index: number): { name: SoundName; value: number } {
  const keys = NOTES;
  const i = ((index % keys.length) + keys.length) % keys.length;
  const name = keys[i];
  const value = SOUNDS[name];
  return { name, value };
}
