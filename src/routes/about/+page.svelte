<script lang="ts">
  import { FREQUENCIES } from '$lib/modes';
</script>

<h1>About This Project</h1>

<h2>Conclusions</h2>

<h3>Why Twelve Notes In Music</h3>
<p>
  The 1 : 2 ratio gives us the same note in a higher octave (the 2:1 ratio gives us the same note in a lower octave).
  The 2 : 3 ratio gives us new notes.
  The minimum number to almost equally divide a circle with the 2 : 3 ratio is twelve.
  The equation 2<sup>x</sup>≠3<sup>y</sup>, when x and y are positive integers confirms that.
  (The next number of notes in a scale that would be possible is 53, which is simply not practical.)
</p>
<h3>The Correct Frequencies of the Notes</h3>
<p>
  Modern music uses the equal temperament tuning system, which divides the octave into twelve equal parts, resulting in slightly adjusted frequencies for each note.
  This is unnecessary and leads to a loss of the natural harmonic relationships between notes.
  The correct frequencies of the notes should be based on the powers of 3, starting from the lowest positive integer.
  1 Hz should reciprocal to the beat of a healthy human heartbeat (SI base unit: 1/s).
</p>
<ul>
  {#each FREQUENCIES as { note, frequency }, i}
    <li>3<sup>{i}</sup> = {frequency} Hz ({note})</li>
  {/each}
</ul>
<h3>Why Seven Notes In A Scale</h3>
<p>
  The eight note in a scale would make a wolfish interval. Seven notes in a scale is the maximum number of notes that can be used in a scale.
</p>
<h3>The First Mode</h3>
<p>
  When discovering the twelve notes with the circle of fifths, we get a pattern of the first seven notes which is ecliptic with the so-called Lydian mode.
  That is why Lydia mode should be the first mode in the list of modes, and not the Ionian one.
</p>
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
<h3>Musical Mode & Note Names Overhaul</h3>
<p>To conclude:</p>
<ul>
  <li>The Lydian Mode should be called the First Mode or the Lunar Mode</li>
  <li>The Mixolydian Mode should be called the Second Mode or the Mercurial Mode</li>
  <li>The Aeolian Mode should be called the Third Mode or the Venereal Mode</li>
  <li>The Locrian Mode should be called the Fourth Mode or the Solar Mode</li>
  <li>The Ionian Mode should be called the Fifth Mode or the Martial Mode</li>
  <li>The Dorian Mode should be called the Sixth Mode or the Jovial Mode</li>
  <li>The Phrygian Mode should be called the Seventh Mode or the Saturnine Mode</li>
</ul>
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