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
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  
  // Toggle between naming systems
  let useNewNaming = false;
  
  // Track by INDEX instead of value
  let selectedNoteIndex = 0;
  let selectedModeIndex = 0;
  
  // Reactive variables that switch based on naming system
  $: currentNotes = useNewNaming ? NEW_NOTES_1_ALL : NOTES_1_ALL;
  $: currentModes = useNewNaming ? NEW_MODES : MODES;
  
  // Derive the actual note/mode from the index
  $: selectedNote = currentNotes[selectedNoteIndex];
  $: selectedMode = currentModes[selectedModeIndex];
  
  // Generate scale with the useNew parameter
  $: scale = getScale(selectedNote, selectedMode, true, useNewNaming);

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

<!-- Add the toggle checkbox -->
<div class="naming-toggle">
  <label>
    Use Proposed New Names:
    <input type="checkbox" bind:checked={useNewNaming} />
  </label>
</div>

<div class="scale-selector">
  <div class="input-group">
    <label for="note">Root Note:</label>
    <select id="note" bind:value={selectedNoteIndex}>
      {#each currentNotes as note, i}
        <option value={i}>{note}</option>
      {/each}
    </select>
  </div>
  
  <div class="input-group">
    <label for="mode">Mode:</label>
    <select id="mode" bind:value={selectedModeIndex}>
      {#each currentModes as mode, i}
        <option value={i}>{mode}</option>
      {/each}
    </select>
  </div>
</div>

<div class="scale-output">
  <h2>{selectedNote} {selectedMode}</h2>
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

<style>
  .scale-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space);
    margin: var(--space);
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space);
  }
  
  select {
    padding: var(--less-space) var(--space);
    font-size: 1rem;
    border: var(--hairline) solid var(--light-gray);
    cursor: pointer;
    background-color: var(--white);
    transition: border-color var(--blink) ease-in-out;
  }
  
  select:hover {
    border-color: var(--black);
  }
  
  .scale-output {
    margin: var(--space);
  }
  
  .notes {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space);
  }
  
  .note {
    padding: var(--space) var(--more-space);
    background: var(--white);
    transition: all var(--blink) ease-in-out;
    cursor: pointer;
  }
  
  .note.root {
    font-weight: bold;
  }
  
  .note:hover {
    transform: scale(1.1);
    box-shadow: 0 var(--hairline) var(--outline) var(--shadow);
  }
  
  .note:active {
    transform: scale(0.9);
    box-shadow: none;
    font-weight: bold;
  }
  
  .frequency {
    font-size: 0.9rem;
    color: var(--gray);
  }

  /* Checkbox Style */
  .naming-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: var(--space);
  }

  .naming-toggle label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space);
  }

  .naming-toggle input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: var(--maximum-space);
    height: var(--extra-space);
    cursor: pointer;
    position: relative;
    background-color: var(--light-gray);
    transition: all var(--slow-motion) ease-in-out;
  }

  /* Toggle square */
  .naming-toggle input[type="checkbox"]::before {
    content: '';
    position: absolute;
    width: calc(var(--extra-space) - var(--minimum-space) * 2);
    height: calc(var(--extra-space) - var(--minimum-space) * 2);
    background-color: var(--white);
    top: var(--minimum-space);
    left: var(--minimum-space);
    transition: all var(--blink) ease-in-out;
    box-shadow: 0 var(--hairline) var(--outline) var(--shadow);
  }

  /* Checked state */
  .naming-toggle input[type="checkbox"]:checked {
    background-color: var(--black);
  }

  /* Move square when checked */
  .naming-toggle input[type="checkbox"]:checked::before {
    left: calc(var(--extra-space) + var(--minimum-space));
  }

  .naming-toggle input[type="checkbox"]:hover {
    opacity: 0.75;
  } 
</style>