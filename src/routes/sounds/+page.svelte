<script lang="ts">
  import {
    NOTES_1_ALL,
    NEW_NOTES_1_ALL,
    MODES,
    NEW_MODES,
    getScale,
  } from '$lib/utils/sounds';

  import ChordDisplay  from '$lib/components/ChordDisplay.svelte';
  import ScaleDisplay  from '$lib/components/ScaleDisplay.svelte';
  import TuningDisplay from '$lib/components/TuningDisplay.svelte';
  import Toast         from '$lib/components/Toast.svelte';
  import ScaleControls from '$lib/components/ScaleControl.svelte';
  import { copyFrequency } from '$lib/utils/clipboard';
  import {
    useNewNaming,
    selectedNoteIndex,
    selectedModeIndex,
  } from '$lib/stores/naming';

  // ── State ─────────────────────────────────────────────────────────────────

  let showToast    = $state(false);
  let toastMessage = $state('');

  // ── Derived ───────────────────────────────────────────────────────────────

  const scale = $derived(getScale(
    $useNewNaming ? NEW_NOTES_1_ALL[$selectedNoteIndex] : NOTES_1_ALL[$selectedNoteIndex],
    $useNewNaming ? NEW_MODES[$selectedModeIndex]       : MODES[$selectedModeIndex],
    true,
    $useNewNaming,
  ));

  // ── Helpers ───────────────────────────────────────────────────────────────

  async function handleCopy(frequency: number) {
    const result = await copyFrequency(frequency);
    toastMessage = result.message;
    showToast    = true;
  }
</script>

<h1>Sounds</h1>

<Toast bind:show={showToast} message={toastMessage} />
<ScaleControls />

<section class="scale-output">
  <h2>Notes in Scale</h2>
  <ScaleDisplay {scale} oncopy={handleCopy} />
</section>

<section class="chord-output">
  <h2>Chords in Scale</h2>
  <ChordDisplay {scale} oncopy={handleCopy} />
</section>

<section>
  <h2>Scale-Based Guitar Tuning</h2>
  <TuningDisplay {scale} oncopy={handleCopy} />
</section>