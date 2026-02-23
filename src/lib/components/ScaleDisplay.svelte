<script lang="ts">
  import { getNoteColor } from '$lib/utils/colors';
  import type { ScaleNote } from '$lib/utils/sounds';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { scale, oncopy }: {
    scale:  ScaleNote[];
    oncopy: (frequency: number) => void;
  } = $props();
</script>

<div class="notes">
  {#each scale as { note, frequency, degreeName, numeral }, i}
    <button
      type="button"
      class="note"
      class:root={i === 0}
      style="background-color: {getNoteColor(frequency)};"
      onclick={() => oncopy(frequency)}
    >
      {note}
      <span class="frequency">({frequency.toFixed(2)}Hz)</span>
      <br />
      <span class="degree"><i>{degreeName} ({numeral})</i></span>
    </button>
  {/each}
</div>