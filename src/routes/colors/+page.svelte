<script lang="ts">
  import { COLOR_PALETTES } from '$lib/utils/colors';
  import { getHexFromVariable } from '$lib/utils/color-conversion';
  import { exportPalette, exportAllPalettes, type ExportFormat } from '$lib/utils/palette-export';
  import { copyColor } from '$lib/utils/clipboard';
  import Toast from '$lib/components/Toast.svelte';
  import PaletteDownloadButtons from '$lib/components/PaletteDownloadButtons.svelte';

  let showToast = false;
  let toastMessage = '';

  // Map your display keys to COLOR_PALETTES keys
  const PALETTE_KEY_MAP = {
    scale_of_seven_shades: 'scale_of_seven_shades',
    twelve_color_wheel: 'twelve_color_wheel',
    twelve_color_wheel_of_darkness: 'twelve_color_wheel_of_darkness',
    twelve_color_wheel_of_light: 'twelve_color_wheel_of_light',
  } as const;

  type PaletteKey = keyof typeof PALETTE_KEY_MAP;

  // Convert palette to new ColorEntry[] format
  function getPaletteEntries(palette: typeof COLOR_PALETTES[keyof typeof COLOR_PALETTES]) {
    return palette.map(c => ({
      name: c.name,
      hex: getHexFromVariable(c.variable),
    }));
  }

  async function handleCopy(variable: string, colorName: string) {
    const hex = getHexFromVariable(variable);
    const result = await copyColor(hex, colorName);
    toastMessage = result.message;
    showToast = true;
  }

  function handleDownloadAll(format: ExportFormat) {
    const allColors = {
      scale_of_seven_shades: getPaletteEntries(COLOR_PALETTES[PALETTE_KEY_MAP.scale_of_seven_shades]),
      twelve_color_wheel: getPaletteEntries(COLOR_PALETTES[PALETTE_KEY_MAP.twelve_color_wheel]),
      twelve_color_wheel_of_darkness: getPaletteEntries(COLOR_PALETTES[PALETTE_KEY_MAP.twelve_color_wheel_of_darkness]),
      twelve_color_wheel_of_light: getPaletteEntries(COLOR_PALETTES[PALETTE_KEY_MAP.twelve_color_wheel_of_light]),
    };
    
    const result = exportAllPalettes(allColors, format);
    toastMessage = result.message;
    showToast = true;
  }

  function handleDownloadPalette(paletteName: string, paletteKey: PaletteKey, format: ExportFormat) {
    const colorEntries = getPaletteEntries(COLOR_PALETTES[PALETTE_KEY_MAP[paletteKey]]);
    const result = exportPalette(paletteName, colorEntries, format);
    toastMessage = result.message;
    showToast = true;
  }

  const palettes: { name: string; key: PaletteKey }[] = [
    { name: 'Scale of Seven Shades', key: 'scale_of_seven_shades' },
    { name: 'Twelve Color Wheel', key: 'twelve_color_wheel' },
    { name: 'Twelve Color Wheel of Darkness', key: 'twelve_color_wheel_of_darkness' },
    { name: 'Twelve Color Wheel of Light', key: 'twelve_color_wheel_of_light' },
  ];
</script>

<h1>Colors</h1>

<Toast bind:show={showToast} message={toastMessage} />

<PaletteDownloadButtons onDownload={handleDownloadAll} />

{#each palettes as { name, key }}
  <h2>{name}</h2>
  <div class="notes">
    {#each COLOR_PALETTES[PALETTE_KEY_MAP[key]] as { name: colorName, variable, needsWhiteText }}
      <span 
        class="note" 
        style="background-color: var({variable}); {needsWhiteText ? 'color: var(--white);' : ''}"
        on:click={() => handleCopy(variable, colorName)}
        on:keydown={(e) => e.key === 'Enter' && handleCopy(variable, colorName)}
        role="button"
        tabindex="0"
        aria-label="Copy {colorName} hex value to clipboard"
      >
        {colorName}
      </span>
    {/each}
  </div>
  <PaletteDownloadButtons 
    onDownload={(format) => handleDownloadPalette(name, key, format)} 
  />
{/each}
