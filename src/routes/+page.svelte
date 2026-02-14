<script lang="ts">
  import { 
    NOTES_1_ALL, 
    NEW_NOTES_1_ALL,
    FREQUENCIES,
    getScale, 
    MODES,
    NEW_MODES,
    type Mode,
    type newMode
  } from '$lib/modes';
  import Toast from '$lib/components/Toast.svelte';
  import NamingToggle from '$lib/components/NamingToggle.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming, selectedNoteIndex, selectedModeIndex } from '$lib/stores/naming';
  
  // Reactive variables that switch based on naming system
  $: currentNotes = $useNewNaming ? NEW_NOTES_1_ALL : NOTES_1_ALL;
  $: currentModes = $useNewNaming ? NEW_MODES : MODES;
  
  // Derive the actual note/mode from the index
  $: selectedNote = currentNotes[$selectedNoteIndex];
  $: selectedMode = currentModes[$selectedModeIndex];
  
  // Generate scale with the useNew parameter
  $: scale = getScale(selectedNote, selectedMode, true, $useNewNaming);

  // Toast notification state
  let showToast = false;
  let toastMessage = '';

  // Copy frequency to clipboard
  async function handleCopy(frequency: number, note: string) {
    const result = await copyFrequency(frequency);
    toastMessage = result.message;
    showToast = true;
  }
</script>

<h1>Design Monolith</h1>

<!-- Toast Notification -->
<Toast bind:show={showToast} message={toastMessage} />

<!-- Naming toggle -->
<NamingToggle />

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

<div class="scale-output">
  <h2>Notes in the {selectedNote} {selectedMode} Scale:</h2>
  <div class="notes">
    {#each scale as { note, frequency }, i}
      <span 
        class="note" 
        class:root={i === 0}
        style="background-color: {getNoteColor(frequency)};"
        on:click={() => handleCopy(frequency, note)}
        on:keydown={(e) => e.key === 'Enter' && handleCopy(frequency, note)}
        role="button"
        tabindex="0"
        aria-label="Copy {note} ({frequency}Hz) to clipboard"
      >
        {note}
        <span class="frequency">({frequency}Hz)</span>
      </span>
    {/each}
  </div>
</div>