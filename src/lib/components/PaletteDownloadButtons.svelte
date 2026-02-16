<!-- src/lib/components/PaletteDownloadButtons.svelte -->
<script lang="ts">
  import type { ExportFormat } from '$lib/utils/palette-export';

  export let onDownload: (format: ExportFormat) => void;
  
  // Only formats supported in the new palette exporter
  const formats: ExportFormat[] = ['gpl', 'xml', 'txt'];
</script>

<div class="download-buttons">
  <p style="margin-right: 0">Format download:</p>
  {#each formats as format}
    <button on:click={() => onDownload(format)}>
      .{format.toUpperCase()}
    </button>
  {/each}
</div>
