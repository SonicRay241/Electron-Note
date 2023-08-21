<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let a = { path: '', data: '' };
	onMount(() => {
		window.electron.receive('getData', (data: any) => {
			a = data;
		});
		window.setInterval(function () {
			if (a.data != '') {
				if (a.data == null) {
					// postData('/app?/moveToNew', { data: 0 }, 'POST');
					goto('/new');
				}
			}
		}, 200);
	});
</script>

<slot />
