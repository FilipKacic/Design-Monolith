<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';

	let hidden = false;
	let lastY = 0;

	let scrollListener: () => void;

	onMount(() => {
		lastY = window.scrollY;

		scrollListener = () => {
			const y = window.scrollY;
			const delta = y - lastY;

			if (Math.abs(delta) < 5) return;

			if (delta > 0 && y > 60) {
				hidden = true;
			} else if (delta < 0) {
				hidden = false;
			}

			lastY = y;
		};

		window.addEventListener('scroll', scrollListener, { passive: true });
	});

	onDestroy(() => {
		if (scrollListener) window.removeEventListener('scroll', scrollListener);
	});

	const isActive = (href: string) => page.url.pathname === href;
</script>

<header class:hidden={hidden}>
	<nav>
		<a href="/" class:active={isActive('/')}>
			<img src="/icons/home.svg" alt="Home" class="nav-icon" />
		</a>
		<a href="/guitar" class:active={isActive('/guitar')}>
			<img src="/icons/guitar_strings.svg" alt="Guitar Strings" class="nav-icon" />
		</a>
		<a href="/about" class:active={isActive('/about')}>
			<img src="/icons/info.svg" alt="Info" class="nav-icon" />
		</a>
	</nav>
</header>
