<script lang="ts">
	export let enabled = false;
	export let length = 0;
</script>

{#if enabled && length > 0}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="out-bounds"
		on:click={() => {
			enabled = false;
		}}
	/>
	<div class="modal-wrapper">
		<div class="modal">
			<h2>Jump to...</h2>
			<slot />
		</div>
	</div>
{/if}

<style>
	.out-bounds {
		background-color: transparent;
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 5;
	}
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
</style>
