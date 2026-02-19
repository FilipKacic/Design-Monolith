<script lang="ts">
  import type { ExportFormat } from '$lib/utils/palette-export';

  let { onDownload }: { onDownload: (format: ExportFormat) => void } = $props();

  const formats: ExportFormat[] = ['gpl', 'xml', 'txt'];
</script>

<div class="download-buttons">
  <p>Format download:</p>
  {#each formats as format}
    <button onclick={() => onDownload(format)}>.{format.toUpperCase()}</button>
  {/each}
</div>