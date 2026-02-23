<script lang="ts">
  import {
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_1_ALL,
    MODES,
    getScale,
    reduceToOctave,
  } from '$lib/utils/sounds';

  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming } from '$lib/stores/naming';
  import type { ScaleNote } from '$lib/utils/sounds';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { scale, oncopy }: {
    scale:  ScaleNote[];
    oncopy: (frequency: number) => void;
  } = $props();

  // ── Guitar tuning ─────────────────────────────────────────────────────────
  // STRING_EXPONENTS: the x in 2^x applied per string to place its frequency
  // in the correct octave register (low E through high E).
  //
  // TUNING_SCALE_DEGREES: positional indices into the degree-display-ordered scale
  // (Tonic, Mediant, Dominant, Subtonic, Supertonic, Subdominant, Submediant).
  // For C Lydian: [C, D, E, F#, G, A, B] → indices [2,5,1,4,6,2] = E A D G B E,
  // mirroring standard guitar tuning's pitch-class layout.
  //
  // referenceScale is C Lydian (first note, first mode) and serves as the
  // octave-reduction anchor so string registers stay stable across scale changes.

  const STRING_EXPONENTS     = [0, 2, 4, 6, 0, 2] as const;
  const TUNING_SCALE_DEGREES = [2, 5, 1, 4, 6, 2] as const;

  const referenceScale = getScale(NOTES_1_ALL[0], MODES[0], true, false);

  const referenceFrequencies = TUNING_SCALE_DEGREES.map((degreeIndex, i) =>
    referenceScale[degreeIndex].frequency * Math.pow(2, STRING_EXPONENTS[i])
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  // frequencies is kept in sync with the naming system so getNoteColor
  // receives the correct Pythagorean frequency for each note name.

  const frequencies = $derived($useNewNaming ? NEW_FREQUENCIES : FREQUENCIES);

  // For each string: take the scale degree frequency, apply the octave
  // multiplier, reduce to the reference register, then enforce ascending
  // pitch order by doubling until the string is higher than the previous one.

  const tuning = $derived.by(() => {
    const result: { note: string; frequency: number }[] = [];

    for (let i = 0; i < TUNING_SCALE_DEGREES.length; i++) {
      const scaleNote = scale[TUNING_SCALE_DEGREES[i]];
      const adjusted  = scaleNote.frequency * Math.pow(2, STRING_EXPONENTS[i]);

      let reduced = reduceToOctave(adjusted, referenceFrequencies[i]);

      if (i > 0) {
        const prev = result[i - 1].frequency;
        while (reduced <= prev) reduced *= 2;
      }

      result.push({ note: scaleNote.note, frequency: reduced });
    }

    return result;
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  // Looks up the base Pythagorean frequency for a note name so getNoteColor
  // receives the correct value regardless of the octave-adjusted tuning frequency.

  function getFrequency(note: string): number {
    return frequencies.find(f => f.note === note)?.frequency ?? 0;
  }
</script>

<ul class="tuning-list">
  {#each tuning as { note, frequency }, i}
    <li>
      <div class="string-row">
        <span class="string-number">String {i + 1}:</span>

        <button
          type="button"
          class="note"
          style="background-color: {getNoteColor(getFrequency(note))};"
          onclick={() => oncopy(frequency)}
          title="Reference: {referenceFrequencies[i].toFixed(2)}Hz"
        >
          {note}
          <span class="frequency">({frequency.toFixed(2)}Hz)</span>
        </button>
      </div>
    </li>
  {/each}
</ul>