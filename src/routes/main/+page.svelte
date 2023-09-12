<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let innerHeight: number = 400;
	let a = { path: '', data: '' };
	let viewLoader = false;

	onMount(() => {
		setTimeout(() => {
			viewLoader = true;
		});
		innerHeight = window.innerHeight;
		window.electron.receive('getData', (data: any) => {
			a = data;
		});
		window.setInterval(function () {
			if (a.data != '') {
				if (a.data == null) {
					goto('/main/new');
				} else {
					goto('/main/app');
				}
			}
		}, 200);
	});
</script>

<svelte:window bind:innerHeight />

{#if viewLoader}
	<main class="center" style="height: {innerHeight - 150}px;">
		<div class="loader" />
	</main>
{/if}

<style>
	.loader {
		box-shadow: 1px 2px 1px #ac65ff;
		border-radius: 50%;
		width: 80px;
		height: 80px;
		animation: spin 2s ease-in-out infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(20deg);
		}
		100% {
			transform: rotate(380deg);
		}
	}
	.center {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
