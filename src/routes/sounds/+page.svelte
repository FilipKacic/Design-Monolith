<script lang="ts">
  import {
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_1_ALL,
    NEW_NOTES_1_ALL,
    MODES,
    NEW_MODES,
    getScale,
    reduceToOctave,
  } from '$lib/utils/sounds';

  import {
    getDyads,
    getTriads,
    getTetrachords,
    getPentachords,
    getHexachords,
    getHeptachords,
  } from '$lib/utils/chord-contruction';

  import Toast from '$lib/components/Toast.svelte';
  import ScaleControls from '$lib/components/ScaleControl.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import {
    useNewNaming,
    selectedNoteIndex,
    selectedModeIndex,
  } from '$lib/stores/naming';

  // ── Chord sizes ───────────────────────────────────────────────────────────

  const CHORD_SIZES = [2, 3, 4, 5, 6, 7] as const;
  type ChordSize = typeof CHORD_SIZES[number];

  // ── Guitar tuning ─────────────────────────────────────────────────────────
  // STRING_EXPONENTS: the x in 2^x applied per string to place its frequency
  // in the correct octave register (low E through high E).
  //
  // TUNING_SCALE_DEGREES: the scale degree index each string is tuned to,
  // mirroring standard tuning's pitch-class layout (E A D G B E).
  // These are fixed — changing the scale substitutes different pitches at
  // the same degree positions, which is what makes this scale-based tuning.
  //
  // referenceScale is C Lydian (first note, first mode) and serves as the
  // octave-reduction anchor so string registers stay stable across scale changes.

  const STRING_EXPONENTS     = [0, 2, 4, 6, 0, 2] as const;
  const TUNING_SCALE_DEGREES = [2, 5, 1, 4, 6, 2] as const;

  const referenceScale = getScale(NOTES_1_ALL[0], MODES[0], true, false);

  const referenceFrequencies = TUNING_SCALE_DEGREES.map((degreeIndex, stringIndex) =>
    referenceScale[degreeIndex].frequency * Math.pow(2, STRING_EXPONENTS[stringIndex])
  );

  // ── State ─────────────────────────────────────────────────────────────────

  let chordSize    = $state<ChordSize>(3);
  let showToast    = $state(false);
  let toastMessage = $state('');

  // ── Derived ───────────────────────────────────────────────────────────────
  // frequencies is kept in sync with the naming system for the color lookup
  // in the tuning section (getNoteColor requires the correct frequency value).

  const frequencies = $derived($useNewNaming ? NEW_FREQUENCIES : FREQUENCIES);

  const scale = $derived(getScale(
    $useNewNaming ? NEW_NOTES_1_ALL[$selectedNoteIndex] : NOTES_1_ALL[$selectedNoteIndex],
    $useNewNaming ? NEW_MODES[$selectedModeIndex]       : MODES[$selectedModeIndex],
    true,
    $useNewNaming,
  ));

  // ── Chord generation ──────────────────────────────────────────────────────

  const chords = $derived.by(() => {
    switch (chordSize) {
      case 2: return getDyads(scale);
      case 3: return getTriads(scale);
      case 4: return getTetrachords(scale);
      case 5: return getPentachords(scale);
      case 6: return getHexachords(scale);
      case 7: return getHeptachords(scale);
    }
  });

  // ── Tuning generation ─────────────────────────────────────────────────────
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

  function getFrequency(note: string): number {
    return frequencies.find(f => f.note === note)?.frequency ?? 0;
  }

  async function handleCopy(frequency: number) {
    const result = await copyFrequency(frequency);
    toastMessage = result.message;
    showToast    = true;
  }
</script>

<h1>Sounds</h1>

<Toast bind:show={showToast} message={toastMessage} />
<ScaleControls />

<!-- ── Scale display ───────────────────────────────────────────────────────── -->

<section class="scale-output">
  <h2>Notes in Scale</h2>

  <div class="notes">
    {#each scale as { note, frequency, degreeName, numeral }, i}
      <button
        type="button"
        class="note"
        class:root={i === 0}
        style="background-color: {getNoteColor(frequency)};"
        onclick={() => handleCopy(frequency)}
      >
        {note}
        <span class="frequency">({frequency.toFixed(2)}Hz)</span>
        <br />
        <span class="degree"><i>{degreeName} ({numeral})</i></span>
      </button>
    {/each}
  </div>
</section>

<!-- ── Chord display ───────────────────────────────────────────────────────── -->

<section class="chord-output">
  <h2>Chords in Scale</h2>

  <div class="size-selector">
    {#each CHORD_SIZES as size}
      <button
        type="button"
        class:selected={chordSize === size}
        onclick={() => (chordSize = size)}
      >
        {size}-note
      </button>
    {/each}
  </div>

  <div class="chords">
    {#each chords as chord}
      <div class="chord-card">
        <strong>{chord.symbol}</strong>

        <div class="chord-notes">
          {#each chord.notes as n}
            <button
              type="button"
              class="note"
              style="background-color: {getNoteColor(n.frequency)};"
              onclick={() => handleCopy(n.frequency)}
            >
              {n.note}
            </button>
          {/each}
        </div>

        <div class="intervals">
          {chord.intervals.join(' – ')}
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- ── Tuning display ──────────────────────────────────────────────────────── -->

<section>
  <h2>Scale-Based Guitar Tuning</h2>

  <ul class="tuning-list">
    {#each tuning as { note, frequency }, i}
      <li>
        <div class="string-row">
          <span class="string-number">String {i + 1}:</span>

          <button
            type="button"
            class="note"
            style="background-color: {getNoteColor(getFrequency(note))};"
            onclick={() => handleCopy(frequency)}
            title="Reference: {referenceFrequencies[i].toFixed(2)}Hz"
          >
            {note}
            <span class="frequency">({frequency.toFixed(2)}Hz)</span>
          </button>
        </div>
      </li>
    {/each}
  </ul>
</section>