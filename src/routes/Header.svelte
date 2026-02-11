<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let hidden = false;
	let lastY = 0;

	function onScroll() {
		const y = window.scrollY;
		const delta = y - lastY;

		// ignore tiny movements
		if (Math.abs(delta) < 5) return;

		// scrolling down → hide, scrolling up → show
		if (delta > 0 && y > 60) {
			hidden = true;
		} else if (delta < 0) {
			hidden = false;
		}

		lastY = y;
	}

	onMount(() => {
		lastY = window.scrollY;
		window.addEventListener('scroll', onScroll, { passive: true });
	});

	onDestroy(() => {
		window.removeEventListener('scroll', onScroll);
	});
</script>

<header class:hidden={hidden}>
	<nav>
		<a href="/"><img src="/icons/home.svg" alt="Home" class="nav-icon" /></a>
		<a href="/about"><img src="/icons/info.svg" alt="Info" class="nav-icon" /></a>
	</nav>
</header>