<script lang="ts">
  interface Props {
    show:      boolean;
    message:   string;
    duration?: number;
    onHide?:   () => void;
  }

  let { show = $bindable(false), message, duration = 2000, onHide }: Props = $props();

  // ── Auto-hide ─────────────────────────────────────────────────────────────
  // Returning a function from $effect registers it as a cleanup callback,
  // called both when the effect re-runs and when the component is destroyed.
  // This replaces the separate onDestroy import entirely.

  let timeout: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (show) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        show = false;
        onHide?.();
      }, duration);
    }

    return () => clearTimeout(timeout);
  });
</script>

{#if show}
  <div class="toast">
    {message}
  </div>
{/if}