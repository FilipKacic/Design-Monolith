<script lang="ts">
  import { 
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_ALL,
    NEW_NOTES_ALL,
    getScale,
    MODES,
    NEW_MODES,
    type Mode,
    type newMode,
  } from '$lib/modes';
  
  // Toggle between naming systems
  let useNewNaming = false;
  
  // Exponent values for each string - MODIFY THESE VALUES to adjust frequencies by 2^x
  // String 1: 2^0 = ×1
  // String 2: 2^2 = ×4
  // String 3: 2^4 = ×16
  // String 4: 2^6 = ×64
  // String 5: 2^0 = ×1
  // String 6: 2^2 = ×4
  const stringExponents = [0, 2, 4, 6, 0, 2];
  
  // Standard guitar tuning is always E-A-D-G-B-E (from low to high: 6th to 1st string)
  // These note names will automatically change when switching naming systems
  // because we're looking them up in the appropriate FREQUENCIES array
  const standardTuningNotes = ['E1', 'A1', 'D1', 'G1', 'B1', 'E1'];
  
  // Get the equivalent note names in the current naming system
  $: standardTuning = standardTuningNotes.map(oldNote => {
    // Find the frequency of this note in the old system
    const oldFreq = FREQUENCIES.find(f => f.note === oldNote);
    if (!oldFreq) return oldNote;
    
    // Find the note with the same frequency in the current system
    const currentFreq = frequencies.find(f => f.frequency === oldFreq.frequency);
    return currentFreq ? currentFreq.note : oldNote;
  });
  
  $: frequencies = useNewNaming ? NEW_FREQUENCIES : FREQUENCIES;
  
  // Get frequency for a note
  function getFrequency(note: string): number {
    const freq = frequencies.find(f => f.note === note);
    return freq ? freq.frequency : 0;
  }
  
  // Get adjusted frequency for a string
  function getAdjustedFrequency(note: string, exponent: number): number {
    const baseFreq = getFrequency(note);
    return baseFreq * Math.pow(2, exponent);
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
      await navigator.clipboard.writeText(frequency.toFixed(2));
      
      toastMessage = `Copied ${note}: ${frequency.toFixed(2)}Hz`;
      showToast = true;
      
      if (toastTimeout) clearTimeout(toastTimeout);
      
      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 2000);
      
      console.log(`Copied ${note}: ${frequency.toFixed(2)}Hz to clipboard`);
    } catch (err) {
      toastMessage = 'Failed to copy';
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 2000);
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

<h2>Standard Guitar Tuning</h2>

<ul class="tuning-list">
  {#each standardTuning as note, i}
    {@const baseFrequency = getFrequency(note)}
    {@const adjustedFrequency = getAdjustedFrequency(note, stringExponents[i])}
    {@const multiplier = Math.pow(2, stringExponents[i])}
    <li>
      <div class="string-row">
        <span class="string-number">String {1 + i}:</span>
        <span 
          class="note"
          style="background-color: {getNoteColor(baseFrequency)};"
          on:click={() => copyToClipboard(adjustedFrequency, note)}
          on:keydown={(e) => e.key === 'Enter' && copyToClipboard(adjustedFrequency, note)}
          role="button"
          tabindex="0"
        >
          {note}
          <span class="frequency">({adjustedFrequency.toFixed(2)}Hz)</span>
        </span>
      </div>
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
    gap: var(--more-space);
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
  
  .string-row {
    display: flex;
    align-items: center;
    gap: var(--space);
  }
  
  .string-number {
    text-align: right;
  }
  
  .note {
    padding: var(--space) var(--more-space);
    background: var(--white);
    transition: all var(--blink) ease-in-out;
    cursor: pointer;
    text-align: center;
    position: relative;
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