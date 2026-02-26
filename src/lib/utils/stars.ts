// ── Types ─────────────────────────────────────────────────────────────────────

export interface EclipticRange {
  from: number;
  to:   number;
}

export interface NumericRange {
  min: number;
  max: number;
}

// Angular size stored in arcseconds for uniform comparison across all bodies.
// Use `angularSizeNote` for caveats that cannot be expressed numerically
// (e.g. Saturn's rings, Sun's zodiac positions).
export interface AngularSize extends NumericRange {
  note?: string;
}

// retrogradeDays is 0 (number sentinel) for bodies with no retrograde motion,
// or a structured object for those that do. The template guards with `=== 0`.
export type RetrogradeDays = 0 | { avg: number; min: number; max: number };

export interface ZodiacConstellation {
  name:        string;
  ime:         string;
  symbol:      string;
  eclipticDeg: EclipticRange;
  sunTransit:  string;
}

export interface WanderingStar {
  name:              string;
  ime:               string | null; // null when Old Croatian name is unknown
  symbol:            string;
  angularSize:       AngularSize;   // arcseconds
  speedDegPerDay:    NumericRange;
  siderealDanceDays: number;
  solarDanceDays:    number;        // 0 = not applicable (the Sun itself)
  retrogradeDays:    RetrogradeDays;
}

// ── Zodiac Constellations ─────────────────────────────────────────────────────
// Order is fixed: index 0–11 maps to NEW_NOTES_1_ALL[0–11] in +page.svelte
// and to celestialColors[0–11]. Do not reorder.
//
// Note: a ~18.6° gap exists between Scorpius (ends 247.6°) and Sagittarius
// (starts 266.2°) — Ophiuchus occupies this space astronomically.
// Pisces wraps past 0°: range-checks must handle { from: 351.6, to: 28.7 }.

export const ARIES: ZodiacConstellation = {
  name:        "Aries",
  ime:         "Yance",
  symbol:      "♈",
  eclipticDeg: { from: 28.7, to: 53.4 },
  sunTransit:  "Apr 19 – May 14",
};

export const TAURUS: ZodiacConstellation = {
  name:        "Taurus",
  ime:         "Bakodloak",
  symbol:      "♉",
  eclipticDeg: { from: 53.4, to: 90.1 },
  sunTransit:  "May 14 – Jun 21",
};

export const GEMINI: ZodiacConstellation = {
  name:        "Gemini",
  ime:         "Wardice",
  symbol:      "♊",
  eclipticDeg: { from: 90.1, to: 118.0 },
  sunTransit:  "Jun 21 – Jul 20",
};

export const CANCER: ZodiacConstellation = {
  name:        "Cancer",
  ime:         "Tovarići",
  symbol:      "♋",
  eclipticDeg: { from: 118.0, to: 138.0 },
  sunTransit:  "Jul 20 – Aug 10",
};

export const LEO: ZodiacConstellation = {
  name:        "Leo",
  ime:         "Kosyre",
  symbol:      "♌",
  eclipticDeg: { from: 138.0, to: 173.9 },
  sunTransit:  "Aug 10 – Sep 16",
};

export const VIRGO: ZodiacConstellation = {
  name:        "Virgo",
  ime:         "Divyce",
  symbol:      "♍",
  eclipticDeg: { from: 173.9, to: 217.8 },
  sunTransit:  "Sep 16 – Oct 31",
};

export const LIBRA: ZodiacConstellation = {
  name:        "Libra",
  ime:         "Žmyni",
  symbol:      "♎",
  eclipticDeg: { from: 217.8, to: 241.0 },
  sunTransit:  "Oct 31 – Nov 23",
};

export const SCORPIUS: ZodiacConstellation = {
  name:        "Scorpius",
  ime:         "Škraplune",
  symbol:      "♏",
  eclipticDeg: { from: 241.0, to: 247.6 },
  sunTransit:  "Nov 23 – Nov 30",
};

// Gap: 247.6° → 266.2° (~18.6°) — Ophiuchus occupies this space astronomically
// but is excluded from the traditional twelve-sign zodiac.
export const SAGITTARIUS: ZodiacConstellation = {
  name:        "Sagittarius",
  ime:         "Šunde",
  symbol:      "♐",
  eclipticDeg: { from: 266.2, to: 299.7 },
  sunTransit:  "Dec 18 – Jan 19",
};

export const CAPRICORNUS: ZodiacConstellation = {
  name:        "Capricornus",
  ime:         "Haye",
  symbol:      "♑",
  eclipticDeg: { from: 299.7, to: 327.5 },
  sunTransit:  "Jan 19 – Feb 16",
};

export const AQUARIUS: ZodiacConstellation = {
  name:        "Aquarius",
  ime:         "Baje",
  symbol:      "♒",
  eclipticDeg: { from: 327.5, to: 351.6 },
  sunTransit:  "Feb 16 – Mar 12",
};

export const PISCES: ZodiacConstellation = {
  name:        "Pisces",
  ime:         "Ryboj",
  symbol:      "♓",
  eclipticDeg: { from: 351.6, to: 28.7 }, // wraps past 0° — range checks must account for this
  sunTransit:  "Mar 12 – Apr 19",
};

export const ZODIAC_CONSTELLATIONS = [
  ARIES, TAURUS, GEMINI, CANCER, LEO, VIRGO,
  LIBRA, SCORPIUS, SAGITTARIUS, CAPRICORNUS, AQUARIUS, PISCES,
] as const;

// ── Wandering Stars ───────────────────────────────────────────────────────────
// Order is fixed: index 0–6 maps to NEW_MODES[0–6] and SCALE_DEGREE_KEYS[0–6].
// Do not reorder.

export const MOON: WanderingStar = {
  name:              "Moon",
  ime:               "Myšec",
  symbol:            "☽",
  angularSize:       { min: 1763, max: 2008 }, // 29'23" to 33'28" in arcseconds
  speedDegPerDay:    { min: 12.2, max: 14.8 },
  siderealDanceDays: 27.32,
  solarDanceDays:    29.53,
  retrogradeDays:    0,
};

export const MERCURY: WanderingStar = {
  name:              "Mercury",
  ime:               null, // Old Croatian name unknown
  symbol:            "☿",
  angularSize:       { min: 5, max: 13 },
  speedDegPerDay:    { min: 0.4, max: 2.0 },
  siderealDanceDays: 87.97,
  solarDanceDays:    115.88,
  retrogradeDays:    { avg: 22.6, min: 20, max: 24 },
};

export const VENUS: WanderingStar = {
  name:              "Venus",
  ime:               "Zwicerna",
  symbol:            "♀",
  angularSize:       { min: 10, max: 66 },
  speedDegPerDay:    { min: 0.2, max: 1.2 },
  siderealDanceDays: 224.7,
  solarDanceDays:    583.92,
  retrogradeDays:    { avg: 41.5, min: 40, max: 44 },
};

export const SUN: WanderingStar = {
  name:              "Sun",
  ime:               "Šance",
  symbol:            "☉",
  // Minimum at Cancer (♋, aphelion), maximum at Capricornus (♑, perihelion)
  angularSize:       { min: 1888, max: 1952, note: "min at ♋, max at ♑" }, // 31'28" to 32'32"
  speedDegPerDay:    { min: 0.953, max: 1.017 },
  siderealDanceDays: 365.24,
  solarDanceDays:    0,   // not applicable — synodic period is relative to Earth's orbit
  retrogradeDays:    0,
};

export const MARS: WanderingStar = {
  name:              "Mars",
  ime:               "Rumanica",
  symbol:            "♂",
  angularSize:       { min: 3.5, max: 25 },
  speedDegPerDay:    { min: 0.2, max: 0.8 },
  siderealDanceDays: 686.98,
  solarDanceDays:    779.94,
  retrogradeDays:    { avg: 66.5, min: 54, max: 73 },
};

export const JUPITER: WanderingStar = {
  name:              "Jupiter",
  ime:               "Plavušyca",
  symbol:            "♃",
  angularSize:       { min: 30, max: 59 },
  speedDegPerDay:    { min: 0.05, max: 0.15 },
  siderealDanceDays: 4332.82,
  solarDanceDays:    398.88,
  retrogradeDays:    { avg: 120.4, min: 118, max: 123 },
};

export const SATURN: WanderingStar = {
  name:              "Saturn",
  ime:               "Želenyca",
  symbol:            "♄",
  // Disc only: 14.5"–20.1"; rings extend the apparent size to ~40–45"
  angularSize:       { min: 14.5, max: 20.1, note: "disc only; rings extend to ~40–45\"" },
  speedDegPerDay:    { min: 0.03, max: 0.08 },
  siderealDanceDays: 10755.7,
  solarDanceDays:    378.09,
  retrogradeDays:    { avg: 140.7, min: 135, max: 145 },
};

export const WANDERING_STARS = [
  MOON, MERCURY, VENUS, SUN, MARS, JUPITER, SATURN,
] as const;