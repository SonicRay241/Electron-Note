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
		// function postData(path: string, params: any, method: 'POST' | 'GET') {
		// 	// Create form
		// 	const hidden_form = document.createElement('form');

		// 	// Set method to post by default
		// 	hidden_form.method = method || 'POST';

		// 	// Set path
		// 	hidden_form.action = path;

		// 	for (const key in params) {
		// 		if (params.hasOwnProperty(key)) {
		// 			const hidden_input = document.createElement('input');
		// 			hidden_input.type = 'hidden';
		// 			hidden_input.name = key;
		// 			hidden_input.value = params[key];

		// 			hidden_form.appendChild(hidden_input);
		// 		}
		// 	}

		// 	document.body.appendChild(hidden_form);
		// 	hidden_form.submit();
		// }
		window.setInterval(function () {
			if (a.data != '') {
				if (a.data == null) {
					// postData('?/moveToNew', { data: 0 }, 'POST');
					goto('/new');
				} else {
					// postData('/new?/moveToApp', { data: 0 }, 'POST');
					goto('/app');
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
