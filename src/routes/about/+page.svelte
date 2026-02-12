<script lang="ts">
  import { FREQUENCIES } from '$lib/modes';
</script>

<h1>About This Project</h1>

<h2>Musical Theory</h2>
<p><i>The truth is so simple a child can grasp it, yet so complex that the most advanced machine algorithm cannot calculate it.</i></p>
<ul>
  {#each FREQUENCIES as { note, frequency }, i}
    <li>3<sup>{i}</sup> = {frequency} Hz ({note})</li>
  {/each}
</ul>

<h2>Conclusions</h2>

<h3>The First Note</h3>
<p>
    The C note is the note with the frequency of:
    3<sup>0</sup> = 1 Hz (Hertz [one heartbeat])
    which is the foundation of the tuning system.
    Therefore, the C note <i>should</i> be called the A note in correspondece with the alphabet.
</p>
<h3>The Seventh And The Twelvth Note</h3>
<p>
    Starting from the first note, going up the powers of the number 3, we get to the seventh note with the frequency of:
    3<sup>6</sup> = 729 Hz (F#).
    The note 'F#' should not be a sharp, nor a black key on a keyboard.
    By that fashion, the note 'F' should be a sharp and a black key on a keyboard.
</p>
<h3>Musical Note Names Overhaul</h3>
<p>To conclude:</p>
<ul>
    <li>C should be called A</li>
    <li>C# should be called A#</li>
    <li>D should be called B</li>
    <li>D# should be called B#</li>
    <li>E should be called C</li>
    <li>F should be called C#</li>
    <li>F# should be called D</li>
    <li>G should be called E</li>
    <li>G# should be called E#</li>
    <li>A should be called F</li>
    <li>A# should be called F#</li>
    <li>B should be called G</li>
</ul>


<h2>Post Scriptum</h2>
<p>
    I have not discovered anything new under the Sun, but I have filtered the chaos of infomations into a fragment of truth about our sonic reality and connected it with colors and celestial patterns as best as I could.
    Thank God and forgive me if I had made mistakes!
    My hopes are that this monolith of knowledge is used by the good man in audio and/or visual design to create more beauty.
</p>