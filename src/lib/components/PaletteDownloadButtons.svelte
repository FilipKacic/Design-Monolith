<script lang="ts">
  import type { ExportFormat } from '$lib/utils/palette-export';

  // ── Props ─────────────────────────────────────────────────────────────────

  const { onDownload }: { onDownload: (format: ExportFormat) => void } = $props();

  // ── Format dispatch table ─────────────────────────────────────────────────
  // Each entry pairs the format key with its human-readable label.
  // `format` is typed directly as ExportFormat — if palette-export ever adds or
  // removes a format, TypeScript will flag any missing entry here at compile time.
  // `as const` narrows to a readonly tuple of literals, preventing mutation
  // and giving TypeScript full inference over each entry.

  const FORMATS: ReadonlyArray<{ format: ExportFormat; label: string }> = [
    { format: 'gpl', label: '.GPL' },
    { format: 'xml', label: '.XML' },
    { format: 'txt', label: '.TXT' },
  ] as const;
</script>

<div class="download-buttons">
  <p>Download palette:</p>

  {#each FORMATS as { format, label } (format)}
    <button type="button" onclick={() => onDownload(format)}>
      {label}
    </button>
  {/each}
</div>