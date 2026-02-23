<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { assetBase } from '$lib/utils/paths';

  // ── Scroll behaviour ──────────────────────────────────────────────────────
  // Header hides on scroll-down past SCROLL_THRESHOLD, reveals on scroll-up.
  // rAF + ticking flag prevents firing more than once per animation frame.

  const SCROLL_DELTA_MIN = 5;  // px — ignore micro-jitter below this
  const SCROLL_THRESHOLD = 60; // px — don't hide while near the top of page

  let hidden = $state(false);
  let lastY   = 0;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y     = window.scrollY;
      const delta = y - lastY;

      if (Math.abs(delta) >= SCROLL_DELTA_MIN) {
        hidden = delta > 0 && y > SCROLL_THRESHOLD;
        lastY  = y;
      }

      ticking = false;
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  // Defined as data so adding/removing a route is a one-line change.

  const NAV_ITEMS = [
    { href: resolve('/'),       icon: 'home',           alt: 'Home'   },
    { href: resolve('/sounds'), icon: 'guitar_strings', alt: 'Sounds' },
    { href: resolve('/colors'), icon: 'color_pallete',  alt: 'Colors' },
  ] as const;

  const pathname = $derived(page.url.pathname);
</script>

<svelte:window onscroll={onScroll} />

<header class:hidden>
  <nav>
    {#each NAV_ITEMS as { href, icon, alt }}
      <a {href} class:active={pathname === href}>
        <img src={`${assetBase}/icons/${icon}.svg`} {alt} class="nav-icon" />
      </a>
    {/each}
  </nav>
</header>