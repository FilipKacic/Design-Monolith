<script lang="ts">
  import {
    NOTES_1_ALL, NEW_NOTES_1_ALL,
    MODES,       NEW_MODES,
  } from '$lib/utils/sounds';
  import { useNewNaming, selectedNoteIndex, selectedModeIndex } from '$lib/stores/naming';

  // ── Naming tables ─────────────────────────────────────────────────────────
  // Both lists are derived together as one object so they can never fall out
  // of sync — it is impossible for notes to use one naming system while modes
  // use another.

  const naming = $derived($useNewNaming
    ? { notes: NEW_NOTES_1_ALL, modes: NEW_MODES }
    : { notes: NOTES_1_ALL,     modes: MODES     }
  );
</script>

<div class="scale-controls">

  <!-- ── Naming toggle ──────────────────────────────────────────────────── -->
  <div class="toggle">
    <label>
      Proposed naming:
      <input type="checkbox" bind:checked={$useNewNaming} />
    </label>
  </div>

  <!-- ── Root note + mode selectors ────────────────────────────────────── -->
  <!-- Changing either value updates the shared store, which drives scale   -->
  <!-- generation reactively across every component that reads from it.     -->
  <div class="scale-selector">

    <div class="input-group">
      <label for="note">Root</label>
      <select id="note" bind:value={$selectedNoteIndex}>
        {#each naming.notes as note, i}
          <option value={i}>{note}</option>
        {/each}
      </select>
    </div>

    <div class="input-group">
      <label for="mode">Mode</label>
      <select id="mode" bind:value={$selectedModeIndex}>
        {#each naming.modes as mode, i}
          <option value={i}>{mode}</option>
        {/each}
      </select>
    </div>

  </div>

</div>