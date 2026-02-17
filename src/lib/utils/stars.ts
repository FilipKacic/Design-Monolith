export const ARIES = {
  name: "Aries",
  ime: "Yance",
  symbol: "♈",
  eclipticDeg: { from: 28.7, to: 53.4 },
  sunTransit: "Apr 19 – May 14",
  brightestStars: ["Hamal", "Sheratan", "Mesarthim", "Botein"],
} as const;

export const TAURUS = {
  name: "Taurus",
  ime: "Bakodloak",
  symbol: "♉",
  eclipticDeg: { from: 53.4, to: 90.1 },
  sunTransit: "May 14 – Jun 21",
  brightestStars: ["Aldebaran", "Elnath", "Alcyone", "Hyadum I"],
} as const;

export const GEMINI = {
  name: "Gemini",
  ime: "Wardice",
  symbol: "♊",
  eclipticDeg: { from: 90.1, to: 118.0 },
  sunTransit: "Jun 21 – Jul 20",
  brightestStars: ["Pollux", "Castor", "Alhena", "Wasat"],
} as const;

export const CANCER = {
  name: "Cancer",
  ime: "Tovarići",
  symbol: "♋",
  eclipticDeg: { from: 118.0, to: 138.0 },
  sunTransit: "Jul 20 – Aug 10",
  brightestStars: ["Tarf", "Acubens", "Asellus Australis", "Asellus Borealis"],
} as const;

export const LEO = {
  name: "Leo",
  ime: "Kosyre",
  symbol: "♌",
  eclipticDeg: { from: 138.0, to: 173.9 },
  sunTransit: "Aug 10 – Sep 16",
  brightestStars: ["Regulus", "Denebola", "Algieba", "Zosma"],
} as const;

export const VIRGO = {
  name: "Virgo",
  ime: "Divyce",
  symbol: "♍",
  eclipticDeg: { from: 173.9, to: 217.8 },
  sunTransit: "Sep 16 – Oct 31",
  brightestStars: ["Spica", "Zavijava", "Porrima", "Vindemiatrix"],
} as const;

export const LIBRA = {
  name: "Libra",
  ime: "Žmyni",
  symbol: "♎",
  eclipticDeg: { from: 217.8, to: 241.0 },
  sunTransit: "Oct 31 – Nov 23",
  brightestStars: ["Zubenelgenubi", "Zubeneschamali", "Zubenelhakrabi", "Brachium"],
} as const;

export const SCORPIUS = {
  name: "Scorpius",
  ime: "Škraplune",
  symbol: "♏",
  eclipticDeg: { from: 241.0, to: 247.6 },
  sunTransit: "Nov 23 – Nov 30",
  brightestStars: ["Antares", "Shaula", "Sargas", "Dschubba"],
} as const;

export const SAGITTARIUS = {
  name: "Sagittarius",
  ime: "Šunde",
  symbol: "♐",
  eclipticDeg: { from: 266.2, to: 299.7 },
  sunTransit: "Dec 18 – Jan 19",
  brightestStars: ["Kaus Australis", "Nunki", "Ascella", "Kaus Media"],
} as const;

export const CAPRICORNUS = {
  name: "Capricornus",
  ime: "Haye",
  symbol: "♑",
  eclipticDeg: { from: 299.7, to: 327.5 },
  sunTransit: "Jan 19 – Feb 16",
  brightestStars: ["Deneb Algedi", "Dabih", "Nashira", "Alshat"],
} as const;

export const AQUARIUS = {
  name: "Aquarius",
  ime: "Baje",
  symbol: "♒",
  eclipticDeg: { from: 327.5, to: 351.6 },
  sunTransit: "Feb 16 – Mar 12",
  brightestStars: ["Sadalsuud", "Sadalmelik", "Skat", "Albali"],
} as const;

export const PISCES = {
  name: "Pisces",
  ime: "Ryboj",
  symbol: "♓",
  eclipticDeg: { from: 351.6, to: 28.7 },
  sunTransit: "Mar 12 – Apr 19",
  brightestStars: ["Alrescha", "Fum al Samakah", "Eta Piscium", "Gamma Piscium"],
} as const;

export const ZODIAC_CONSTELLATIONS = [
  ARIES,
  TAURUS,
  GEMINI,
  CANCER,
  LEO,
  VIRGO,
  LIBRA,
  SCORPIUS,
  SAGITTARIUS,
  CAPRICORNUS,
  AQUARIUS,
  PISCES,
] as const;

export type ZodiacConstellation = (typeof ZODIAC_CONSTELLATIONS)[number];

export const MOON = {
  name: "Moon",
  ime: "Myšec",
  symbol: "☽",
  angularSizeRange: "29' 23\" to 33' 28\"",
  speedDegPerDay: "12.2 – 14.8",
  siderealDanceDays: 27.32,
  solarDanceDays: 29.53,
  retrogradeDays: 0,
} as const;

export const MERCURY = {
  name: "Mercury",
  ime: "(Unknown)",
  symbol: "☿",
  angularSizeRange: "5\" to 13\"",
  speedDegPerDay: "0.4 – 2.0",
  siderealDanceDays: 87.97,
  solarDanceDays: 115.88,
  retrogradeDays: "22.6 (20–24)",
} as const;

export const VENUS = {
  name: "Venus",
  ime: "Zwicerna",
  symbol: "♀",
  angularSizeRange: "10\" to 66\"",
  speedDegPerDay: "0.2 – 1.2",
  siderealDanceDays: 224.7,
  solarDanceDays: 583.92,
  retrogradeDays: "41.5 (40–44)",
} as const;

export const SUN = {
  name: "Sun",
  ime: "Šance",
  symbol: "☉",
  angularSizeRange: "31' 28\" (♋) to 32' 32\" (♑)",
  speedDegPerDay: "0.953 – 1.017",
  siderealDanceDays: 365.24,
  solarDanceDays: 0,
  retrogradeDays: 0,
} as const;

export const MARS = {
  name: "Mars",
  ime: "Rumanica",
  symbol: "♂",
  angularSizeRange: "3.5\" to 25\"",
  speedDegPerDay: "0.2 – 0.8",
  siderealDanceDays: 686.98,
  solarDanceDays: 779.94,
  retrogradeDays: "66.5 (54–73)",
} as const;

export const JUPITER = {
  name: "Jupiter",
  ime: "Plavušyca",
  symbol: "♃",
  angularSizeRange: "30\" to 59\"",
  speedDegPerDay: "0.05 – 0.15",
  siderealDanceDays: 4332.82,
  solarDanceDays: 398.88,
  retrogradeDays: "120.4 (118–123)",
} as const;

export const SATURN = {
  name: "Saturn",
  ime: "Želenyca",
  symbol: "♄",
  angularSizeRange: "14.5\" to 20.1\" (with rings: ~40–45\")",
  speedDegPerDay: "0.03 – 0.08",
  siderealDanceDays: 10755.7,
  solarDanceDays: 378.09,
  retrogradeDays: "140.7 (135–145)",
} as const;

export const WANDERING_STARS = [
  MOON,
  MERCURY,
  VENUS,
  SUN,
  MARS,
  JUPITER,
  SATURN,
] as const;

export type WanderingStar = (typeof WANDERING_STARS)[number];