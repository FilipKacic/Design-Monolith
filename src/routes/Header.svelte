<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';

    // Strip trailing slash to get bare base prefix for assets
    const assetBase = resolve('/').replace(/\/$/, '');

    let hidden = $state(false);
    let lastY = 0;
    let ticking = false;

    const pathname = $derived(page.url.pathname);

    $effect(() => {
        document.body.classList.toggle('night', pathname === resolve('/stars'));
    });

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const delta = y - lastY;
            if (Math.abs(delta) >= 5) {
                hidden = delta > 0 && y > 60;
                lastY = y;
            }
            ticking = false;
        });
    }

    const isActive = (href: string) => pathname === href;
</script>

<svelte:window onscroll={onScroll} />

<header class:hidden>
    <nav>
        <a href={resolve('/')} class:active={isActive(resolve('/'))}>
            <img src="{assetBase}/icons/home.svg" alt="Home" class="nav-icon" />
        </a>
        <a href={resolve('/sounds')} class:active={isActive(resolve('/sounds'))}>
            <img src="{assetBase}/icons/guitar_strings.svg" alt="Guitar Strings" class="nav-icon" />
        </a>
        <a href={resolve('/colors')} class:active={isActive(resolve('/colors'))}>
            <img src="{assetBase}/icons/color_pallete.svg" alt="Color Palette" class="nav-icon" />
        </a>
        <a href={resolve('/stars')} class:active={isActive(resolve('/stars'))}>
            <img src="{assetBase}/icons/stars.svg" alt="Stars" class="nav-icon" />
        </a>
    </nav>
</header>