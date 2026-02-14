<!-- src/lib/components/NamingToggle.svelte -->
<script lang="ts">
  import { useNewNaming } from '$lib/stores/naming';
</script>

<div class="naming-toggle">
  <label>
    Use Proposed New Names:
    <input type="checkbox" bind:checked={$useNewNaming} />
  </label>
</div>

<style>
  .naming-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: var(--space);
  }

  .naming-toggle label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space);
  }

  .naming-toggle input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: var(--maximum-space);
    height: var(--extra-space);
    cursor: pointer;
    position: relative;
    background-color: var(--light-gray);
    transition: all var(--slow-motion) ease-in-out;
  }

  /* Toggle square */
  .naming-toggle input[type="checkbox"]::before {
    content: '';
    position: absolute;
    width: calc(var(--extra-space) - var(--minimum-space) * 2);
    height: calc(var(--extra-space) - var(--minimum-space) * 2);
    background-color: var(--white);
    top: var(--minimum-space);
    left: var(--minimum-space);
    transition: all var(--blink) ease-in-out;
    box-shadow: 0 var(--hairline) var(--outline) var(--shadow);
  }

  /* Checked state */
  .naming-toggle input[type="checkbox"]:checked {
    background-color: var(--black);
  }

  /* Move square when checked */
  .naming-toggle input[type="checkbox"]:checked::before {
    left: calc(var(--extra-space) + var(--minimum-space));
  }

  .naming-toggle input[type="checkbox"]:hover {
    opacity: 0.75;
  }
</style>