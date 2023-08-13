<script lang="ts">
	import '$lib/css/editor.css';
	import '$lib/css/shades-of-purple.css';
	import MarkdownIt from 'markdown-it';
	import { afterUpdate, onMount } from 'svelte';
	import hljs from 'highlight.js';

	const md = new MarkdownIt();

	let markdown = '';
	let result = '';

	let anchors = '';
	let innerHeight: number;

	let menu: HTMLElement;
	let mdEditor: HTMLElement;

	onMount(() => {
		innerHeight = window.innerHeight;

		document.onclick = hideMenu;
		// document.oncontextmenu = rightClick;
		mdEditor.oncontextmenu = rightClick;

		function hideMenu() {
			menu.style.display = 'none';
		}

		function rightClick(e: any) {
			e.preventDefault();
			console.log('clicked');

			if (menu.style.display == 'block') hideMenu();
			else {
				menu.style.display = 'block';
				menu.style.left = e.pageX + 'px';
				menu.style.top = e.pageY + 'px';
			}
		}
	});

	afterUpdate(() => {
		// result = sanitizeHtml(md.render(markdown), {
		// 	allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'h1', 'h2', 'img' ])
		// });

		let ree = markdown.replaceAll('\n', '\n[//s.#$]\n');
		console.log(ree);

		result = md.render(ree);
		result = result.replaceAll('[//s.#$]', '<br>');
		const re = new RegExp(/<code>[\s\S]*?<\/code>/g);
		const codes = result.matchAll(re);
		for (let code of codes) {
			let innerCode = code.toString().slice(6).slice(0, -7);
			if (innerCode[-1] === ' ' || '\n') {
				innerCode.slice(0, -1);
			}
			innerCode = innerCode.replaceAll('&quot;', '"');
			innerCode = innerCode.replaceAll('&lt;', '<');
			innerCode = innerCode.replaceAll('&gt;', '>');
			innerCode = innerCode.replaceAll('&amp;', '&');
			innerCode = innerCode.replaceAll('<br>', '');
			let outputCode = hljs.highlightAuto(innerCode).value.toString();
			outputCode = outputCode.replaceAll('\n\n', '<br>');
			result = result.replace(code.toString(), outputCode);
		}
		const reId = result.matchAll(new RegExp(/<h[1-6]>[\s\S]*?{#\s?[\S]+?}<\/h[1-6]>/g));
		for (let header of reId) {
			let innerHead = header.toString().slice(4).slice(0, -5);
			const idTag = innerHead
				.match(new RegExp(/\{#\s?[\S]+?}/g))
				?.toString()
				.slice(2)
				.slice(0, -1)
				.trim();
			const headerContent = innerHead.replace(new RegExp(/\{#\s?[\S]+?}/g), '');
			const headerLvl = header.toString()[2];

			const output = `<h${headerLvl} id="${idTag}">${headerContent}</h${headerLvl}>`;
			console.log(innerHead);

			result = result.replace(header.toString(), output);

			// searchHeaders.push(idTag?.toString() ?? "")
		}

		result = result.replaceAll('<pre>', "<pre class='hljs'>");
		result = result.replaceAll(new RegExp(/<h[4-6]>/g), '<h3>');

		const aTags = result.matchAll(new RegExp(/<a href=".*?">/g));
		for (let anchor of aTags) {
			let b = '';
			b += anchor.toString().slice(0, -1);
			b += ' target="_blank">';
			anchors += b;
			result = result.replace(anchor.toString(), b);
		}

		const superScripts = result.matchAll(/\^[0-9]+?\^/g);
		for (let sup of superScripts) {
			let out = `<sup>${sup.toString().slice(1).slice(0, -1)}</sup>`;
			result = result.replace(sup.toString(), out);
		}

		const subScripts = result.matchAll(/~[0-9]+?~/g);
		for (let sub of subScripts) {
			let out = `<sub>${sub.toString().slice(1).slice(0, -1)}</sub>`;
			result = result.replace(sub.toString(), out);
		}
	});
</script>

<svelte:window bind:innerHeight />

<div id="contextMenu" class="context-menu" style="display:none" bind:this={menu}>
	<ul>
		<li><a href="#">Element-1</a></li>
		<li><a href="#">Element-2</a></li>
		<li><a href="#">Element-3</a></li>
		<li><a href="#">Element-4</a></li>
		<li><a href="#">Element-5</a></li>
		<li><a href="#">Element-6</a></li>
		<li><a href="#">Element-7</a></li>
	</ul>
</div>

<div class="markdown-editor">
	<div class="markdown-editor__panel" style="height: {innerHeight - 40}px;">
		<span class="markdown-editor__panel__label">Markdown</span>
		<textarea
			class="markdown-editor__textarea"
			bind:value={markdown}
			bind:this={mdEditor}
			on:keydown={(e) => {
				if (e.key == 'Tab') {
					e.preventDefault();
					const area = e.currentTarget;
					const start = area.selectionStart;
					const end = area.selectionEnd;

					area.value = area.value.substring(0, start) + '\t' + area.value.substring(end);

					area.selectionStart = area.selectionEnd = start + 1;
				}
			}}
		/>
	</div>
	<div class="markdown-editor__panel">
		<span class="markdown-editor__panel__label">Output</span>
		<div class="markdown-editor__result-html">
			<div>
				{@html result}
			</div>
		</div>
	</div>
</div>

<style>
	.context-menu {
		position: absolute;
		text-align: center;
		background: lightgray;
		border: 1px solid black;
	}

	.context-menu ul {
		padding: 0px;
		margin: 0px;
		min-width: 150px;
		list-style: none;
	}

	.context-menu ul li {
		padding-bottom: 7px;
		padding-top: 7px;
		border: 1px solid black;
	}

	.context-menu ul li a {
		text-decoration: none;
		color: black;
	}

	.context-menu ul li:hover {
		background: darkgray;
	}
</style>
