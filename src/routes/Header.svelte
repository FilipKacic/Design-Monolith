<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let hidden = false;
	let lastY = 0;
	let ticking = false;

	/* -------------------------------------------
	   Reactive Route State (auto-subscribed)
	------------------------------------------- */
	$: pathname = $page.url.pathname;

	/* -------------------------------------------
	   Theme — purely reactive (no lifecycle)
	------------------------------------------- */
	$: if (browser) {
		document.body.classList.toggle('night', pathname === '/stars');
	}

	/* -------------------------------------------
	   Scroll Handling (rAF throttled)
	------------------------------------------- */
	function handleScroll() {
		if (!browser) return;

		const y = window.scrollY;
		const delta = y - lastY;

		if (Math.abs(delta) < 5) return;

		hidden = delta > 0 && y > 60;
		lastY = y;
	}

	function onScroll() {
		/* requestAnimationFrame = free performance win */
		if (!ticking) {
			requestAnimationFrame(() => {
				handleScroll();
				ticking = false;
			});
			ticking = true;
		}
	}

	const isActive = (href: string) => pathname === href;
</script>

<svelte:window on:scroll={onScroll} />

<header class:hidden={hidden}>
	<nav>
		<a href="/" class:active={isActive('/')}>
			<img src="/icons/home.svg" alt="Home" class="nav-icon" />
		</a>

		<a href="/sounds" class:active={isActive('/sounds')}>
			<img src="/icons/guitar_strings.svg" alt="Guitar Strings" class="nav-icon" />
		</a>

		<a href="/colors" class:active={isActive('/colors')}>
			<img src="/icons/color_pallete.svg" alt="Color Pallete" class="nav-icon" />
		</a>

		<a href="/stars" class:active={isActive('/stars')}>
			<img src="/icons/stars.svg" alt="Stars" class="nav-icon" />
		</a>
	</nav>
</header>
