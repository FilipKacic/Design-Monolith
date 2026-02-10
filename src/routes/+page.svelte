<script lang="ts">
    import { onMount } from 'svelte';
	import Wheel from './Wheel.svelte';
	import { COLOR_WHEELS } from '$lib/constants/colors';
    import type { ColorName } from '$lib/constants/colors';
	import { NOTES } from '$lib/constants/sounds';
	import { setBackgroundColor } from '$lib/utils/colorChanger';

	let chromatic: HTMLElement;
	let selectedColor: ColorName = COLOR_WHEELS.chromatic[0];
	let selectedNote: typeof NOTES[number] = NOTES[0];

    // Set initial background color after DOM is ready
	onMount(() => {
		setBackgroundColor(chromatic, { wheel: 'chromatic', index: 0 });
	});

	function handleColorChange({ index }: { index: number }) {
		selectedColor = COLOR_WHEELS.chromatic[index] as ColorName;
		setBackgroundColor(chromatic, { wheel: 'chromatic', index });
	}

	function handleNoteChange({ index }: { index: number }) {
		selectedNote = NOTES[index];
	}
</script>

<h2>
	Chromatic Wheel
</h2>

<Wheel
	Wheel={COLOR_WHEELS.chromatic}
	onChange={handleColorChange} />

<p bind:this={chromatic}>Selected Color: <span>{selectedColor}</span></p>

<h2>Sonic Wheel</h2>
<Wheel
	Wheel={NOTES}
	onChange={handleNoteChange} />

<p>Selected Note: {selectedNote}</p>
