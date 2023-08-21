<script lang="ts">
	export let os: string;
	let evt: WheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaX: 134 });
	let tabWrapper: HTMLElement;

	let width = 'width: calc(100vw - 12rem - 127px);';

	if (os == 'darwin') {
		width = 'width: calc(100vw - 12rem + 4px)';
	}
</script>

<div class="wholewrapper">
	<div class="tabwrapper" style={width} bind:this={tabWrapper}>
		<div class="tabs" style="">
			<slot />
		</div>
	</div>
	{#if os != 'darwin'}
		<div class="draggybit" />
	{/if}
</div>

<style>
	.draggybit {
		-webkit-app-region: drag;
		width: 137px;
		/* background-color: #1f2329; */
		background-color: transparent;
		/* border-left: 1px solid #283241; */
		/* border-bottom: 1px solid #283241; */
	}
	.wholewrapper {
		display: flex;
		-webkit-app-region: drag;
	}
	.tabs {
		width: fit-content;
		display: flex;
		height: 40px;
		gap: 0;
		-webkit-app-region: no-drag;
	}
	.tabwrapper {
		overflow-x: scroll;
		overflow-y: hidden;
		background-color: transparent;
	}
	::-webkit-scrollbar {
		display: none;
	}
</style>
