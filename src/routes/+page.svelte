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
    gap: 2rem;
    margin: 2rem 0;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  select {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }
  
  select:hover {
    border-color: #888;
  }
  
  .scale-output {
    margin-top: 3rem;
  }
  
  .scale-output h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .notes {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .note {
    padding: 1rem 1.5rem;
    background: #f0f0f0;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .note.root {
    background: #4a90e2;
    color: white;
  }
  
  .note:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
</style>