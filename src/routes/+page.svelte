<script lang="ts">
  import { FREQUENCIES, NOTES_ALL, NEW_NOTES_ALL, MODES, NEW_MODES } from '$lib/utils/modes';
  
  // Precompute frequency list for display
  const frequencyList = FREQUENCIES.map((f, i) => ({
    note: f.note,
    frequency: f.frequency,
    power: i
  }));
  
  // Map old notes → new notes (strip octave numbers, remove duplicates)
  const renamedNotes = NOTES_ALL
    .map((oldNote, i) => ({
      oldName: oldNote.replace(/\d+$/, ''),
      newName: NEW_NOTES_ALL[i].replace(/\d+$/, '')
    }))
    .filter((item, index, arr) =>
      arr.findIndex(x => x.oldName === item.oldName) === index
    );
  
  // Map old modes → new modes
  const renamedModes = MODES.map((oldMode, i) => ({
    oldName: oldMode,
    newName: NEW_MODES[i]
  }));
</script>

<h1>Design Monolith</h1>

<section>
  <h2>Music Theory</h2>
  
  <article>
    <h3>Why Twelve Notes In Music</h3>
    <p>
      The 1:2 ratio produces the same note in a higher octave.
      <br>
      The 2:3 ratio generates new notes.
      <br>
      Twelve is the minimum number that nearly evenly divides a circle with the 2:3 ratio.
      The equation 2<sup>x</sup> ≠ 3<sup>y</sup> (for positive integers x and y) proves this.
      (The next possible number of notes is 53 and it is simply impractical.)
    </p>
  </article>
  
  <article>
    <h3>The First Note & The Frequencies Of All The Notes</h3>
    <p>
      One Hertz is equal to one heartbeat cycle of a healthy human.
      <br>
      Using the powers of 3 (the 3:2 ratio) starting from 1 Hz we get:
    </p>
    <ul>
      {#each frequencyList as f}
        <li>3<sup>{f.power}</sup> = {f.frequency} Hz ({f.note})</li>
      {/each}
    </ul>
    <p>
      Modern equal-tempered tuning slightly adjusts frequencies.
      That conserves equidistance, but breaks natural harmonic relationships.
    </p>
  </article>
  
  <article>
    <h3>Why Seven Notes In A Mode And A Scale</h3>
    <p>
      Adding an eighth note to a scale produces a <i>wolfish</i> interval.
    </p>
  </article>
  
  <article>
    <h3>The First Mode</h3>
    <p>
      From the twelve-note circle of fifths, the first seven-note pattern forms the Lydian mode pattern.
      That is why the Lydian mode is the first mode of this system.
    </p>
  </article>
  
  <article>
    <h3>The Seventh And Twelfth Note Problematic Taxonomy</h3>
    <p>
      Powers of 3 produce the seventh note at 3<sup>6</sup> = 729 Hz (F#).
      Because of that, F should be called E#, and F# should be called F.
      It has no sense after getting 6 new notes, to call the seventh note a sharp, and consider the twelfth note a new note.  
    </p>
  </article>
  
  <article>
    <h3>Musical Note & Mode Names Overhaul</h3>
    <p>
      This is a proposition of musical note, mode and, ultimately, scale name change.
      It is based on natural harmonic relationships, logic, alchemical knowledge and optimism.
    </p>
    <p>Note renaming:</p>
    <ul>
      {#each renamedNotes as n}
        <li>{n.oldName} → {n.newName}</li>
      {/each}
    </ul>
    <p>Mode renaming:</p>
    <ul>
      {#each renamedModes as mode}
        <li>{mode.oldName} → {mode.newName}</li>
      {/each}
    </ul>
  </article>
  
  <article>
    <h2>Post Scriptum</h2>
    <p>
      I have not discovered anything new under the Sun, but only filtered the chaos of information into a fragment of truth about our sonic reality and connected it with colors and celestial lights.
      Thank God and forgive me if I had made any mistakes.
      My hopes are that this knowledge helps designers create more beauty in the world.
      Amen.
    </p>
  </article>
</section>