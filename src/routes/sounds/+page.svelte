<script lang="ts">
  import { 
    FREQUENCIES,
    NEW_FREQUENCIES,
    NOTES_1_ALL,
    NEW_NOTES_1_ALL,
    MODES,
    NEW_MODES,
    getScale, 
    reduceToOctave,
  } from '$lib/utils/sounds';
  import Toast from '$lib/components/Toast.svelte';
  import ScaleControls from '$lib/components/ScaleControl.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import { getNoteColor } from '$lib/utils/colors';
  import { useNewNaming, selectedNoteIndex, selectedModeIndex } from '$lib/stores/naming';
  
  // Configuration: modify these to change tuning
  const stringExponents = [0, 2, 4, 6, 0, 2];
  const tuningScaleDegrees = [2, 5, 1, 4, 6, 2];
  
  // Calculate reference frequencies from C Lydian
  const theFirstScale = getScale('C1', 'Lydian', true, false);
  const referenceFrequencies = tuningScaleDegrees.map((degreeIndex, stringIndex) => 
    theFirstScale[degreeIndex].frequency * Math.pow(2, stringExponents[stringIndex])
  );
  
  // Reactive state
  $: frequencies = $useNewNaming ? NEW_FREQUENCIES : FREQUENCIES;
  $: scale = getScale(
    $useNewNaming ? NEW_NOTES_1_ALL[$selectedNoteIndex] : NOTES_1_ALL[$selectedNoteIndex],
    $useNewNaming ? NEW_MODES[$selectedModeIndex] : MODES[$selectedModeIndex],
    true,
    $useNewNaming
  );
  
  // Generate tuning with octave reduction and ascending order correction
  $: tuning = (() => {
    const result = [];
    
    for (let stringIndex = 0; stringIndex < tuningScaleDegrees.length; stringIndex++) {
      const degreeIndex = tuningScaleDegrees[stringIndex];
      const scaleNote = scale[degreeIndex];
      const adjustedFreq = scaleNote.frequency * Math.pow(2, stringExponents[stringIndex]);
      let reducedFreq = reduceToOctave(adjustedFreq, referenceFrequencies[stringIndex]);
      
      // Ensure ascending order: if this string is lower than the previous, double it
      if (stringIndex > 0) {
        const previousFreq = result[stringIndex - 1].frequency;
        while (reducedFreq <= previousFreq) {
          reducedFreq *= 2;
        }
      }
      
      result.push({ note: scaleNote.note, frequency: reducedFreq });
    }
    
    return result;
  })();
  
  // Frequency lookup for colors
  $: getFrequency = (note: string) => 
    frequencies.find(f => f.note === note)?.frequency ?? 0;
  
  // Toast state
  let showToast = false;
  let toastMessage = '';
  
  async function handleCopy(frequency: number, note: string) {
    const result = await copyFrequency(frequency);
    toastMessage = result.message;
    showToast = true;
  }
</script>

<h1>Sounds</h1>

<Toast bind:show={showToast} message={toastMessage} />
<ScaleControls />

<div class="scale-output">
  <h2>Notes in Scale:</h2>
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
        <span class="frequency">({frequency.toFixed(2)}Hz)</span>
      </span>
    {/each}
  </div>
</div>

<h2>Scale-Based Guitar Tuning</h2>

<ul class="tuning-list">
  {#each tuning as { note, frequency }, i}
    <li>
      <div class="string-row">
        <span class="string-number">String {i + 1}:</span>
        <span 
          class="note"
          style="background-color: {getNoteColor(getFrequency(note))};"
          on:click={() => handleCopy(frequency, note)}
          on:keydown={(e) => e.key === 'Enter' && handleCopy(frequency, note)}
          role="button"
          tabindex="0"
          title="Reference: {referenceFrequencies[i].toFixed(2)}Hz"
        >
          {note}
          <span class="frequency">({frequency.toFixed(2)}Hz)</span>
        </span>
      </div>
    </li>
  {/each}
</ul>