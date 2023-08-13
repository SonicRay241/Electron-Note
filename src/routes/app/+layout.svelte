<script lang="ts">
	import { onMount } from 'svelte';
	let a = { path: '', data: '' };
	onMount(() => {
		window.electron.receive('getData', (data: any) => {
			a = data;
		});
		function postData(path: string, params: any, method: 'POST' | 'GET') {
			// Create form
			const hidden_form = document.createElement('form');

			// Set method to post by default
			hidden_form.method = method || 'POST';

			// Set path
			hidden_form.action = path;

			for (const key in params) {
				if (params.hasOwnProperty(key)) {
					const hidden_input = document.createElement('input');
					hidden_input.type = 'hidden';
					hidden_input.name = key;
					hidden_input.value = params[key];

					hidden_form.appendChild(hidden_input);
				}
			}

			document.body.appendChild(hidden_form);
			hidden_form.submit();
		}
		window.setInterval(function () {
			if (a.data != '') {
				if (a.data == null) {
					postData('/app?/moveToNew', { data: 0 }, 'POST');
				}
			}
		}, 200);
	});
</script>

<slot />
