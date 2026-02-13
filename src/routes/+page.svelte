<script lang="ts">
  import { notesRevelation, getScale, type ModeName } from '$lib/modes';
  
  let selectedNote = "C";
  let selectedMode: ModeName = "Lydian";
  
  $: scale = getScale(selectedNote, selectedMode);
</script>

<h1>Design Monolith</h1>

<div class="scale-selector">
  <div class="input-group">
    <label for="note">Root Note:</label>
    <select id="note" bind:value={selectedNote}>
      {#each notesRevelation as note}
        <option value={note}>{note}</option>
      {/each}
    </select>
  </div>
  
  <div class="input-group">
    <label for="mode">Mode:</label>
    <select id="mode" bind:value={selectedMode}>
      {#each ["Lydian", "Mixolydian", "Aeolian", "Locrian", "Ionian", "Dorian", "Phrygian"] as mode}
        <option value={mode}>{mode}</option>
      {/each}
    </select>
  </div>
</div>

<div class="scale-output">
  <h2>{selectedNote} {selectedMode}</h2>
  <div class="notes">
    {#each scale as note, i}
      <span class="note" class:root={i === 0}>
        {note}
      </span>
    {/each}
  </div>
</div>

<style>
  .scale-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--more-space);
    margin: var(--more-space) 0;
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
    margin-top: var(--more-space);
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
  }
  
  .note.root {
    font-weight: bold;
  }

  .note:hover {
    transform: scale(1.2);
    box-shadow: 0 var(--hairline) var(--outline) var(--shadow);
  }
  
  .note:active {
  transform: scale(0.9);
  color: var(--white);
  background: var(--black);
}
</style>