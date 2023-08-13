<script lang="ts">
	export let name = 'default';
	export let selected = false;
	export let close: () => void;
	export let open: () => void;

	let style = 'background-color: #12171f;';
	let color = 'ffffff';

	if (!selected) {
		style = 'background-color: #0d1117;';
		color = 'a0a0a0';
	}
</script>

<div
	class="tab-wrapper"
	on:mouseenter={() => {
		if (!selected) {
			style = 'background-color: #12171f';
		}
	}}
	on:mouseleave={() => {
		if (!selected) {
			style = 'background-color: #0d1117;';
		}
	}}
>
	{#if selected}
		<div class="curve">
			<div class="start-flipped" />
		</div>
	{:else}
		<div class="justamargin" />
	{/if}
	<div class="tab" style="{style}color: #{color};">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="name-wrapper" on:click={open}>
			<span style="margin-right:10px;">{name}</span>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="close-wrapper" on:click={close}>
			<svg
				width="10"
				height="10"
				viewBox="0 0 94 94"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M92.2272 85.6088C92.6622 86.0433 93.0074 86.5592 93.2429 87.1271C93.4785 87.695 93.5998 88.3038 93.6 88.9186C93.6002 89.5334 93.4792 90.1423 93.2441 90.7103C93.0089 91.2784 92.664 91.7946 92.2293 92.2293C91.7946 92.664 91.2784 93.0089 90.7103 93.2441C90.1423 93.4792 89.5334 93.6002 88.9186 93.6C88.3038 93.5998 87.695 93.4785 87.1271 93.2429C86.5592 93.0074 86.0433 92.6622 85.6088 92.2272L46.7979 53.4163L7.98704 92.2272C7.10919 93.104 5.91913 93.5962 4.67845 93.5959C3.43777 93.5955 2.24801 93.1024 1.37072 92.2251C0.49342 91.3479 0.000389271 90.1581 2.3041e-07 88.9174C-0.00038881 87.6767 0.491898 86.4867 1.36864 85.6088L40.1795 46.7979L1.36864 7.98704C0.491898 7.10919 -0.00038881 5.91913 2.3041e-07 4.67845C0.000389271 3.43777 0.49342 2.24801 1.37072 1.37072C2.24801 0.49342 3.43777 0.000389271 4.67845 2.3041e-07C5.91913 -0.00038881 7.10919 0.491898 7.98704 1.36864L46.7979 40.1795L85.6088 1.36864C86.4867 0.491898 87.6767 -0.00038881 88.9174 2.3041e-07C90.1581 0.000389271 91.3479 0.49342 92.2251 1.37072C93.1024 2.24801 93.5955 3.43777 93.5959 4.67845C93.5962 5.91913 93.104 7.10919 92.2272 7.98704L53.4163 46.7979L92.2272 85.6088Z"
					fill="#{color}"
				/>
			</svg>
		</div>
	</div>
	{#if selected}
		<div class="curve">
			<div class="end-flipped" />
		</div>
	{:else}
		<div class="justamargin" />
	{/if}
</div>

<style>
	.justamargin {
		width: 0.5rem;
	}
	.curve {
		background-color: #12171f;
		height: 100%;
		width: 0.5rem;
	}
	.tab-wrapper {
		display: flex;
		padding-top: 5px;
	}
	.start-flipped {
		height: 100%;
		width: 0.5rem;
		background-color: #0d1117;
		border-radius: 0px 0px 0.5rem 0px;
	}
	.end-flipped {
		height: 100%;
		width: 0.5rem;
		background-color: #0d1117;
		border-radius: 0px 0px 0px 0.5rem;
	}
	span {
		font-size: 15px;
	}
	.name-wrapper {
		height: 100%;
		padding: 0.5rem;
		padding-right: 0;
		padding-top: calc(0.5rem - 1px);
	}
	.tab {
		width: fit-content;
		cursor: pointer;
		display: flex;
		height: 100%;
		border-radius: 0.5rem 0.5rem 0px 0px;
	}

	.close-wrapper {
		display: flex;
		padding: 2px;
		width: 1rem;
		height: 1rem;
		justify-content: center;
		align-items: center;
		border-radius: 3px;
		margin-top: calc(0.5rem - 1px);
		margin-right: 0.5rem;
	}

	.close-wrapper:hover {
		background-color: #1d2430;
	}
</style>
