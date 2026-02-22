<script lang="ts">
  import type { ExportFormat } from '$lib/utils/palette-export';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { onDownload }: { onDownload: (format: ExportFormat) => void } = $props();

  // ── Formats ───────────────────────────────────────────────────────────────
  // as const narrows the type to readonly tuple of literals,
  // preventing accidental mutation and giving TypeScript full inference.

  const FORMATS = ['gpl', 'xml', 'txt'] as const;
</script>

<div class="download-buttons">
  <p>Download palette:</p>
  {#each FORMATS as format}
    <button onclick={() => onDownload(format)}>.{format.toUpperCase()}</button>
  {/each}
</div>