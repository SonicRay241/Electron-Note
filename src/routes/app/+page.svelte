<script lang="ts">
	import { onMount } from 'svelte';
	import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
	import type { Library, MainData, Book, Note } from '$lib/dataType';
	import Spacer from '$lib/components/Spacer.svelte';
	import { fade } from 'svelte/transition';
	import { renderMd } from '$lib/renderMarkdown';
	import TabGroup from '$lib/components/TabGroup.svelte';
	import Tab from '$lib/components/Tab2.svelte';
	import BookCover from '$lib/components/BookCover.svelte';

	const emptyNote: Note = {
		id: 'none',
		images: {},
		noteData: '# Welcome to Livre\n Please select or create a note from the sidebar',
		title: 'Welcome',
	};
	let mainData: MainData;

	let tabs: Note[] = [emptyNote, emptyNote, emptyNote, emptyNote];

	let currentTab = 0;
	let search = '';

	let sidebarBook: Book;
	let sidebarNote: Note;

	let mdview: HTMLElement;
	let editor: HTMLElement;
	let mdviewWidth;
	let editorWidth;

	let refresh: boolean = true;

	onMount(() => {
		window.electron.receive('getData', (data: any) => {
			mainData = data;
		});
		setTimeout(() => {
			console.log(mainData.data?.data);
		}, 2000);

		mdviewWidth = mdview.clientWidth;
		editorWidth = editor.clientWidth;
	});

	const closeTab = (i: number) => {
		tabs.splice(i, 1);
		tabs = tabs;
		console.log(tabs);

		console.log(tabs.toString());

		if (tabs.length == 0) {
			tabs = [...tabs, emptyNote];
		}
		if (currentTab != 0 && currentTab >= i) {
			currentTab = currentTab - 1;
		}
	};
	const openTab = (i: number) => {
		console.log('testing...');
		currentTab = i;
	};
	const moveTabPlus = (detail: ShortcutEventDetail) => {
		console.log('attached node:', detail.node);
		console.log('original trigger config:', detail.trigger);
		if (currentTab == tabs.length - 1) {
			currentTab = 0;
		} else {
			currentTab += 1;
		}
	};
	const moveTabMinus = (detail: ShortcutEventDetail) => {
		console.log('attached node:', detail.node);
		console.log('original trigger config:', detail.trigger);
		if (currentTab == 0) {
			currentTab = tabs.length - 1;
		} else {
			currentTab -= 1;
		}
	};
	const newTab = () => {
		tabs = [...tabs, emptyNote];
		currentTab = tabs.length - 1;
	};
</script>

<svelte:window
	use:shortcut={{
		trigger: [
			{ key: 'Tab', modifier: ['ctrl'], callback: moveTabPlus },
			{ key: 'Tab', modifier: ['shift'], callback: moveTabMinus },
		],
	}}
/>
{#if mainData}
	{#if mainData.data}
		<main class="main-wrapper">
			<div class="sidebar" bind:this={mdview}>
				{#each mainData.data.data as book}
					<BookCover title={book.name} color={book.color} />
				{/each}
			</div>
			<!-- <div class="resizer" on:mousedown={onResizer1Drag} /> -->
			<div class="md-view" bind:this={editor}>
				<TabGroup>
					{#if refresh}
						{#each tabs as tab, i}
							{#if i == currentTab}
								<Tab
									name={tab.title}
									close={() => {
										closeTab(i);
									}}
									open={() => {
										openTab(i);
									}}
									selected={true}
								/>
							{:else}
								<Tab
									name={tab.title}
									close={() => {
										closeTab(i);
									}}
									open={() => {
										openTab(i);
									}}
								/>
							{/if}
						{/each}
						<div class="add-button">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<svg
								width="22"
								height="22"
								viewBox="0 0 64 64"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								on:click={newTab}
							>
								<path
									d="M50.5 30.5H35.5V15.5C35.5 14.837 35.2366 14.2011 34.7678 13.7322C34.2989 13.2634 33.663 13 33 13C32.337 13 31.7011 13.2634 31.2322 13.7322C30.7634 14.2011 30.5 14.837 30.5 15.5V30.5H15.5C14.837 30.5 14.2011 30.7634 13.7322 31.2322C13.2634 31.7011 13 32.337 13 33C13 33.663 13.2634 34.2989 13.7322 34.7678C14.2011 35.2366 14.837 35.5 15.5 35.5H30.5V50.5C30.5 51.163 30.7634 51.7989 31.2322 52.2678C31.7011 52.7366 32.337 53 33 53C33.663 53 34.2989 52.7366 34.7678 52.2678C35.2366 51.7989 35.5 51.163 35.5 50.5V35.5H50.5C51.163 35.5 51.7989 35.2366 52.2678 34.7678C52.7366 34.2989 53 33.663 53 33C53 32.337 52.7366 31.7011 52.2678 31.2322C51.7989 30.7634 51.163 30.5 50.5 30.5Z"
									fill="#a0a0a0"
								/>
							</svg>
						</div>
					{/if}
				</TabGroup>
				<div class="editor">
					<!-- {currentTab}
					<div
						class="a"
						on:click={() => {
							closeTab(currentTab);
						}}
					>
						try to close this
					</div> -->
					{@html renderMd(tabs[currentTab].noteData)}
				</div>
			</div>
		</main>
	{/if}
{/if}

<style>
	.add-button {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.add-button svg {
		padding: 2px;
		border-radius: 5px;
	}
	.add-button svg:hover {
		background-color: #12171f;
	}
	.editor {
		height: 100%;
		padding: 1rem;
		padding-bottom: 0;
		box-sizing: border-box;
	}
	.main-wrapper {
		display: flex;
		height: 100vh;
		box-sizing: border-box;
	}
	.sidebar {
		width: 12rem;
		padding: 1rem;
	}
	.md-view {
		width: 100%;
		background-color: #12171f;
	}
</style>
