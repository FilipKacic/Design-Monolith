<script lang="ts">
  interface Props {
    show:      boolean;
    message:   string;
    duration?: number;
    onHide?:   () => void;
  }

  let { show = $bindable(false), message, duration = 2000, onHide }: Props = $props();

  // ── Auto-hide ─────────────────────────────────────────────────────────────
  // The timeout is scoped inside the effect — it has no meaning outside it.
  // The cleanup function returned from $effect runs automatically before each
  // re-run and on component destroy, so clearTimeout is always called exactly
  // once per timer regardless of how show changes.

  $effect(() => {
    if (!show) return;

    const timeout = setTimeout(() => {
      show = false;
      onHide?.();
    }, duration);

    return () => clearTimeout(timeout);
  });
</script>

{#if show}
  <div class="toast">
    {message}
  </div>
{/if}