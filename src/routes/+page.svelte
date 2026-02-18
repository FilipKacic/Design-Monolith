<script lang="ts">
  import { FREQUENCIES, NOTES_ALL, NEW_NOTES_ALL, MODES, NEW_MODES } from '$lib/utils/sounds';
  
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

<section>
  <h2>Music Theory</h2>
  
  <article>
    <h3>Why Twelve Notes In Music</h3>
    <p>
      The 1:2 ratio produces the same note in a higher octave, a fundamental property of sound that allows us to perceive musical continuity across pitches.
    </p>
    <p>
      By contrast, the 2:3 ratio generates <i>pure</i> or perfect fifth intervals, which give rise to entirely new notes. These ratios form the backbone of harmonious relationships in music.
    </p>
    <p>
      "The musical proportions seem to me to be particularly correct natural proportions."<br>
      — Novalis
    </p>
    <p>
      Twelve notes represent the minimum number that almost evenly divides a circle of frequencies following the perfect fifth ratio. Mathematically, the equation 2<sup>x</sup> ≠ 3<sup>y</sup> (for positive integers x and y) demonstrates that no smaller number can achieve this near-even division. The next possible number, 53 notes, is far too complex to be practical.
    </p>
  </article>
  
  <article>
    <h3>The First Note & The Frequencies Of All The Notes</h3>
    <p>
      One Hertz corresponds roughly to a single heartbeat cycle of a healthy human, serving as a natural reference point for frequency.
    </p>
    <p>
      Using successive powers of 3 (reflecting the 3:2 ratio) starting from 1 Hz, we construct a sequence of frequencies that generate the twelve fundamental musical notes:
    </p>
    <ul>
      {#each frequencyList as f}
        <li>3<sup>{f.power}</sup> = {f.frequency} Hz ({f.note})</li>
      {/each}
    </ul>
    <p>
      Modern equal-tempered tuning slightly adjusts these frequencies to ensure even spacing across all keys. While this preserves uniform intervals, it compromises the natural harmonic relationships that are central to the pure perception of sound. Conceptually, sound is not a simple circle but rather an upward spiral of frequencies, echoing the infinite progression of musical harmonics.
    </p>
  </article>
  
  <article>
    <h3>Why Seven Notes In A Mode And A Scale</h3>
    <p>
      A scale can be elegantly constructed using only pure perfect fifths and octaves. Introducing an eighth note disrupts these perfect intervals, producing what musicians call a <i>wolf</i> fifth — a dissonance that challenges natural harmony.
    </p>
  </article>
  
  <article>
    <h3>The First Mode</h3>
    <p>
      From the twelve-note circle of fifths, the initial seven-note sequence naturally forms the Lydian mode. This configuration explains why Lydian is traditionally considered the first mode: it represents the purest arrangement of notes derived from the fundamental harmonic ratios.
    </p>
  </article>
  
  <article>
    <h3>The Seventh And Twelfth Note Problematic Taxonomy</h3>
    <p>
      Following powers of 3, the seventh note arises at 3<sup>6</sup> = 729 Hz, corresponding to F#. This creates a paradox in traditional naming: F is more accurately E#, and F# effectively becomes F. After generating six additional notes, it makes little sense to label the seventh as a sharp or to treat the twelfth as a distinct new note.
    </p>
  </article>
  
  <article>
    <h3>Musical Note & Mode Names Overhaul</h3>
    <p>
      This proposal reimagines the naming of musical notes, modes, and ultimately scales. It is guided by natural harmonic relationships, logical reasoning, alchemical principles, and a touch of optimism.
    </p>
    <p>Renaming of notes:</p>
    <ul>
      {#each renamedNotes as n}
        <li>{n.oldName} → {n.newName}</li>
      {/each}
    </ul>
    <p>Renaming of modes:</p>
    <ul>
      {#each renamedModes as mode}
        <li>{mode.oldName} → {mode.newName}</li>
      {/each}
    </ul>
  </article>
</section>

<section>
  <h2>Color Theory</h2>
  
  <article>
    <h3>The First Color</h3>
    <p>
      Among the visible spectrum, red possesses the lowest frequency, ranging approximately from 400 to 480 THz. Its deep resonance forms the foundational color in the natural order of the rainbow.
    </p>
  </article>
  
  <article>
    <h3>The Color Wheel</h3>
    <p>
      By dividing the color spectrum into twelve equal sections, with red as the starting point, we obtain the twelve fundamental colors that correspond to the twelve musical notes. This creates a visual harmony akin to the structure of a musical octave.
    </p>
  </article>
  
  <article>
    <h3>The Other Color Wheels</h3>
    <p>
      Adding black to a color darkens it, producing the <i>color wheel of darkness</i>, a palette of deeper, shadowed hues.
    </p>
    <p>
      Introducing gray — a combination of black and white — fades saturation and gives rise to the <i>color wheel of ghost</i>, ethereal tones with muted vibrancy.
    </p>
    <p>
      Infusing white lightens a color, forming the <i>color wheel of light</i>, a series of luminous, pastel-like shades.
    </p>
  </article>
  
  <article>
    <h3>Light Mixing</h3>
    <p>
      When white light passes through a glass prism, it disperses into its constituent spectral colors, revealing the hidden rainbow within.
    </p>
    <p>
      Conversely, combining primary light colors — red, green, and blue — or complementary sets such as yellow, azure, and cyclamen — results in white light, illustrating the additive nature of color.
    </p>
  </article>
</section>

<section>
  <h2>Celestial Theory</h2>
  
  <article>
    <h3>The Wandering Stars</h3>
    <p>
      The wandering stars, or planets, traverse the celestial sphere in predictable yet intricate paths, influencing ancient conceptions of harmony and the order of the cosmos.
    </p>
  </article>
  
  <article>
    <h3>The Firmament</h3>
    <p>
      The firmament, long thought to be a solid celestial dome, reflects humanity's desire to impose structure upon the heavens, connecting stars, light, and cosmic order to our understanding of earthly patterns.
    </p>
  </article>
</section>

<section>
  <article>
    <h2>Post Scriptum</h2>
    <p>
      I have not discovered anything new under the Sun,
      but only filtered the chaos of information into a fragment of truth.
      These illuminate the nature of sound and its relationship to color.
      My hope is that this knowledge is used to create more beauty in the world.
      Godspeed!
    </p>
  </article>
</section>