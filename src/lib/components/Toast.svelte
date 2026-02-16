<!-- src/lib/components/Toast.svelte -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  
  interface Props {
    show: boolean;
    message: string;
    duration?: number;
    onHide?: () => void;
  }
  
  let { show = $bindable(false), message, duration = 2000, onHide }: Props = $props();
  
  let timeout: ReturnType<typeof setTimeout>;
  
  // Watch for show changes and auto-hide after duration
  $effect(() => {
    if (show) {
      if (timeout) clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        show = false;
        if (onHide) onHide();
      }, duration);
    }
  });
  
  // Cleanup on destroy
  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });
</script>

{#if show}
  <div class="toast">
    {message}
  </div>
{/if}