<script lang="ts">
	import Spacer from './Spacer.svelte';

	export let title: string;
	export let color: string = 'fff';

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

<div class="flex">
	<svg width="22" height="25" viewBox="0 0 72 80" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4 68.26V12.0325C4 7.59627 7.59627 4 12.0325 4H65.8503C67.1812 4 68.26 5.07888 68.26 6.40975V59.0801"
			stroke="#ac65ff"
			stroke-width="4"
			stroke-linecap="round"
		/>
		<path
			d="M20.065 4V36.13L30.1056 29.704L40.1463 36.13V4"
			stroke="#ac65ff"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M12.0325 60.2275H68.26" stroke="#ac65ff" stroke-width="4" stroke-linecap="round" />
		<path d="M12.0325 76.2925H68.26" stroke="#ac65ff" stroke-width="4" stroke-linecap="round" />
		<path
			d="M12.0325 76.2925C7.59627 76.2925 4 72.6963 4 68.26C4 63.8236 7.59627 60.2275 12.0325 60.2275"
			stroke="#ac65ff"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>

	<p>{title}</p>
</div>

<style>
	.flex {
		padding: 10px;
		padding-left: 10px;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.flex p {
		font-size: 15px;
	}
	.flex:hover {
		background-color: #12171f;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
