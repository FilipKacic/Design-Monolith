<script lang="ts">
  import '/src/app.css';
  import { ZODIAC_CONSTELLATIONS, WANDERING_STARS } from '$lib/utils/stars';
  import { COLOR_PALETTES } from '$lib/utils/colors';
  const colors = COLOR_PALETTES.twelve_color_wheel_of_light.map(c => `var(${c.variable})`);
</script>

<h1>Constellations</h1>
<ul>
  {#each ZODIAC_CONSTELLATIONS as constellation, i}
    <li style="color: {colors[i]}">
      {constellation.name} {constellation.symbol}
    </li>
  {/each}
</ul>

<h1>Wandering Stars</h1>
<ul>
  {#each WANDERING_STARS as wanderer, i}
    <li style="color: {colors[i*2]}">
      {wanderer.name} {wanderer.symbol}
    </li>
  {/each}
</ul>