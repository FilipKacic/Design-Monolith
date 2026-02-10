<script lang="ts">
	type Mode = 'Sound' | 'Color';
	let mode: Mode = 'Sound';

	function toggle() {
		mode = mode === 'Sound' ? 'Color' : 'Sound';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}
</script>

<div
	class="switch"
	role="radiogroup"
	aria-label="Design mode"
	tabindex="0"
	on:keydown={handleKeydown}
>
	<button
		type="button"
		role="radio"
		aria-checked={mode === 'Sound'}
		class="label sound"
		on:click={toggle}
	>
		Sound
	</button>

	<button
		type="button"
		role="radio"
		aria-checked={mode === 'Color'}
		class="label color"
		on:click={toggle}
	>
		Color
	</button>

	<span class="thumb" class:color={mode === 'Color'}></span>
</div>

<style>
	.switch {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 160px;
		height: 40px;
		padding: 4px;
		border-radius: 999px;
		border: 1px solid #ccc;
		background: #eee;
		user-select: none;
	}

	.label {
		flex: 1;
		text-align: center;
		font-size: 0.85rem;
		cursor: pointer;
		border: none;
		background: none;
		z-index: 2;
		color: #555;
	}

	.thumb {
		position: absolute;
		top: 4px;
		left: 4px;
		width: calc(50% - 4px);
		height: calc(100% - 8px);
		background: white;
		border-radius: 999px;
		transition: transform 0.25s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	}

	.thumb.color {
		transform: translateX(100%);
	}

	.label[aria-checked="true"] {
		color: #111;
		font-weight: 600;
	}

	.switch:focus-visible {
		outline: 2px solid #6366f1;
		outline-offset: 2px;
	}
</style>
