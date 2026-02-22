<script lang="ts">
  import '../app.css';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <title>Design Monolith</title>

  <!-- Identity -->
  <meta name="application-name" content="Design Monolith" />
  <meta name="author"           content="Filip Kačić" />
  <meta name="description"      content="A collection of audio-visual design tools." />
  <meta name="keywords"         content="audio, visual, design" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:locale"      content="en_US" />
  <meta property="og:site_name"   content="Design Monolith" />
  <meta property="og:title"       content="Design Monolith" />
  <meta property="og:description" content="A collection of audio-visual design tools." />
  <meta property="og:url"         content="https://filipkacic.github.io/Design-Monolith/" />
  <meta property="og:image"       content="https://filipkacic.github.io/Design-Monolith/og-image.png" />

  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<main>
  {@render children()}
</main>
<Footer />