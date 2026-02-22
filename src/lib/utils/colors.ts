import { FREQUENCIES } from '$lib/utils/sounds';

// ── White text detection ──────────────────────────────────────────────────────
// Lookup sets are hoisted to module level so they are not recreated on every
// call — needsWhiteText is invoked once per color entry at module load time.

const DARK_ACHROMATIC = new Set([
  '--black', '--pitch-black', '--iron-gray', '--dark-gray', '--gray',
]);

const DARK_CHROMATIC = new Set([
  '--red', '--indigo', '--blue', '--lavender', '--cyclamen', '--mulberry',
]);

const GHOST_CHROMATIC = new Set([
  '--ghost-red', '--ghost-indigo', '--ghost-blue',
  '--ghost-lavender', '--ghost-cyclamen', '--ghost-mulberry',
]);

// Variables matching /-dark-/ in their name (e.g. --dark-red) also need white text.
export function needsWhiteText(variable: string): boolean {
  return (
    DARK_ACHROMATIC.has(variable) ||
    DARK_CHROMATIC.has(variable)  ||
    GHOST_CHROMATIC.has(variable) ||
    /(^|-)dark(-|$)/.test(variable)
  );
}

// ── Color palettes ────────────────────────────────────────────────────────────
// Each entry is augmented with needsWhiteText at definition time so components
// can read it directly without calling the function themselves.

export const COLOR_PALETTES = {
  scale: [
    { name: 'Black',      variable: '--black'      },
    { name: 'Pitch Black', variable: '--pitch-black' },
    { name: 'Iron Gray',  variable: '--iron-gray'  },
    { name: 'Dark Gray',  variable: '--dark-gray'  },
    { name: 'Gray',       variable: '--gray'       },
    { name: 'Light Gray', variable: '--light-gray' },
    { name: 'Silver',     variable: '--silver'     },
    { name: 'Snow White', variable: '--snow-white' },
    { name: 'White',      variable: '--white'      },
  ].map(c => ({ ...c, needsWhiteText: needsWhiteText(c.variable) })),

  wheel: [
    // Grayscale luminance values are noted to explain needsWhiteText decisions.
    { name: 'Red',      variable: '--red'      }, // luma: 76
    { name: 'Mushmula', variable: '--mushmula' }, // luma: 151
    { name: 'Yellow',   variable: '--yellow'   }, // luma: 226
    { name: 'Olive',    variable: '--olive'    }, // luma: 188
    { name: 'Green',    variable: '--green'    }, // luma: 150
    { name: 'Teal',     variable: '--teal'     }, // luma: 164
    { name: 'Azure',    variable: '--azure'    }, // luma: 179
    { name: 'Indigo',   variable: '--indigo'   }, // luma: 104
    { name: 'Blue',     variable: '--blue'     }, // luma: 29
    { name: 'Lavender', variable: '--lavender' }, // luma: 67
    { name: 'Cyclamen', variable: '--cyclamen' }, // luma: 105
    { name: 'Mulberry', variable: '--mulberry' }, // luma: 91
  ].map(c => ({ ...c, needsWhiteText: needsWhiteText(c.variable) })),

  wheel_of_darkness: [
    { name: 'Dark Red',      variable: '--dark-red'      },
    { name: 'Dark Mushmula', variable: '--dark-mushmula' },
    { name: 'Dark Yellow',   variable: '--dark-yellow'   },
    { name: 'Dark Olive',    variable: '--dark-olive'    },
    { name: 'Dark Green',    variable: '--dark-green'    },
    { name: 'Dark Teal',     variable: '--dark-teal'     },
    { name: 'Dark Azure',    variable: '--dark-azure'    },
    { name: 'Dark Indigo',   variable: '--dark-indigo'   },
    { name: 'Dark Blue',     variable: '--dark-blue'     },
    { name: 'Dark Lavender', variable: '--dark-lavender' },
    { name: 'Dark Cyclamen', variable: '--dark-cyclamen' },
    { name: 'Dark Mulberry', variable: '--dark-mulberry' },
  ].map(c => ({ ...c, needsWhiteText: needsWhiteText(c.variable) })),

  wheel_of_ghost: [
    { name: 'Ghost Red',      variable: '--ghost-red'      },
    { name: 'Ghost Mushmula', variable: '--ghost-mushmula' },
    { name: 'Ghost Yellow',   variable: '--ghost-yellow'   },
    { name: 'Ghost Olive',    variable: '--ghost-olive'    },
    { name: 'Ghost Green',    variable: '--ghost-green'    },
    { name: 'Ghost Teal',     variable: '--ghost-teal'     },
    { name: 'Ghost Azure',    variable: '--ghost-azure'    },
    { name: 'Ghost Indigo',   variable: '--ghost-indigo'   },
    { name: 'Ghost Blue',     variable: '--ghost-blue'     },
    { name: 'Ghost Lavender', variable: '--ghost-lavender' },
    { name: 'Ghost Cyclamen', variable: '--ghost-cyclamen' },
    { name: 'Ghost Mulberry', variable: '--ghost-mulberry' },
  ].map(c => ({ ...c, needsWhiteText: needsWhiteText(c.variable) })),

  wheel_of_light: [
    { name: 'Light Red',      variable: '--light-red'      },
    { name: 'Light Mushmula', variable: '--light-mushmula' },
    { name: 'Light Yellow',   variable: '--light-yellow'   },
    { name: 'Light Olive',    variable: '--light-olive'    },
    { name: 'Light Green',    variable: '--light-green'    },
    { name: 'Light Teal',     variable: '--light-teal'     },
    { name: 'Light Azure',    variable: '--light-azure'    },
    { name: 'Light Indigo',   variable: '--light-indigo'   },
    { name: 'Light Blue',     variable: '--light-blue'     },
    { name: 'Light Lavender', variable: '--light-lavender' },
    { name: 'Light Cyclamen', variable: '--light-cyclamen' },
    { name: 'Light Mulberry', variable: '--light-mulberry' },
  ].map(c => ({ ...c, needsWhiteText: needsWhiteText(c.variable) })),
} as const;

// ── Note color mapping ────────────────────────────────────────────────────────
// Maps a Pythagorean frequency value to a wheel_of_light color via its index
// in FREQUENCIES. The modulo 12 wraps higher-octave frequencies back into the
// 12-color wheel — same note name, same color regardless of octave.

export const noteColors: readonly string[] =
  COLOR_PALETTES.wheel_of_light.map(c => `var(${c.variable})`);

const frequencyIndexMap = new Map(
  FREQUENCIES.map((f, i) => [f.frequency, i])
);

export function getNoteColor(frequency: number): string {
  const index = frequencyIndexMap.get(frequency);
  if (index === undefined) return 'var(--white)';
  return noteColors[index % 12];
}