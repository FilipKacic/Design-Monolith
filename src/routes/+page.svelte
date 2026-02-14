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
  
  // Toggle between naming systems
  let useNewNaming = false;
  
  // Reactive variables that switch based on naming system
  $: currentNotes = useNewNaming ? NEW_NOTES_1_ALL : NOTES_1_ALL;
  $: currentModes = useNewNaming ? NEW_MODES : MODES;
  
  // Selected values
  let selectedNote = NOTES_1_ALL[0];
  let selectedMode: Mode | newMode = MODES[0];
  
  // Update selected values when switching naming systems
  $: if (useNewNaming) {
    selectedNote = NEW_NOTES_1_ALL[0];
    selectedMode = NEW_MODES[0];
  } else {
    selectedNote = NOTES_1_ALL[0];
    selectedMode = MODES[0];
  }
  
  // Generate scale with the useNew parameter
  $: scale = getScale(selectedNote, selectedMode, true, useNewNaming);
  
  console.log('All frequencies:', FREQUENCIES);

  // Toast notification state
  let showToast = false;
  let toastMessage = '';
  let toastTimeout: ReturnType<typeof setTimeout>; // Fixed type

  // Color mapping for the 12 notes
  const noteColors: { [key: number]: string } = {
    0: 'var(--light-mulberry)',
    1: 'var(--light-red)',
    2: 'var(--light-mushmula)',
    3: 'var(--light-yellow)',
    4: 'var(--light-olive)',
    5: 'var(--light-green)',
    6: 'var(--light-teal)',
    7: 'var(--light-azure)',
    8: 'var(--light-indigo)',
    9: 'var(--light-blue)',
    10: 'var(--light-lavender)',
    11: 'var(--light-cyclamen)',
  };
  
  // Function to get color based on frequency index
  function getNoteColor(frequency: number): string {
    // Find the index in FREQUENCIES array
    const index = FREQUENCIES.findIndex(f => f.frequency === frequency);
    if (index === -1) return 'var(--white)';
    
    // Map to color (cycle through 12 colors)
    const colorIndex = index % 12;
    return noteColors[colorIndex] || 'var(--white)';
  }

  // Copy frequency to clipboard
  async function copyToClipboard(frequency: number, note: string) {
    try {
      await navigator.clipboard.writeText(frequency.toString());
      
      // Show toast notification
      toastMessage = `Copied to clipboard!`;
      showToast = true;
      
      // Clear existing timeout
      if (toastTimeout) clearTimeout(toastTimeout);
      
      // Hide toast after 2 seconds
      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 2000);
      
      console.log(`Copied to clipboard!`);
    } catch (err) {
      toastMessage = 'Failed to copy...';
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 2000);
      console.error('Failed to copy to clipboard:', err);
    }
  }
</script>

<h1>Design Monolith</h1>

<!-- Toast Notification -->
{#if showToast}
  <div class="toast">
    {toastMessage}
  </div>
{/if}

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
    <select id="note" bind:value={selectedNote}>
      {#each currentNotes as note}
        <option value={note}>{note}</option>
      {/each}
    </select>
  </div>
  
  <div class="input-group">
    <label for="mode">Mode:</label>
    <select id="mode" bind:value={selectedMode}>
      {#each currentModes as mode}
        <option value={mode}>{mode}</option>
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
        on:click={() => copyToClipboard(frequency, note)}
        on:keydown={(e) => e.key === 'Enter' && copyToClipboard(frequency, note)}
        role="button"
        tabindex="0"
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

  /* Toast Notification */
  .toast {
    position: fixed;
    bottom: var(--more-space);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--black);
    color: var(--white);
    padding: var(--space) var(--more-space);
    border-radius: var(--space);
    box-shadow: 0 var(--outline) var(--more-space) var(--shadow);
    animation: slideUp var(--slow-motion) ease-out;
    z-index: 1000;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(var(--more-space));
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
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
    opacity: 0.8;
  } 
</style>