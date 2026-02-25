<script lang="ts">
  import {
    getDyads, getTriads, getTetrachords,
    getPentachords, getHexachords, getHeptachords,
    type ChordOptions,
  } from '$lib/utils/chord-construction';
  import { getNoteColor }   from '$lib/utils/colors';
  import type { ScaleNote } from '$lib/utils/sounds';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { scale, oncopy }: {
    scale:  ScaleNote[];
    oncopy: (frequency: number) => void;
  } = $props();

  // ── Size dispatch table ───────────────────────────────────────────────────
  // Maps each chord size to its getter function and musical name.
  // Adding a new chord size means one new entry here — no switch needed.

  const CHORD_SIZES = [
    { size: 2, label: 'Dyads',       get: getDyads        },
    { size: 3, label: 'Triads',      get: getTriads       },
    { size: 4, label: 'Tetrads',     get: getTetrachords  },
    { size: 5, label: 'Pentads',     get: getPentachords  },
    { size: 6, label: 'Hexads',      get: getHexachords   },
    { size: 7, label: 'Heptads',     get: getHeptachords  },
  ] as const;

  type ChordSize = typeof CHORD_SIZES[number];

  // ── State ─────────────────────────────────────────────────────────────────

  let active         = $state<ChordSize>(CHORD_SIZES[1]); // default: Triads
  let hideInversions = $state(true);

  // ── Chord generation ──────────────────────────────────────────────────────
  // Recomputed reactively whenever scale, active size, or hideInversions changes.
  // O(1) dispatch.

  const options = $derived<ChordOptions>({ hideInversions });
  const chords  = $derived(active.get(scale, options));
</script>

<!-- ── Controls ───────────────────────────────────────────────────────────── -->

<div class="chord-controls">

  <div class="size-selector">
    {#each CHORD_SIZES as entry}
      <button
        type="button"
        class:selected={active === entry}
        onclick={() => (active = entry)}
      >
        {entry.label}
      </button>
    {/each}
  </div>

  <div class="toggle">
    <label>
      Hide inversions:
      <input type="checkbox" bind:checked={hideInversions} />
    </label>
  </div>

</div>

<!-- ── Chord cards ────────────────────────────────────────────────────────── -->

<div class="chords">
  {#each chords as chord (chord.symbol)}

    <div class="chord-card">

      <strong class="chord-symbol">{chord.symbol}</strong>

      <div class="chord-notes">
        {#each chord.notes as n (n.note)}
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

      <div class="chord-intervals">
        {chord.intervals.join(' – ')}
      </div>

    </div>

  {/each}
</div>