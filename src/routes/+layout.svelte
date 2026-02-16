<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>
		Design Monolith
	</title>

	<meta charset="utf-8" />
	<meta name="application-name" content="Audio Visual Design Monolith" />
	<meta name="author" content="Filip Kačić">
	<meta name="description" content="A collection of audio-visual design tools on a monolithic web application.">
	<meta name="keywords" content="audio, visual, design">
	<meta name="generator" content="SvelteKit">
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Design Monolith" />
	<meta property="og:description" content="A collection of audio-visual design tools." />
	<meta property="og:url" content="https://mydomain.com/" />
	<meta property="og:image" content="https://mydomain.com/og-image.png" />
	<meta property="og:site_name" content="Design Monolith" />
	<meta property="og:locale" content="en_US" />
	
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main>
  {@render children()}
</main>

<Footer />
