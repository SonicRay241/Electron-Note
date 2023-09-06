<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let path: string;

	$: path = data.path;
</script>

<img src="file://{path}" alt="" />
