<script lang="ts">
  import { COLOR_PALETTES } from '$lib/utils/colors';
  import { getHexFromVariable } from '$lib/utils/color-conversion';
  import { exportAllPalettes, type ExportFormat } from '$lib/utils/palette-export';
  import { copyColor } from '$lib/utils/clipboard';
  import Toast from '$lib/components/Toast.svelte';
  import PaletteDownloadButtons from '$lib/components/PaletteDownloadButtons.svelte';

  // ── State ─────────────────────────────────────────────────────────────────

  let showToast    = $state(false);
  let toastMessage = $state('');

  // ── Palette definitions ───────────────────────────────────────────────────
  // Single source of truth — both the render loop and handleDownloadAll
  // derive from this array, so adding a palette is a one-line change.

  type PaletteKey = keyof typeof COLOR_PALETTES;

  const palettes: { name: string; key: PaletteKey }[] = [
    { name: 'Scale of Shades',        key: 'scale'            },
    { name: 'Color Wheel',             key: 'wheel'            },
    { name: 'Color Wheel of Darkness', key: 'wheel_of_darkness'},
    { name: 'Color Wheel of Ghost',    key: 'wheel_of_ghost'   },
    { name: 'Color Wheel of Light',    key: 'wheel_of_light'   },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getPaletteEntries(palette: typeof COLOR_PALETTES[PaletteKey]) {
    return palette.map(c => ({
      name: c.name,
      hex:  getHexFromVariable(c.variable),
    }));
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleCopy(variable: string, colorName: string) {
    const result = await copyColor(getHexFromVariable(variable), colorName);
    toastMessage = result.message;
    showToast    = true;
  }

  function handleDownloadAll(format: ExportFormat) {
    // Build the export payload from palettes[] to avoid manually re-listing keys.
    const allColors = Object.fromEntries(
      palettes.map(({ key }) => [key, getPaletteEntries(COLOR_PALETTES[key])])
    );
    const result = exportAllPalettes(allColors, format);
    toastMessage = result.message;
    showToast    = true;
  }
</script>

<h1>Colors</h1>

<Toast bind:show={showToast} message={toastMessage} />
<PaletteDownloadButtons onDownload={handleDownloadAll} />

{#each palettes as { name, key }}
  <h2>{name}</h2>

  <div class="notes">
    {#each COLOR_PALETTES[key] as { name: colorName, variable, needsWhiteText }}
      <button
        class="note"
        style="background-color: var({variable}); {needsWhiteText ? 'color: var(--white);' : ''}"
        onclick={() => handleCopy(variable, colorName)}
        aria-label="Copy {colorName} hex value to clipboard"
      >
        {colorName}
      </button>
    {/each}
  </div>
{/each}