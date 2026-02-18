<script lang="ts">
  import '/src/app.css';
  import { ZODIAC_CONSTELLATIONS, WANDERING_STARS } from '$lib/utils/stars';
  import { COLOR_PALETTES } from '$lib/utils/colors';
  import { NEW_NOTES_1_ALL, SCALE_DEGREE_KEYS } from '$lib/utils/sounds';

  const colors = COLOR_PALETTES.wheel_of_light.map(c => `var(${c.variable})`);
  const MODE_OFFSETS = [0, -2, -4, -6, -1, -3, -5] as const;
  const wandererColors = MODE_OFFSETS.map(offset => colors[((offset % 12) + 12) % 12]);
</script>

<h1>Constellations</h1>
<ul>
  {#each ZODIAC_CONSTELLATIONS as constellation, i}
    <li style="color: {colors[i]}">
      {constellation.name} {constellation.symbol} → {NEW_NOTES_1_ALL[i]}
    </li>
  {/each}
</ul>

<h1>Wandering Stars</h1>
<ul>
  {#each WANDERING_STARS as wanderer, i}
    <li style="color: {wandererColors[i]}">
      {wanderer.name} {wanderer.symbol} → {SCALE_DEGREE_KEYS[i]}
    </li>
  {/each}
</ul>