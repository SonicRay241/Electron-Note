<script lang="ts">
	// import Muya from '@marktext/muya';

	// const container: HTMLElement = document.querySelector('#editor')!;
	// const muya = new Muya(container);
	import { onMount } from 'svelte';
	import '$lib/css/editorjs.css';

	onMount(async () => {
		const EditorJS = (await import('@editorjs/editorjs')).default;
		const Header = (await import('@editorjs/header')).default;
		const List = (await import('@editorjs/list')).default;
		const editor = new EditorJS({
			tools: {
				header: Header,
				list: List,
			},
		});
	});
</script>

<div id="editorjs" />
