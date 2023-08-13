<script lang="ts">
	import '@fontsource/montserrat';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import '$lib/css/app.css';
	import { Toaster } from 'svelte-french-toast';

	onMount(() => {
		window.electron.send('readAppData', null);
	});

	export let data;
</script>

<Toaster containerStyle="margin-top: 40px" />
{#if data.url != '/new'}
	<div class="bar">
		<!-- <div class="title">
			<p>Livre</p>
		</div> -->
	</div>
{/if}
{#key data.url}
	<div class="screen-window" transition:fade>
		<slot />
	</div>
{/key}
<div class="dev-tag">
	<p>ALPHA</p>
</div>

<style>
	.dev-tag {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		background-color: #ff3e3e;
		width: fit-content;
		padding: 5px;
		border-radius: 5px;
	}
	.dev-tag p {
		font-size: 10px;
		font-weight: 600;
		color: white;
	}
	.screen-window {
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 100vh;
	}
	.bar {
		position: fixed;
		width: 100%;
		height: 10px;
		user-select: none;
		/* background-color: #0d1117; */
		/* border-bottom: 1px double var(--accent-color); */
		-webkit-user-select: none;
		-webkit-app-region: drag;
		z-index: 999999;
	}
	.title p {
		display: flex;
		justify-content: center;
		margin-top: 0.5rem;
		/* transform: translateX(-50%); */
		font-weight: 600;
	}
</style>
