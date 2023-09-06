<script lang="ts">
	import '$lib/css/blocks.css';
	import '$lib/css/katex.css';

	export let mdValue: string;
	let blockValues: string[];

	$: blockValues = mdValue.split('```');

	$: blockValues = splitBlocks(blockValues);
	function splitBlocks(inputValue: string[]) {
		let returnArray: string[] = [];
		for (let i = 0; i < inputValue.length; i++) {
			if (i % 2 != 0) {
				returnArray = [...returnArray, ...inputValue[i].split('\n')];
			} else {
				returnArray = [...returnArray, inputValue[i]];
			}
		}
		return returnArray;
	}

	function writeMarkdown() {
		mdValue = blockValues.join('\n');
	}

	function renderBlock(value: string) {
		if (/> [\s\S]+?/g.test(value)) {
			return 'block-blockquote';
		}
		if (/### [\s\S]+?/g.test(value)) {
			return 'block-h3';
		}
		if (/## [\s\S]+?/g.test(value)) {
			return 'block-h2';
		}
		if (/# [\s\S]+?/g.test(value)) {
			return 'block-h1';
		}
	}
</script>

{#each blockValues as blockValue, i}
	{i}
	<div
		class="block {renderBlock(blockValue)}"
		id="block-{i}"
		contenteditable="true"
		on:keydown={(e) => {
			if (e.key == 'Enter') {
				e.preventDefault();
				let p1 = blockValues.slice(0, i + 1);
				let p2 = blockValues.slice(i + 1);
				blockValues = [...p1, '', ...p2];
				setTimeout(() => {
					document.getElementById(`block-${i + 1}`)?.focus();
				}, 1);
			}
			if (e.key == 'Backspace') {
				if (blockValue == '' || blockValue == '\n') {
					if (i != 0) {
						e.preventDefault();
						let p1 = blockValues.slice(0, i);
						let p2 = blockValues.slice(i + 1);
						blockValues = [...p1, ...p2];
						setTimeout(() => {
							document.getElementById(`block-${i - 1}`)?.focus();
						}, 1);
					}
				}
			}
			if (e.key == 'ArrowDown') {
				if (i != blockValues.length - 1) {
					document.getElementById(`block-${i + 1}`)?.focus();
				}
			}
			if (e.key == 'ArrowUp') {
				if (i != 0) {
					document.getElementById(`block-${i - 1}`)?.focus();
				}
			}
			if (e.key == 'Tab') {
				e.preventDefault();
			}
			setTimeout(() => {
				blockValues[i] = document.getElementById(`block-${i}`)?.innerHTML ?? '';
				console.log(blockValues[i]);
			}, 1);
			// writeMarkdown();
		}}
	>
		{blockValue}
	</div>
{/each}
