<script lang="ts">
  import {
    getDyads,
    getTriads,
    getTetrachords,
    getPentachords,
    getHexachords,
    getHeptachords,
  } from '$lib/utils/chord-construction';

  import { getNoteColor }   from '$lib/utils/colors';
  import type { ScaleNote } from '$lib/utils/sounds';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { scale, oncopy }: {
    scale:  ScaleNote[];
    oncopy: (frequency: number) => void;
  } = $props();

  // ── Chord sizes ───────────────────────────────────────────────────────────

  const CHORD_SIZES = [2, 3, 4, 5, 6, 7] as const;
  type ChordSize = typeof CHORD_SIZES[number];

  // ── State ─────────────────────────────────────────────────────────────────

  let chordSize      = $state<ChordSize>(3);
  let hideInversions = $state(true);

  // ── Chord generation ──────────────────────────────────────────────────────
  // Recomputed whenever scale, chordSize, or hideInversions changes.

  const chords = $derived.by(() => {
    const options = { hideInversions };
    switch (chordSize) {
      case 2: return getDyads(scale, options);
      case 3: return getTriads(scale, options);
      case 4: return getTetrachords(scale, options);
      case 5: return getPentachords(scale, options);
      case 6: return getHexachords(scale, options);
      case 7: return getHeptachords(scale, options);
    }
  });
</script>

<!-- ── Controls ───────────────────────────────────────────────────────────── -->

<div class="chord-controls">
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

  <div class="toggle">
    <label>
      Hide inversions: <input type="checkbox" bind:checked={hideInversions} />
    </label>
  </div>
</div>

<!-- ── Chord cards ────────────────────────────────────────────────────────── -->

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
            onclick={() => oncopy(n.frequency)}
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