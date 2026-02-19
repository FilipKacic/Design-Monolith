<script lang="ts">
  // ─────────────────────────────────────────────
  // Imports
  // ─────────────────────────────────────────────

  import {
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_1_ALL,
    NEW_NOTES_1_ALL,
    MODES,
    NEW_MODES,
    getScale,
    reduceToOctave
  } from '$lib/utils/sounds';

  import {
    getDyads,
    getTriads,
    getTetrachords,
    getPentachords,
    getHexachords,
    getHeptachords
  } from '$lib/utils/chord-contruction';

  import Toast from '$lib/components/Toast.svelte';
  import ScaleControls from '$lib/components/ScaleControl.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import {
    useNewNaming,
    selectedNoteIndex,
    selectedModeIndex
  } from '$lib/stores/naming';

  // ─────────────────────────────────────────────
  // Constants
  // ─────────────────────────────────────────────

  const CHORD_SIZES = [2, 3, 4, 5, 6, 7] as const;
  type ChordSize = typeof CHORD_SIZES[number];

  // Guitar tuning configuration
  const stringExponents = [0, 2, 4, 6, 0, 2];
  const tuningScaleDegrees = [2, 5, 1, 4, 6, 2];

  // Static reference scale (C Lydian)
  const referenceScale = getScale(NOTES_1_ALL[0], MODES[0], true, false);

  const referenceFrequencies = tuningScaleDegrees.map((degreeIndex, stringIndex) =>
    referenceScale[degreeIndex].frequency *
    Math.pow(2, stringExponents[stringIndex])
  );

  // ─────────────────────────────────────────────
  // Reactive State
  // ─────────────────────────────────────────────

  let chordSize: ChordSize = 3;

  $: frequencies = $useNewNaming ? NEW_FREQUENCIES : FREQUENCIES;

  $: scale = getScale(
    $useNewNaming
      ? NEW_NOTES_1_ALL[$selectedNoteIndex]
      : NOTES_1_ALL[$selectedNoteIndex],
    $useNewNaming
      ? NEW_MODES[$selectedModeIndex]
      : MODES[$selectedModeIndex],
    true,
    $useNewNaming
  );

  // ─────────────────────────────────────────────
  // Chord Generation
  // ─────────────────────────────────────────────

  $: chords = (() => {
    switch (chordSize) {
      case 2: return getDyads(scale);
      case 3: return getTriads(scale);
      case 4: return getTetrachords(scale);
      case 5: return getPentachords(scale);
      case 6: return getHexachords(scale);
      case 7: return getHeptachords(scale);
    }
  })();

  // ─────────────────────────────────────────────
  // Guitar Tuning Generator (FIXED)
  // ─────────────────────────────────────────────

  $: tuning = (() => {
    const result: { note: string; frequency: number }[] = [];

    for (let stringIndex = 0; stringIndex < tuningScaleDegrees.length; stringIndex++) {
      const degreeIndex = tuningScaleDegrees[stringIndex];
      const scaleNote = scale[degreeIndex];

      const adjusted =
        scaleNote.frequency * Math.pow(2, stringExponents[stringIndex]);

      let reduced = reduceToOctave(
        adjusted,
        referenceFrequencies[stringIndex]
      );

      // Ensure ascending pitch order
      if (stringIndex > 0) {
        const prev = result[stringIndex - 1].frequency;
        while (reduced <= prev) reduced *= 2;
      }

      result.push({
        note: scaleNote.note,
        frequency: reduced
      });
    }

    return result;
  })();

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  function getFrequency(note: string): number {
    return frequencies.find(f => f.note === note)?.frequency ?? 0;
  }

  let showToast = false;
  let toastMessage = '';

  async function handleCopy(frequency: number) {
    const result = await copyFrequency(frequency);
    toastMessage = result.message;
    showToast = true;
  }
</script>

<h1>Sounds</h1>

<Toast bind:show={showToast} message={toastMessage} />
<ScaleControls />

<!-- ───────────────────────────── -->
<!-- SCALE DISPLAY -->
<!-- ───────────────────────────── -->

<section class="scale-output">
  <h2>Notes in Scale</h2>

  <div class="notes">
    {#each scale as { note, frequency, degreeName, numeral }, i}
      <button
        type="button"
        class="note"
        class:root={i === 0}
        style="background-color: {getNoteColor(frequency)};"
        on:click={() => handleCopy(frequency)}
      >
        {note}
        <span class="frequency">
          ({frequency.toFixed(2)}Hz)
        </span>
        <br />
        <span class="degree">
          <i>{degreeName} ({numeral})</i>
        </span>
      </button>
    {/each}
  </div>
</section>

<!-- ───────────────────────────── -->
<!-- CHORD DISPLAY -->
<!-- ───────────────────────────── -->

<section class="chord-output">
  <h2>Chords in Scale</h2>

  <div class="size-selector">
    {#each CHORD_SIZES as size}
      <button
        type="button"
        class:selected={chordSize === size}
        on:click={() => (chordSize = size)}
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
              on:click={() => handleCopy(n.frequency)}
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

<!-- ───────────────────────────── -->
<!-- TUNING DISPLAY -->
<!-- ───────────────────────────── -->

<section>
  <h2>Scale-Based Guitar Tuning</h2>

  <ul class="tuning-list">
    {#each tuning as { note, frequency }, i}
      <li>
        <div class="string-row">
          <span class="string-number">
            String {i + 1}:
          </span>

          <button
            type="button"
            class="note"
            style="background-color: {getNoteColor(getFrequency(note))};"
            on:click={() => handleCopy(frequency)}
            title="Reference: {referenceFrequencies[i].toFixed(2)}Hz"
          >
            {note}
            <span class="frequency">
              ({frequency.toFixed(2)}Hz)
            </span>
          </button>
        </div>
      </li>
    {/each}
  </ul>
</section>
