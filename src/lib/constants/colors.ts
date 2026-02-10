// src/lib/constants/colors.ts

export const COLORS = {
  // Achromatic
  Black: 'hsl(0, 0%, 0%)',
  DarkGray: 'hsl(0, 0%, 25%)',
  Gray: 'hsl(0, 0%, 50%)',
  LightGray: 'hsl(0, 0%, 75%)',
  White: 'hsl(0, 0%, 100%)',

  // Chromatic
  Mulberry: 'hsl(330, 50%, 50%)',
  Red: 'hsl(0, 50%, 50%)',
  Mushmula: 'hsl(30, 50%, 50%)',
  Yellow: 'hsl(60, 50%, 50%)',
  Olive: 'hsl(90, 50%, 50%)',
  Green: 'hsl(120, 50%, 50%)',
  Teal: 'hsl(150, 50%, 50%)',
  Azure: 'hsl(180, 50%, 50%)',
  Indigo: 'hsl(210, 50%, 50%)',
  Blue: 'hsl(240, 50%, 50%)',
  Lavender: 'hsl(270, 50%, 50%)',
  Cylamen: 'hsl(300, 50%, 50%)',

  // Dark
  DarkMulberry: 'hsl(330, 50%, 25%)',
  DarkRed: 'hsl(0, 50%, 25%)',
  DarkMushmula: 'hsl(30, 50%, 25%)',
  DarkYellow: 'hsl(60, 50%, 25%)',
  DarkOlive: 'hsl(90, 50%, 25%)',
  DarkGreen: 'hsl(120, 50%, 25%)',
  DarkTeal: 'hsl(150, 50%, 25%)',
  DarkAzure: 'hsl(180, 50%, 25%)',
  DarkIndigo: 'hsl(210, 50%, 25%)',
  DarkBlue: 'hsl(240, 50%, 25%)',
  DarkLavender: 'hsl(270, 50%, 25%)',
  DarkCylamen: 'hsl(300, 50%, 25%)',

  // Light
  LightMulberry: 'hsl(330, 50%, 75%)',
  LightRed: 'hsl(0, 50%, 75%)',
  LightMushmula: 'hsl(30, 50%, 75%)',
  LightYellow: 'hsl(60, 50%, 75%)',
  LightOlive: 'hsl(90, 50%, 75%)',
  LightGreen: 'hsl(120, 50%, 75%)',
  LightTeal: 'hsl(150, 50%, 75%)',
  LightAzure: 'hsl(180, 50%, 75%)',
  LightIndigo: 'hsl(210, 50%, 75%)',
  LightBlue: 'hsl(240, 50%, 75%)',
  LightLavender: 'hsl(270, 50%, 75%)',
  LightCylamen: 'hsl(300, 50%, 75%)',
} as const;

export type ColorName = keyof typeof COLORS;

export const COLOR_WHEELS = {
  achromatic: [
    'Black', 'DarkGray', 'Gray', 'LightGray', 'White',
  ],
  chromatic: [
    'Mulberry', 'Red', 'Mushmula', 'Yellow',
    'Olive', 'Green', 'Teal', 'Azure',
    'Indigo', 'Blue', 'Lavender', 'Cylamen',
  ],
  dark: [
    'DarkMulberry', 'DarkRed', 'DarkMushmula', 'DarkYellow',
    'DarkOlive', 'DarkGreen', 'DarkTeal', 'DarkAzure',
    'DarkIndigo', 'DarkBlue', 'DarkLavender', 'DarkCylamen',
  ],
  light: [
    'LightMulberry', 'LightRed', 'LightMushmula', 'LightYellow',
    'LightOlive', 'LightGreen', 'LightTeal', 'LightAzure',
    'LightIndigo', 'LightBlue', 'LightLavender', 'LightCylamen',
  ],
} as const satisfies Record<string, readonly ColorName[]>;

export type WheelName = keyof typeof COLOR_WHEELS;

export function getColor(
  wheel: WheelName,
  index: number
): { name: ColorName; value: string } {
  const keys = COLOR_WHEELS[wheel];
  const i = ((index % keys.length) + keys.length) % keys.length;
  const name = keys[i];
  return {
    name,
    value: COLORS[name],
  };
}
