# Design Monolith

A SvelteKit web application, a digital essay and a practical design tool.

## The Essay

A long-form illustrated essay unveiling the logic behind an audio-visual design system.
Downloadable as a PDF directly from the page.

## Chord Finder & Standard Guitar Tuner

A tool for finding all the chords in a spefific scale with correct frequencies and proposed new naming system.
Also a tuner for the standard guitar tuning.

## Colour Palette
A colour palette available for download in formats suitable for three design tools: Inkscape, CorelDRAW, and Paint.NET.

---

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) — framework
- TypeScript — all utility logic
- CSS custom properties — design token system
- `window.print()` — PDF export (no dependencies)

---

## Getting Started

```bash
git clone https://github.com/filipkacic/Design-Monolith.git
cd Design-Monolith
npm install
npm run dev
```

---

## Structure

```
src/
├── lib/
│   ├── components/               # seperation of concerns
│   │   ├── ChordDisplay.svelte
│   │   ├── PaletteDownloadButtons.svelte
│   │   ├── ScaleControl.svelte
│   │   ├── ScaleDisplay.svelte
│   │   ├── Toast.svelte
│   │   └── TuningDisplay.svelte
│   ├── stores/
│   │   └── naming.ts             # note/mode naming conventions
│   └── utils/
│       ├── chord-construction.ts # important chord generation
│       ├── clipboard.ts
│       ├── color-conversion.ts
│       ├── colors.ts             # colour palettes and HSL data
│       ├── palette-export.ts     # XML / GPL / TXT export
│       ├── paths.ts
│       ├── pdf-download.ts       # print-to-PDF trigger
│       ├── sounds.ts             # notes, modes, scale degree numerals
│       └── stars.ts              # zodiac constellations and wandering star data
└── routes/
    ├── +layout.svelte
    ├── +page.svelte              # the essay
    ├── Header.svelte
    ├── Footer.svelte
    ├── colors/
    │   └── +page.svelte          # audio
    └── sounds/
        └── +page.svelte          # visual
```

---

## License

© 2026 Filip Kačić. All rights reserved.
