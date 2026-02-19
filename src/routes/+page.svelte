<script lang="ts">
  import {
    FREQUENCIES, NOTES_ALL, NEW_NOTES_ALL,
    MODES, NEW_MODES, MODE_PATTERNS,
    SCALE_DEGREE_KEYS, SCALE_DEGREE_NUMERALS,
    SONIC_PATTERN,
  } from '$lib/utils/sounds';

  import {
    ZODIAC_CONSTELLATIONS,
    WANDERING_STARS,
  } from '$lib/utils/stars';

  import { COLOR_PALETTES } from '$lib/utils/colors';

  // ── Frequencies ─────────────────────────────────────────────────────────────

  const frequencyList = FREQUENCIES.map((f, i) => ({
    note: f.note,
    frequency: f.frequency,
    power: i,
  }));

  // ── Note renames (deduplicated, strip octave suffix) ────────────────────────

  const renamedNotes = NOTES_ALL
    .map((oldNote, i) => ({
      oldName: oldNote.replace(/\d+[#]?$/, '').replace(/#$/, '#'),
      newName: NEW_NOTES_ALL[i].replace(/\d+[#]?$/, '').replace(/#$/, '#'),
    }))
    .filter((item, index, arr) =>
      arr.findIndex(x => x.oldName === item.oldName) === index
    );

  // ── Mode renames ────────────────────────────────────────────────────────────

  const renamedModes = MODES.map((oldName, i) => ({
    oldName,
    newName: NEW_MODES[i],
  }));

  // ── Mode offsets from Lydian ─────────────────────────────────────────────────

  const MODE_OFFSETS_RAW = [0, -2, -4, -6, -1, -3, -5] as const;

  const modeRotations = MODE_PATTERNS.map(({ mode }, i) => ({
    mode,
    newMode: NEW_MODES[i],
    offset: MODE_OFFSETS_RAW[i],
  }));

  // ── Scale degrees ───────────────────────────────────────────────────────────

  const scaleDegrees = SCALE_DEGREE_KEYS.map((name, i) => ({
    name,
    numeral: SCALE_DEGREE_NUMERALS[i],
  }));

  // ── Planetary correspondences ────────────────────────────────────────────────
  // Order matches WANDERING_STARS and NEW_MODES exactly

  const ALCHEMICAL_COLORS = [
    'Silver / White',
    'Gray / Mixed',
    'Green / Copper',
    'Gold / Yellow',
    'Red / Iron',
    'Blue / Tin',
    'Black / Lead',
  ] as const;

  const planetaryCorrespondences = WANDERING_STARS.map((star, i) => ({
    planet:  star.name,
    symbol:  star.symbol,
    newMode: NEW_MODES[i],
    oldMode: MODES[i],
    color:   ALCHEMICAL_COLORS[i],
  }));

  // ── Color palette names for dynamic rendering ─────────────────────────────

  const colorWheelNames = COLOR_PALETTES.wheel.map(c => c.name);
  const colorScaleNames = COLOR_PALETTES.scale.map(c => c.name);
</script>

<section>
  <h2>Music Theory</h2>

  <article>
    <h3>Why Twelve Notes In Music</h3>
    <p>
      The 1:2 ratio produces the octave — the same note at a higher pitch — a fundamental
      property of sound that creates continuity across the frequency spectrum.
    </p>
    <p>
      The 2:3 ratio generates the <i>pure</i>, perfect fifth the most consonant interval after
      the octave, and the one responsible for producing entirely new notes. These two ratios
      together form the harmonic backbone of all music.
    </p>
    <p>
      Twelve is the minimum number of notes that nearly evenly divides the circle of fifths.
      The equation 2<sup>x</sup> ≠ 3<sup>y</sup> for any positive integers x and y confirms
      that no smaller number achieves this. The next candidate — 53 notes — is mathematically
      closer but practically unusable.
    </p>
  </article>

  <article>
    <h3>Pythagorean Tuning</h3>
    <p>
      The system described here is inspired by the so-called Pythagorean tuning.
      It constructs all notes from a single interval: the perfect fifth, expressed as the ratio 3:2.
    </p>
    <p>
      By stacking twelve perfect fifths and collapsing them into a single octave, one arrives
      at the twelve-note chromatic scale. The result is a system of pure, mathematically
      grounded intervals — with one irresolvable flaw. After twelve fifths, the cycle does
      not close perfectly. The discrepancy — approximately 23.46 cents — is known as the
      <i>Pythagorean comma</i>: the remainder that emerges from the fundamental
      incommensurability of the powers of 2 and the powers of 3. It is the crack in the
      cosmic vessel, the point where the infinite spiral refuses to become a circle.
    </p>
    <p>
      Equal temperament, in near-universal use today, resolves this comma by distributing
      it evenly across all twelve intervals — a practical solution, and a philosophical
      compromise.
    </p>
  </article>

  <article>
    <h3>The First Note & The Frequencies Of All The Notes</h3>
    <p>
      One Hertz corresponds roughly to a single heartbeat cycle of a healthy human — a
      natural and fitting origin for the frequency scale.
    </p>
    <p>
      Applying successive powers of 3, reflecting the 3:2 harmonic ratio, from 1 Hz upward
      yields the twelve fundamental frequencies:
    </p>
    <ul>
      {#each frequencyList as f}
        <li>3<sup>{f.power}</sup> = {f.frequency} Hz — {f.note}</li>
      {/each}
    </ul>
    <p>
      Sound is not a closed circle but an ascending spiral — an infinite progression of
      harmonics reaching ever upward, never quite returning to where it began.
    </p>
  </article>

  <article>
    <h3>Cymatics — Sound Made Visible</h3>
    <p>
      In 1787, Ernst Chladni demonstrated that sound has a geometric dimension. By drawing
      a bow across a metal plate covered with sand, he produced intricate symmetrical
      patterns — the sand migrating to the nodal lines where the plate did not vibrate,
      revealing the hidden geometry of the frequency.
    </p>
    <p>
      This field, now called <i>cymatics</i>, shows that each frequency produces a
      characteristic form. Higher frequencies generate more complex patterns; harmonic
      intervals produce forms of greater symmetry. The ancient intuition that number governs
      form — that the same ratios which structure music also structure matter — finds in
      cymatics its most direct visual confirmation.
    </p>
    <p>
      Water responds to sound with particular sensitivity, its surface forming standing
      waves that mirror the frequency's geometry. The medium does not merely transmit
      the vibration — it embodies it.
    </p>
  </article>

  <article>
    <h3>Why Seven Notes In A Mode And A Scale</h3>
    <p>
      A scale built from pure perfect fifths and octaves holds together in natural
      consonance. The addition of an eighth note breaks this equilibrium, producing what
      musicians call a <i>wolf fifth</i> — a dissonant interval that disrupts the harmonic
      order. Seven is therefore not an arbitrary convention but a structural boundary imposed
      by the mathematics of harmony itself.
    </p>
  </article>

  <article>
    <h3>The First Mode</h3>
    <p>
      Tracing the first seven notes from the circle of fifths naturally yields the Lydian
      mode. This is why Lydian is the primordial mode — the most direct expression of the
      fundamental harmonic ratios, unaltered and uncompromised. All other modes are derived
      from it by rotating the starting position within the same seven-note sequence.
    </p>
  </article>

  <article>
    <h3>The Seven Modes As Rotations</h3>
    <p>
      Each mode is an offset from the Lydian origin — a shift along the circle of fifths
      that alters the character of the scale while preserving its underlying interval
      structure:
    </p>
    <ul>
      {#each modeRotations as { mode, newMode, offset }}
        <li>
          {mode} ({newMode}): {offset === 0 ? 'origin' : `${offset} steps`}
        </li>
      {/each}
    </ul>
    <p>
      The further the offset from zero, the more the mode departs from the pure harmonic
      origin — a gradual descent from brightness into shadow. Locrian, the most displaced,
      is accordingly the most dissonant and the least stable.
    </p>
  </article>

  <article>
    <h3>The Scale Degrees</h3>
    <p>
      Within any mode, each of the seven notes occupies a named structural position that
      describes its gravitational function relative to the root:
    </p>
    <ul>
      {#each scaleDegrees as { numeral, name }}
        <li>{numeral} — {name}</li>
      {/each}
    </ul>
    <p>
      The Tonic is the center of rest. The Dominant and Subdominant define the primary
      axis of tension and release. The remaining degrees provide color, movement, and
      resolution — a complete harmonic vocabulary within seven notes.
    </p>
  </article>

  <article>
    <h3>The Sonic Pattern</h3>
    <p>
      When a seven-note scale is mapped onto the twelve-note chromatic system, it occupies
      the following semitone positions:
    </p>
    <ul>
      {#each SONIC_PATTERN as step, i}
        <li>{SCALE_DEGREE_NUMERALS[i]} — semitone {step}</li>
      {/each}
    </ul>
    <p>
      The gaps between positions — two semitones between most degrees, one semitone
      between the third and fourth and the seventh and octave — define the characteristic
      sound of the major scale. This pattern is invariant across all root notes and
      mode rotations.
    </p>
  </article>

  <article>
    <h3>Kepler & The Music Of The Spheres</h3>
    <p>
      In 1619, Johannes Kepler published <i>Harmonices Mundi</i> — The Harmony of the
      World — demonstrating that the angular velocities of the planets at perihelion and
      aphelion correspond to recognizable musical intervals. Each planet, in his system,
      traces a melodic fragment as it moves through its elliptical orbit.
    </p>
    <p>
      Kepler was not writing metaphor. He was extending the Pythagorean tradition — that
      number, ratio, and harmony govern the structure of the cosmos — into a rigorous
      astronomical framework. His third law of planetary motion emerged directly from this
      investigation into cosmic proportion.
    </p>
    <p>
      The ancient doctrine of the <i>musica universalis</i> — the music of the spheres —
      holds that the celestial bodies produce a harmony inaudible to human ears, perceptible
      only through mathematics. The same ratios that govern musical consonance appear in
      orbital mechanics, in crystalline geometry, and in the proportions of living forms.
      The universe, it seems, hums in just intonation.
    </p>
  </article>

  <article>
    <h3>The Seventh And Twelfth Note Problematic Taxonomy</h3>
    <p>
      The seventh note in the sequence, 3<sup>6</sup> = 729 Hz, corresponds to F#. This
      exposes a flaw in traditional naming: F is more precisely E#, and what we call F#
      is effectively the note F. Labelling this seventh step as a sharp — and treating
      the twelfth as a distinct new note — is a historical inconsistency that obscures the
      underlying logic of the system.
    </p>
  </article>

  <article>
    <h3>Musical Note & Mode Names Overhaul</h3>
    <p>
      The following is a proposal to rename musical notes and modes in accordance with
      natural harmonic relationships, internal logical consistency, and alchemical
      symbolism. The mode names are drawn from the seven classical planets — a
      correspondence too structurally precise to ignore.
    </p>
    <p>Renaming of notes:</p>
    <ul>
      {#each renamedNotes as n}
        <li>{n.oldName} → {n.newName}</li>
      {/each}
    </ul>
    <p>Renaming of modes:</p>
    <ul>
      {#each renamedModes as m}
        <li>{m.oldName} → {m.newName}</li>
      {/each}
    </ul>
  </article>
</section>

<section>
  <h2>Color Theory</h2>

  <article>
    <h3>The First Color</h3>
    <p>
      Red occupies the lowest frequency of the visible spectrum, ranging from approximately
      400 to 480 THz. As the foundation of the rainbow's natural order, it is the fitting
      point of origin for any harmonic system of color — the tonic of the visible octave.
    </p>
  </article>

  <article>
    <h3>White Light & The Prism</h3>
    <p>
      White light appears uniform to the eye, but is in fact a superposition of all visible
      frequencies simultaneously. When passed through a glass prism, refraction separates
      these frequencies by their differing angles of deflection — the shorter the wavelength,
      the greater the bend. The result is the continuous spectral gradient of the rainbow:
      the hidden order made visible.
    </p>
    <p>
      Isaac Newton was the first to demonstrate, in 1666, that white light is not pure but
      composite — and that color is not a property added to light, but already latent within
      it. The prism does not create color; it reveals it. This principle is the foundation
      of all color theory that follows.
    </p>
  </article>

  <article>
    <h3>The Color Wheel</h3>
    <p>
      Dividing the visible spectrum into twelve equal sections — beginning with red —
      yields twelve fundamental colors that correspond directly to the twelve musical notes.
      The structure of the color wheel mirrors that of the musical octave: a closed cycle
      of harmonic relationships built from a linear, infinite source.
    </p>
    <p>The twelve colors of the wheel are:</p>
    <ul>
      {#each colorWheelNames as name}
        <li>{name}</li>
      {/each}
    </ul>
  </article>

  <article>
    <h3>The Scale Of Shades</h3>
    <p>
      Alongside the chromatic wheel, there exists an achromatic axis — the scale of shades,
      running from pure black through successive gradations to pure white. These are not
      colors in the spectral sense, but values: the measure of light's presence or absence.
      Every chromatic color lives somewhere between these two poles in perceived brightness.
    </p>
    <p>The scale of shades:</p>
    <ul>
      {#each colorScaleNames as name}
        <li>{name}</li>
      {/each}
    </ul>
  </article>

  <article>
    <h3>The Other Color Wheels</h3>
    <p>
      The twelve spectral colors may be systematically transformed by the addition of
      black, gray, or white — producing three derivative palettes, each with a distinct
      character:
    </p>
    <p>
      Adding black deepens a color, producing the <i>color wheel of darkness</i> — shadowed,
      grounded hues that carry weight and gravity.
    </p>
    <p>
      Introducing gray — the union of black and white — desaturates color into the
      <i>color wheel of ghost</i>: tones of muted, ethereal presence, neither vivid nor
      absent.
    </p>
    <p>
      Infusing white elevates a color into the <i>color wheel of light</i> — soft, radiant
      shades that suggest openness and clarity.
    </p>
    <p>
      These three transformations correspond precisely to the three achromatic forces:
      darkness, neutrality, and light. Together with the primary wheel, they constitute
      a complete tonal system.
    </p>
  </article>

  <article>
    <h3>Light Mixing</h3>
    <p>
      The prism divides white light into its spectral components. The inverse operation —
      combining spectral colors — reconstitutes it. This is the additive model of color,
      governing all light-emitting systems including screens and projectors.
    </p>
    <p>
      The three primary light colors — red, green, and blue — recombine to produce white.
      Their complementary triad — yellow, azure, and cyclamen — achieves the same result
      by a different path. All other combinations produce intermediate hues. Color, in the
      additive model, is both division and synthesis — the spectrum is a decomposition of
      unity, and unity is always recoverable.
    </p>
  </article>

  <article>
    <h3>Sonoluminescence — Sound Producing Light</h3>
    <p>
      Sonoluminescence is the phenomenon by which sound waves, propagated through a liquid
      medium, produce flashes of light. A bubble trapped in water and driven by an ultrasonic
      field will collapse with sufficient violence to emit light — briefly reaching
      temperatures comparable to the surface of the Sun.
    </p>
    <p>
      The precise mechanism remains incompletely understood, which is itself significant.
      Here, at the boundary between acoustics and optics, sound and light briefly become
      one. Frequency — the organizing principle of both music and color — manifests in a
      medium that is neither, producing the other from the compression of the first.
    </p>
    <p>
      It is the most direct physical demonstration of what this project implies abstractly:
      that sound and light are not separate phenomena but parallel expressions of the same
      underlying principle of vibration and frequency.
    </p>
  </article>

  <article>
    <h3>Contrast & Complementary Palettes</h3>
    <p>
      On a twelve-part color wheel, colors directly opposite one another — six steps apart —
      are <i>complementary</i>. They produce maximum visual contrast when placed side by
      side, each amplifying the perceived intensity of the other. The eye, seeking
      equilibrium, sharpens the distinction between opposites.
    </p>
    <p>
      Colors separated by four steps form a <i>triadic</i> palette — three hues equally
      spaced around the wheel. Triadic combinations are balanced and versatile, providing
      variety without sacrificing harmony. Colors separated by two steps or fewer form
      <i>analogous</i> palettes — cohesive and restful, but dependent on variation in value
      or saturation to maintain interest.
    </p>
  </article>

  <article>
    <h3>Hierarchy Through Hue, Value, And Saturation</h3>
    <p>
      In graphic design, color communicates structure before content. <i>Hue</i> establishes
      identity — it differentiates elements and creates categorical distinctions.
      <i>Value</i> — the lightness or darkness of a color — establishes hierarchy: high
      contrast draws the eye first, low contrast recedes. <i>Saturation</i> — the intensity
      of a hue — directs emphasis: a single saturated element among desaturated ones
      commands attention with precision.
    </p>
    <p>
      A disciplined palette operates across all three axes simultaneously. Hue for
      distinction, value for order, saturation for focus. The twelve-color wheel, combined
      with its darker, ghosted, and lighter variants, provides the full tonal range needed
      to build coherent visual systems at any scale.
    </p>
  </article>
</section>

<section>
  <h2>Celestial Theory</h2>

  <article>
    <h3>The Firmament</h3>
    <p>
      The twelve constellations of the zodiac divide the celestial sphere in the same
      proportion as the twelve notes divide the musical octave — and as the twelve colors
      divide the visible spectrum. This threefold correspondence across sound, light, and
      sky is either a remarkable coincidence or a structural principle of nature itself.
    </p>
    <p>The twelve zodiacal constellations, with their ecliptic positions and sun transits:</p>
    <ul>
      {#each ZODIAC_CONSTELLATIONS as z}
        <li>
          {z.symbol} {z.name} — {z.eclipticDeg.from}° to {z.eclipticDeg.to}° — {z.sunTransit}
        </li>
      {/each}
    </ul>
  </article>

  <article>
    <h3>The Wandering Stars</h3>
    <p>
      Seven celestial bodies — the classical planets known to antiquity as the wandering
      stars — move against the fixed backdrop of the firmament. Their number corresponds
      precisely to the seven notes of a scale, the seven degrees of a mode, and the seven
      days of the week.
    </p>
    <p>
      In the alchemical tradition, each planet governs a metal, a temperament, and a color.
      The mode names proposed in this system are drawn directly from these correspondences:
    </p>
    <ul>
      {#each planetaryCorrespondences as p}
        <li>
          {p.symbol} {p.planet} → {p.newMode} ({p.oldMode}) → {p.color}
        </li>
      {/each}
    </ul>
    <p>
      These correspondences are not decorative. They represent a pre-modern attempt to
      unify the observable world — sound, matter, light, and time — into a single coherent
      system. Whether read as symbolic or literal, they carry an internal logic that has
      proven remarkably durable across millennia of inquiry. The same seven that wander
      the sky govern the days, rule the metals, and now name the modes.
    </p>
  </article>

  <article>
    <h3>Orbital Periods & Harmonic Motion</h3>
    <p>
      The wandering stars do not merely correspond to modes by number — their motion
      itself is a kind of music. Each planet traces its orbit at a characteristic speed,
      completing its dance around the Sun in a period that defines its cosmic character:
    </p>
    <ul>
      {#each WANDERING_STARS as star}
        <li>
          {star.symbol} {star.name} — sidereal period: {star.siderealDanceDays} days
          {#if star.retrogradeDays !== 0}
            — retrograde: ~{star.retrogradeDays} days
          {/if}
        </li>
      {/each}
    </ul>
    <p>
      The retrograde motion of the outer planets — their apparent reversal against the
      fixed stars — is a product of relative orbital velocity. In the Ptolemaic system,
      it required elaborate epicycles to explain. In Kepler's elliptical framework, it
      is a natural consequence of the same harmonic ratios that generate the musical scale.
      The planets do not wander arbitrarily; they move in proportions.
    </p>
  </article>
</section>

<section>
  <article>
    <h2>Post Scriptum</h2>
    <p>
      I have not discovered anything new under the Sun, but rather distilled existing
      knowledge about sound, color, and the celestial order into a logical and practical
      reference — for myself, and any other audio or visual designer who may find it
      useful. Godspeed!
    </p>
  </article>
</section>