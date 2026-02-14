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

<style>
  .toast {
    position: fixed;
    bottom: var(--more-space);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--black);
    color: var(--white);
    padding: var(--space) var(--more-space);
    border-radius: var(--space);
    box-shadow: 0 var(--outline) var(--more-space) var(--shadow);
    animation: slideUp var(--slow-motion) ease-in-out;
    z-index: 1000;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(var(--more-space));
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>