<script lang="ts">
	let evt: WheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaX: 134 });
	let tabWrapper: HTMLElement;

	export let moveTab = () => {
		tabWrapper.dispatchEvent(evt);
		console.log('a');
	};
</script>

<div class="wholewrapper">
	<div
		class="tabwrapper"
		on:wheel={(e) => {
			e.preventDefault();
			e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
		}}
		bind:this={tabWrapper}
	>
		<div class="tabs" style="">
			<slot />
		</div>
	</div>
	<div class="draggybit" />
</div>

<style>
	.draggybit {
		-webkit-app-region: drag;
		width: 137px;
		background-color: #0d1117;
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
		overflow-x: hidden;
		overflow-y: hidden;
		background-color: #0d1117;
		width: calc(100vw - 12rem - 127px);
	}
</style>
