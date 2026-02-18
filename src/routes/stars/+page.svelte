<script lang="ts">
  import '/src/app.css';
  import { ZODIAC_CONSTELLATIONS, WANDERING_STARS} from '$lib/utils/stars';
  import { COLOR_PALETTES } from '$lib/utils/colors';
  import { NEW_NOTES_1_ALL, SCALE_DEGREE_KEYS, SONIC_PATTERN } from '$lib/utils/sounds';

  const colors = COLOR_PALETTES.wheel_of_light.map(c => `var(${c.variable})`);
  
  const wandererColors = SONIC_PATTERN.map(index => colors[(index + 0) % colors.length]);

</script>

<h1>Zodical Constellations</h1>
<p>
  <b>zodiacal constellation</b><br>
   [zoh-dahy-uhk-uhl    kon-stuh-ley-shuhn]<br>
   / zoʊˈdaɪ ək əl    ˌkɒn stəˈleɪ ʃəns /<br>
  noun<br>
  <i>A group of fixed stars on the zodiacal plane (the Sun’s apparent path).</i>
</p>
<ul>
  {#each ZODIAC_CONSTELLATIONS as constellation, i}
    <li style="color: {colors[i]}">
      {constellation.name} {constellation.symbol} → {NEW_NOTES_1_ALL[i]}
    </li>
  {/each}
</ul>

<h1>Wandering Stars</h1>
<p>
  <b>wandering star</b><br>
  [won-der-ing  stahr]<br>
  / ˈwɒn dər ɪŋ   stɑr /<br>
  noun<br>
  <i>A star that is visible to the naked eye and move across the zodiacal plane.</i>
</p>
<ul>
  {#each WANDERING_STARS as wanderer, i}
    <li style="color: {wandererColors[i]}">
      {wanderer.name} {wanderer.symbol} → {SCALE_DEGREE_KEYS[i]}
    </li>
  {/each}
</ul>