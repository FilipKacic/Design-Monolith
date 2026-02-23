<script lang="ts">
  import {
    NOTES_1_ALL,
    NEW_NOTES_1_ALL,
    MODES,
    NEW_MODES,
  } from '$lib/utils/sounds';
  import { useNewNaming, selectedNoteIndex, selectedModeIndex } from '$lib/stores/naming';

  // ── Derived ───────────────────────────────────────────────────────────────
  // Switches the displayed note and mode lists when the naming toggle changes.

  const currentNotes = $derived($useNewNaming ? NEW_NOTES_1_ALL : NOTES_1_ALL);
  const currentModes = $derived($useNewNaming ? NEW_MODES : MODES);
</script>

<div class="scale-controls">
  <div class="toggle">
    <label>
      Proposed Naming System:
      <input type="checkbox" bind:checked={$useNewNaming} />
    </label>
  </div>

  <div class="scale-selector">
    <div class="input-group">
      <label for="note">Root Note:</label>
      <select id="note" bind:value={$selectedNoteIndex}>
        {#each currentNotes as note, i}
          <option value={i}>{note}</option>
        {/each}
      </select>
    </div>

    <div class="input-group">
      <label for="mode">Mode:</label>
      <select id="mode" bind:value={$selectedModeIndex}>
        {#each currentModes as mode, i}
          <option value={i}>{mode}</option>
        {/each}
      </select>
    </div>
  </div>
</div>