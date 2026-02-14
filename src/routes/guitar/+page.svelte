<script lang="ts">
  import { 
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_ALL,
    NEW_NOTES_ALL,
  } from '$lib/modes';
  
  // Toggle between naming systems
  let useNewNaming = false;
  
  // Standard tuning notes (using traditional naming by default)
  const standardTuningOld = ['E1', 'A1', 'D1', 'G1', 'B1', 'E1'];
  
  // Function to convert old note names to new note names based on index position
  function convertToNewNaming(oldNotes: string[]): string[] {
    return oldNotes.map(oldNote => {
      // Find the index of the old note in NOTES_ALL
      const oldIndex = NOTES_ALL.indexOf(oldNote);
      if (oldIndex === -1) return oldNote; // fallback if not found
      
      // Get the new note at the same index position
      return NEW_NOTES_ALL[oldIndex] || oldNote;
    });
  }
  
  // Dynamically derive the new tuning from the old tuning
  const standardTuningNew = convertToNewNaming(standardTuningOld);
  
  $: standardTuning = useNewNaming ? standardTuningNew : standardTuningOld;
  $: frequencies = useNewNaming ? NEW_FREQUENCIES : FREQUENCIES;
  
  // Get frequency for a note
  function getFrequency(note: string): number {
    const freq = frequencies.find(f => f.note === note);
    return freq ? freq.frequency : 0;
  }
  
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
  
  // Function to get color based on frequency
  function getNoteColor(frequency: number): string {
    const index = FREQUENCIES.findIndex(f => f.frequency === frequency);
    if (index === -1) return 'var(--white)';
    const colorIndex = index % 12;
    return noteColors[colorIndex] || 'var(--white)';
  }
  
  // Toast notification state
  let showToast = false;
  let toastMessage = '';
  let toastTimeout: ReturnType<typeof setTimeout>;
  
  // Copy frequency to clipboard
  async function copyToClipboard(frequency: number, note: string) {
    try {
      await navigator.clipboard.writeText(frequency.toString());
      
      toastMessage = `Copied ${note}: ${frequency}Hz`;
      showToast = true;
      
      if (toastTimeout) clearTimeout(toastTimeout);
      
      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 1500);
      
      console.log(`Copied ${note}: ${frequency}Hz to clipboard`);
    } catch (err) {
      toastMessage = 'Failed to copy';
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 1500);
      console.error('Failed to copy to clipboard:', err);
    }
  }
</script>

<h1>Guitar Tuning</h1>

<!-- Toast Notification -->
{#if showToast}
  <div class="toast">
    {toastMessage}
  </div>
{/if}

<!-- Toggle checkbox -->
<div class="naming-toggle">
  <label>
    Use Proposed New Names:
    <input type="checkbox" bind:checked={useNewNaming} />
  </label>
</div>

<h2>Standard Tuning</h2>
<ul class="tuning-list">
  {#each standardTuning as note, i}
    {@const frequency = getFrequency(note)}
    <li>
      <span class="string-number">String {1 + i}:</span>
      <span 
        class="note"
        style="background-color: {getNoteColor(frequency)};"
        on:click={() => copyToClipboard(frequency, note)}
        on:keydown={(e) => e.key === 'Enter' && copyToClipboard(frequency, note)}
        role="button"
        tabindex="0"
      >
        {note}
        <span class="frequency">({frequency}Hz)</span>
      </span>
    </li>
  {/each}
</ul>

<style>
  h1, h2 {
    text-align: center;
    margin: var(--space);
  }
  
  .tuning-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space);
    list-style: none;
    margin: var(--more-space) 0;
    padding: 0;
  }
  
  .tuning-list li {
    display: flex;
    align-items: center;
    gap: var(--space);
    margin: 0;
  }
  
  .string-number {
    font-weight: bold;
    min-width: 5rem;
    text-align: right;
  }
  
  .note {
    padding: var(--space) var(--more-space);
    background: var(--white);
    transition: all var(--blink) ease-in-out;
    cursor: pointer;
    border: var(--hairline) solid var(--light-gray);
    min-width: 8rem;
    text-align: center;
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