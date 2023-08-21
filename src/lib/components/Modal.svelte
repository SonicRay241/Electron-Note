<script lang="ts">
	import Spacer from './Spacer.svelte';
	import { fly, fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	export let enabled = false;
	export let title = 'Modal';
	export let confirmFunction = () => {};
	export let confirmName = 'OK';
</script>

{#if enabled}
	<div class="modal-wrapper" transition:fade={{ duration: 300, easing: quadInOut }}>
		<div class="modal" transition:fly={{ y: -80, duration: 300, easing: quadInOut }}>
			<h4>{title}</h4>
			<Spacer space={1} />
			<div class="slot">
				<slot />
			</div>
			<div class="bottom-group">
				<div class="right-side">
					<div class="buttons-wrapper">
						<button
							class="cancel-button"
							on:click={() => {
								enabled = false;
							}}
						>
							Cancel
						</button>
						<button class="confirm-button" on:click={confirmFunction}>
							{confirmName}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-wrapper {
		display: flex;
		position: fixed;
		height: 100vh;
		width: 100vw;
		justify-content: center;
		align-items: center;
		background-color: #1116;
	}
	.modal {
		background-color: var(--editor-background);
		min-width: 300px;
		min-height: 100px;
		border-radius: 0.75rem;
		border: 1px solid #3f3f3f;
		filter: drop-shadow(5px 5px 10px rgb(0 0 0 / 0.4));
		padding: 1rem;
		z-index: 99999;
	}
	.bottom-group {
		position: absolute;
		width: calc(100% - 2rem);
		border-top: 1px solid #3f3f3f;
		bottom: 1rem;
		padding-top: 1rem;
	}
	.right-side {
		display: flex;
		float: right;
	}
	.buttons-wrapper {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.buttons-wrapper button {
		border-radius: 0.38rem;
		min-width: 5rem;
		cursor: pointer;
		height: 1.5rem;
		border: 1px solid #000c;
		filter: drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4));
	}
	.confirm-button {
		background-color: var(--accent-color);
	}
	.cancel-button {
		background-color: #676767;
		color: white;
	}
	.slot {
		margin-bottom: 4rem;
	}
</style>
