<script lang="ts">
	// dynamic list from parent
	export let Wheel: readonly string[] = []; 

	// parent callback
	export let onChange: ((args: { value: string; index: number }) => void) | null = null;

	let currentIndex = 0;

	function next() {
		currentIndex = (currentIndex + 1) % Wheel.length;
		callOnChange();
	}

	function previous() {
		currentIndex = (currentIndex - 1 + Wheel.length) % Wheel.length;
		callOnChange();
	}

	// reactive values
	$: previousValue = Wheel[(currentIndex - 1 + Wheel.length) % Wheel.length];
	$: currentValue = Wheel[currentIndex];
	$: nextValue = Wheel[(currentIndex + 1) % Wheel.length];

	function callOnChange() {
		if (onChange) onChange({ value: currentValue, index: currentIndex });
	}
</script>

<div class="circular-nav-container">
	<div class="previous-display">{previousValue}</div>

	<button class="nav-button previous" on:click={previous}>◀</button>

	<button class="current-display">{currentValue}</button>

	<button class="nav-button next" on:click={next}>▶</button>

	<div class="next-display">{nextValue}</div>
</div>

<style>
.circular-nav-container {
	display: flex;
	align-items: bottom;
	justify-content: center;
	color: var(--Black);
	background-color: var(--White);
	margin-top: var(--Line);
}

.previous-display, .next-display {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--Gray);
	min-width: var(--Hexagon);
}

.nav-button {
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--Black);
	background: var(--White);
	border: none;
	padding: var(--Line) var(--Triangle);
	box-shadow: 0 var(--Hairline) var(--HolyTrinity) var(--Shadow);
	transition: background 0.2s, transform 0.2s;
	min-width: var(--Triangle);
}

.nav-button:hover { background: var(--LightGray); }
.nav-button.previous:hover { transform: translateX(-1px); }
.nav-button.next:hover { transform: translateX(1px); }

.current-display {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--White);
	background: var(--Black);
	border: none;
	padding: var(--Line) var(--Triangle);
	box-shadow: 0 var(--Hairline) var(--HolyTrinity) var(--Shadow);
	font-weight: bold;
	font-size: var(--Strong);
	min-width: var(--Space);
}
</style>
