<script lang="ts">
  import {
    FREQUENCIES, NEW_FREQUENCIES,
    NOTES_1_ALL, MODES,
    getScale, reduceToOctave,
  } from '$lib/utils/sounds';
  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming } from '$lib/stores/naming';
  import type { ScaleNote } from '$lib/utils/sounds';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { scale, oncopy }: {
    scale:  ScaleNote[];
    oncopy: (frequency: number) => void;
  } = $props();

  // ── String table ──────────────────────────────────────────────────────────
  // Each entry describes one guitar string. All values are fixed regardless
  // of root or mode — only the frequency of the chosen scale degree changes.
  //
  //   degree:   index into the degree-display-ordered scale
  //             (Tonic=0, Mediant=2, Dominant=4, … — see DEGREE_DISPLAY_ORDER)
  //             [2,5,1,4,6,2] → E A D G B E in C Lydian standard tuning
  //   exponent: the x in 2^x that places this string in the right octave
  //             register. Each step of x=2 doubles the frequency (one octave).
  //   name:     generated from the 1-based string index

  const STRING_DATA = [
    { degree: 2, exponent: 0 },
    { degree: 5, exponent: 2 },
    { degree: 1, exponent: 4 },
    { degree: 4, exponent: 6 },
    { degree: 6, exponent: 0 },
    { degree: 2, exponent: 2 },
  ] as const;

  // Name is derived by loop — adding/removing strings never requires
  // touching the names manually.
  const STRINGS = STRING_DATA.map((s, i) => ({ ...s, name: `String ${i + 1}:` }));

  // ── Reference tuning ──────────────────────────────────────────────────────
  // C Lydian (root 0, mode 0) is the stable octave-reduction anchor.
  // reduceToOctave uses these frequencies to decide which octave a computed
  // string frequency should land in — keeping registers consistent when the
  // root or mode changes. Computed once at module load, never changes.

  const REF_SCALE = getScale(NOTES_1_ALL[0], MODES[0], true, false);

  const REF_FREQUENCIES = STRINGS.map(({ degree, exponent }) =>
    REF_SCALE[degree].frequency * (2 ** exponent)
  );

  // ── Frequency colour lookup ───────────────────────────────────────────────
  // getNoteColor needs the base Pythagorean frequency for a note name, not the
  // octave-adjusted tuning frequency. Build a Map for O(1) lookup instead of
  // scanning the array with find() on every render.

  const colorMap = $derived(
    new Map(($useNewNaming ? NEW_FREQUENCIES : FREQUENCIES).map(f => [f.note, f.frequency]))
  );

  // ── Tuning derivation ─────────────────────────────────────────────────────
  // For each string:
  //   1. Take the scale note at this string's degree.
  //   2. Apply the octave exponent (2^x) to target the right register.
  //   3. reduceToOctave aligns it to the reference register for that string.
  //   4. Enforce ascending pitch — double until higher than the previous string.

  const tuning = $derived.by(() => {
    const result: { note: string; frequency: number }[] = [];

    for (let i = 0; i < STRINGS.length; i++) {
      const { degree, exponent } = STRINGS[i];
      const scaleNote = scale[degree];

      let freq = reduceToOctave(
        scaleNote.frequency * (2 ** exponent),
        REF_FREQUENCIES[i],
      );

      if (i > 0) {
        const prev = result[i - 1].frequency;
        while (freq <= prev) freq *= 2;
      }

      result.push({ note: scaleNote.note, frequency: freq });
    }

    return result;
  });
</script>

<ul class="tuning-list">
  {#each tuning as { note, frequency }, i (STRINGS[i].name)}
    <li class="string-row">

      <span class="string-name">{STRINGS[i].name}</span>

      <button
        type="button"
        class="note"
        style="background-color: {getNoteColor(colorMap.get(note) ?? 0)};"
        onclick={() => oncopy(frequency)}
        title="Reference: {REF_FREQUENCIES[i].toFixed(2)} Hz"
      >
        {note}
        <span class="frequency">({frequency.toFixed(2)} Hz)</span>
      </button>

    </li>
  {/each}
</ul>