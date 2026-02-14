<script lang="ts">
  import { 
    FREQUENCIES,
    NEW_FREQUENCIES,
  } from '$lib/modes';
  import Toast from '$lib/components/Toast.svelte';
  import NamingToggle from '$lib/components/NamingToggle.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming } from '$lib/stores/naming';
  
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
  
  $: frequencies = $useNewNaming ? NEW_FREQUENCIES : FREQUENCIES;
  
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

<h1>Guitar Tuning</h1>

<!-- Toast Notification -->
<Toast bind:show={showToast} message={toastMessage} />

<!-- Naming toggle -->
<NamingToggle />

<h2>Standard Guitar Tuning</h2>

<ul class="tuning-list">
  {#each standardTuning as note, i}
    {@const baseFrequency = getFrequency(note)}
    {@const adjustedFrequency = getAdjustedFrequency(note, stringExponents[i])}
    <li>
      <div class="string-row">
        <span class="string-number">String {1 + i}:</span>
        <span 
          class="note"
          style="background-color: {getNoteColor(baseFrequency)};"
          on:click={() => handleCopy(adjustedFrequency, note)}
          on:keydown={(e) => e.key === 'Enter' && handleCopy(adjustedFrequency, note)}
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
</style>