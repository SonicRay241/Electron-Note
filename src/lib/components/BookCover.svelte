<script lang="ts">
	export let title: string;
	export let color: string = 'fff';
	export let clickFunction: () => void = () => {
		console.log('clicked!');
	};
	export let rightClickFunction: (e: MouseEvent) => void = (e) => {
		e.preventDefault();
		console.log('right clicked!');
	};
	export let note = false;

	const hexRe = new RegExp(/^([0-9, a-f]{1,6})$/g);
	const rgbRe = new RegExp(/^([0-9]{1,3},[\s\S]{0,1}[0-9]{1,3},[\s\S]{0,1}[0-9]{1,3})$/g);

	if (hexRe.test(color)) {
		color = `#${color}`;
	} else if (rgbRe.test(color)) {
		color = `rgb(${color})`;
	} else {
		color = '#fff';
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex" on:click={clickFunction} on:contextmenu={rightClickFunction}>
	{#if note}
		<svg
			width="13.5"
			height="15"
			viewBox="0 0 72 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 68.26V12.0325C4 7.59627 7.59627 4 12.0325 4H65.8503C67.1812 4 68.26 5.07888 68.26 6.40975V59.0801"
				stroke="#ac65ff"
				stroke-width="6.02437"
				stroke-linecap="round"
			/>
			<path
				d="M20.065 4V36.13L30.1056 29.704L40.1463 36.13V4"
				stroke="#ac65ff"
				stroke-width="6.02437"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12.0325 60.2275H68.26"
				stroke="#ac65ff"
				stroke-width="6.02437"
				stroke-linecap="round"
			/>
			<path
				d="M12.0325 76.2925H68.26"
				stroke="#ac65ff"
				stroke-width="6.02437"
				stroke-linecap="round"
			/>
			<path
				d="M12.0325 76.2925C7.59627 76.2925 4 72.6963 4 68.26C4 63.8236 7.59627 60.2275 12.0325 60.2275"
				stroke="#ac65ff"
				stroke-width="6.02437"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg
			width="17.5"
			height="14"
			viewBox="0 0 65 52"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.78815 51.9451H56.339C61.3487 51.9451 64.26 49.0344 64.26 43.2689V13.7979C64.26 8.0325 61.3212 5.14973 55.4993 5.14973H28.2676C26.3645 5.14973 25.2169 4.67398 23.8175 3.49847L22.1103 2.07112C20.2631 0.53175 18.8358 0 16.065 0H7.72465C2.82677 0 0 2.79871 0 8.45224V43.2689C0 49.0623 2.96672 51.9451 8.78815 51.9451ZM4.50609 8.67614C4.50609 5.90538 5.98945 4.50609 8.6482 4.50609H14.9174C16.7646 4.50609 17.8842 4.95377 19.3115 6.18529L21.0188 7.58458C22.8379 9.096 24.3213 9.65569 27.092 9.65569H55.4157C58.1865 9.65569 59.7536 11.1391 59.7536 14.0498V15.7291H4.50609V8.67614ZM8.8721 47.4391C6.07339 47.4391 4.50609 45.9558 4.50609 43.045V19.9553H59.7536V43.073C59.7536 45.9558 58.1865 47.4391 55.4157 47.4391H8.8721Z"
				fill="#ac65ff"
			/>
		</svg>
	{/if}

	<p>{title}</p>
</div>

<style>
	.flex {
		padding: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.flex svg {
		min-width: 13.5px;
		min-height: 15px;
	}
	.flex p {
		font-size: 13px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.flex:hover {
		background-color: #a0a0a040;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
