<script lang="ts">
  import { assetBase } from '$lib/utils/paths';

  const currentYear = new Date().getFullYear();
</script>

<footer>
  <span>&copy;{currentYear}</span>
  <span>Filip Kačić</span>
  <a href="mailto:filipkacic@protonmail.com">
    <img src="{assetBase}/icons/email.svg" alt="Email" class="nav-icon">
  </a>
</footer>