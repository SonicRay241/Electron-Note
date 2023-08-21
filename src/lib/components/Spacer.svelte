<script>
	export let space = 3;
	export let draggable = false;
</script>

{#if draggable}
	<div style="height: {space}em;-webkit-app-region: drag;" />
{:else}
	<div style="height: {space}em;" />
{/if}
