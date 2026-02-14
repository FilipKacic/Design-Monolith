<script lang="ts">
  import { 
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_1_ALL, 
    NEW_NOTES_1_ALL,
    getScale, 
    MODES,
    NEW_MODES,
  } from '$lib/modes';
  import Toast from '$lib/components/Toast.svelte';
  import NamingToggle from '$lib/components/NamingToggle.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming, selectedNoteIndex, selectedModeIndex } from '$lib/stores/naming';
  
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
  
  // Reactive variables that switch based on naming system (for scale selection)
  $: currentNotes = $useNewNaming ? NEW_NOTES_1_ALL : NOTES_1_ALL;
  $: currentModes = $useNewNaming ? NEW_MODES : MODES;
  
  // Derive the actual note/mode from the index
  $: selectedNote = currentNotes[$selectedNoteIndex];
  $: selectedMode = currentModes[$selectedModeIndex];
  
  // Generate scale with the useNew parameter
  $: scale = getScale(selectedNote, selectedMode, true, $useNewNaming);
  
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

<!-- Scale selector (same as home page) -->
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