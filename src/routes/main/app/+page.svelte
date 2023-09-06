<script lang="ts">
	import { onMount } from 'svelte';
	import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
	import type { Library, MainData, Book, Note } from '$lib/dataType';
	import Spacer from '$lib/components/Spacer.svelte';
	import { renderMd } from '$lib/renderMarkdown';
	import TabGroup from '$lib/components/TabGroup.svelte';
	import Tab from '$lib/components/Tab2.svelte';
	import BookCover from '$lib/components/BookCover.svelte';
	import { generateUID } from '$lib/uidGenerator';
	import Modal from '$lib/components/Modal.svelte';
	import { success, failed } from '$lib/notify';
	import '$lib/css/editor.css';
	import '$lib/css/katex.css';
	// import '$lib/css/shades-of-purple.css';
	// import '$lib/css/tokyo-night-dark.css';
	import '$lib/css/panda-syntax-dark.css';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { jsPDF } from 'jspdf';
	import NewEditor from '$lib/components/NewEditor.svelte';

	let testingMode = false;

	const emptyNote: Note = {
		id: 'none',
		images: {},
		noteData: '# Welcome to Livre\n\nPlease select or create a note from the sidebar',
		title: 'Welcome',
	};
	let mainData: MainData;

	type Editor = {
		isEditing: boolean;
		preview: boolean;
		note: Note;
	};

	let tabs: Editor[] = [{ isEditing: false, preview: false, note: emptyNote }];

	let currentTab = 0;
	let search = '';

	let sidebarBook: Book | null = null;

	let mdview: HTMLElement;
	let editor: HTMLElement;

	let showNewFolderModal = false;
	let newFolderModalValue = 'New Folder';

	let showNewNoteModal = false;
	let newNoteModalValue = 'New Note';

	let renameModalType = 'Folder';
	let showRenameModal = false;
	let renameModalValue = '';

	if (sidebarBook) {
		renameModalType = 'Note';
	} else {
		renameModalType = 'Folder';
	}

	let markdownTextArea: HTMLElement;

	let contextMenu: HTMLElement;

	let newTabOnNoteCreation = false;

	let showContextMenu = false;

	onMount(() => {
		window.electron.receive('getData', (data: any) => {
			mainData = data;
			console.log('got them data');
		});
		setTimeout(() => {
			if (!mainData) {
				location.reload();
			}
		}, 500);

		// fetch('https://api.github.com/repos/microsoft/vscode/releases/latest', {}).then((value) => {
		// 	value.json().then((a) => {
		// 		console.log(a);
		// 	});
		// });

		// mdviewWidth = mdview.clientWidth;
		// editorWidth = editor.clientWidth;
	});

	const closeTab = (i: number) => {
		tabs.splice(i, 1);
		tabs = tabs;
		console.log(tabs);

		console.log(tabs.toString());

		if (tabs.length == 0) {
			tabs = [...tabs, { isEditing: false, preview: false, note: emptyNote }];
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
		tabs = [...tabs, { isEditing: false, preview: false, note: emptyNote }];
		currentTab = tabs.length - 1;
	};

	let inputNameElement: HTMLElement;
	const newFolder = () => {
		mainData.data?.data.push({
			id: generateUID(),
			color: '#fff',
			name: newFolderModalValue,
			notes: [],
		});
		showNewFolderModal = false;
		newFolderModalValue = 'New Folder';
		window.electron.send('writeLibraryFile', mainData.data);
	};

	let inputNoteNameElement: HTMLElement;
	let noteBookIndex: number | null;
	const newNote = () => {
		mainData.data?.data[noteBookIndex!].notes.push({
			id: generateUID(),
			title: newNoteModalValue,
			noteData: `# ${newNoteModalValue}\n---\n`,
			images: [],
		});
		showNewNoteModal = false;
		newNoteModalValue = 'New Note';
		window.electron.send('writeLibraryFile', mainData.data);
		if (newTabOnNoteCreation) {
			setTimeout(() => {
				tabs = [
					...tabs,
					{
						isEditing: false,
						preview: false,
						note: mainData.data?.data[noteBookIndex!].notes[
							mainData.data?.data[noteBookIndex!].notes.length - 1
						]!,
					},
				];
				newTabOnNoteCreation = false;
				currentTab = tabs.length - 1;
			}, 100);
		}
	};

	const showSidebarNotes = (index: number) => {
		if (mainData.data) {
			sidebarBook = mainData.data?.data[index];
			noteBookIndex = index;
		}
	};
	const hideSidebarNotes = () => {
		sidebarBook = null;
		noteBookIndex = null;
	};
	const selectCurrentNote = (book: Book, noteIndex: number) => {
		if (mainData.data) {
			tabs[currentTab].isEditing = false;
			tabs[currentTab].note = book.notes[noteIndex];
		}
	};
	const toggleEditing = (index: number) => {
		if (tabs[index].isEditing) {
			tabs[index].isEditing = false;
			tabs[index].preview = false;
		} else {
			tabs[index].isEditing = true;
		}
	};
	const togglePreview = (index: number) => {
		if (tabs[index].preview) {
			tabs[index].preview = false;
		} else {
			tabs[index].preview = true;
		}
	};
	let contextMenuIndex = 0;
	let contextMenuX = 0;
	let contextMenuY = 0;
	const showContextMenuFunction = (index: number) => {
		showContextMenu = true;
		contextMenuIndex = index;
	};
	const contextMenuDelete = () => {
		if (sidebarBook) {
			sidebarBook.notes.splice(contextMenuIndex, 1);
		} else {
			mainData.data?.data.splice(contextMenuIndex, 1);
		}
		window.electron.send('writeLibraryFile', mainData.data);
	};
	let renameModalInputElement: HTMLElement;
	const contextMenuRename = () => {
		if (sidebarBook) {
			renameModalValue = sidebarBook.notes[contextMenuIndex].title;
		} else {
			renameModalValue = mainData.data!.data[contextMenuIndex].name;
		}

		showRenameModal = true;
		setTimeout(() => {
			renameModalInputElement.focus();
		}, 250);
	};
	const renameFunction = () => {
		if (sidebarBook) {
			sidebarBook.notes[contextMenuIndex].title = renameModalValue;
		} else {
			mainData.data!.data[contextMenuIndex].name = renameModalValue;
		}
		showRenameModal = false;
		renameModalValue = '';
		window.electron.send('writeLibraryFile', mainData.data);
	};
	const contextMenuOpen = () => {
		if (sidebarBook) {
			tabs[currentTab] = {
				isEditing: false,
				preview: false,
				note: sidebarBook.notes[contextMenuIndex],
			};
		} else {
			sidebarBook = mainData.data?.data[contextMenuIndex]!;
		}
	};
	const contextMenuOpenNewTab = () => {
		if (sidebarBook) {
			tabs = [
				...tabs,
				{
					isEditing: false,
					preview: false,
					note: sidebarBook.notes[contextMenuIndex],
				},
			];
			openTab(tabs.length - 1);
		} else {
			failed('what?');
		}
	};
	let showTableOfContents = false;
	let markdownOutput: HTMLElement;
</script>

<svelte:window
	on:click={() => {
		showContextMenu = false;
	}}
	use:shortcut={{
		trigger: [
			{ key: 'ArrowRight', modifier: ['ctrl', 'meta'], callback: moveTabPlus },
			{ key: 'ArrowLeft', modifier: ['ctrl', 'meta'], callback: moveTabMinus },
			{
				key: 'e',
				modifier: [
					['ctrl', 'shift'],
					['meta', 'shift'],
				],
				callback: () => {
					if (tabs[currentTab].note == emptyNote) {
						failed('Please select a note to edit');
					} else {
						setTimeout(() => {
							window.electron.send('writeLibraryFile', mainData.data);
						}, 50);
					}
				},
			},
			{
				key: 'e',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					if (tabs[currentTab].note == emptyNote) {
						failed('Please select a note to edit');
					} else {
						toggleEditing(currentTab);
					}
				},
			},
			{
				key: 's',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					if (tabs[currentTab].isEditing) {
						window.electron.send('writeLibraryFile', mainData.data);
						tabs = [...tabs];
					} else failed('Not in edit mode!');
				},
			},
			{
				key: 'p',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					togglePreview(currentTab);
				},
			},
			{
				key: 'n',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					if (sidebarBook) {
						newTabOnNoteCreation = true;
						showNewNoteModal = true;
					} else {
						failed('Please select a folder');
					}
				},
			},
			{
				key: 't',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					newTab();
				},
			},
			{
				key: 'y',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					closeTab(currentTab);
				},
			},
			{
				key: 'j',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					if (tabs[currentTab].note == emptyNote) {
						failed('Please select a note first');
					} else {
						if (showTableOfContents) {
							showTableOfContents = false;
						} else {
							showTableOfContents = true;
						}
					}
				},
			},
			{
				key: 'd',
				modifier: ['ctrl', 'meta'],
				callback: () => {
					if (!tabs[currentTab].isEditing && tabs[currentTab].note != emptyNote) {
					} else {
						failed('No note selected');
					}
				},
			},
		],
	}}
/>
<!-- New Folder -->
<Modal bind:enabled={showNewFolderModal} title={'New Folder'} confirmFunction={newFolder}>
	<label for="name" class="modal-input-label">Name: &nbsp;</label>
	<input
		type="text"
		name="name"
		id="name"
		class="modal-input"
		bind:value={newFolderModalValue}
		bind:this={inputNameElement}
		on:keydown={(e) => {
			if (e.key == 'Enter') {
				newFolder();
			}
		}}
	/>
</Modal>
<!-- New Note -->
<Modal bind:enabled={showNewNoteModal} title={'New Note'} confirmFunction={newNote}>
	<label for="name" class="modal-input-label">Name: &nbsp;</label>
	<input
		type="text"
		name="name"
		id="name"
		class="modal-input"
		bind:value={newNoteModalValue}
		bind:this={inputNoteNameElement}
		on:keydown={(e) => {
			if (e.key == 'Enter') {
				newNote();
			}
		}}
	/>
</Modal>
<!-- Rename -->
<Modal bind:enabled={showRenameModal} title={renameModalType} confirmFunction={renameFunction}>
	<label for="name" class="modal-input-label">Name: &nbsp;</label>
	<input
		type="text"
		name="name"
		id="name"
		class="modal-input"
		bind:value={renameModalValue}
		bind:this={renameModalInputElement}
		on:keydown={(e) => {
			if (e.key == 'Enter') {
				renameFunction();
			}
		}}
	/>
</Modal>
<TableOfContents bind:enabled={showTableOfContents} length={1}>rekt</TableOfContents>
{#if showContextMenu}
	<div
		id="contextMenu"
		class="context-menu"
		style="left: {contextMenuX}px; top: {contextMenuY}px"
		bind:this={contextMenu}
	>
		<ul>
			<li><button on:click={contextMenuOpen}>Open</button></li>
			{#if sidebarBook}
				<li><button on:click={contextMenuOpenNewTab}>Open in new tab</button></li>
			{/if}
			<li><button on:click={contextMenuRename}>Rename</button></li>
			<li><button on:click={contextMenuDelete}>Delete</button></li>
		</ul>
	</div>
{/if}
{#if mainData}
	{#if mainData.data}
		<main class="main-wrapper">
			<div class="sidebar" bind:this={mdview}>
				{#if mainData.os == 'darwin'}
					<Spacer space={3} draggable={true} />
				{/if}
				{#if sidebarBook}
					{#if mainData.os != 'darwin'}
						<Spacer space={2} />
					{/if}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="backtofolders" on:click={hideSidebarNotes}>
						<svg
							width="23"
							height="23"
							viewBox="0 0 129 129"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							style="transform: rotate(180deg)"
						>
							<path
								d="M53.55 101.745C52.2988 101.747 51.0863 101.312 50.1228 100.513C49.5806 100.064 49.1324 99.5117 48.8038 98.8887C48.4753 98.2657 48.2729 97.5839 48.2082 96.8825C48.1436 96.1812 48.2179 95.4739 48.427 94.8013C48.6361 94.1287 48.9758 93.504 49.4267 92.9628L73.4171 64.26L50.2835 35.5037C49.8387 34.9559 49.5065 34.3257 49.306 33.6491C49.1056 32.9726 49.0408 32.2631 49.1155 31.5614C49.1901 30.8598 49.4027 30.1798 49.741 29.5606C50.0793 28.9413 50.5366 28.395 51.0867 27.9531C51.6408 27.4656 52.2896 27.0979 52.9925 26.8731C53.6955 26.6482 54.4373 26.5711 55.1714 26.6465C55.9055 26.7219 56.6161 26.9483 57.2586 27.3114C57.9012 27.6744 58.4617 28.1664 58.905 28.7564L84.7697 60.8864C85.5573 61.8446 85.9879 63.0465 85.9879 64.2868C85.9879 65.5272 85.5573 66.7291 84.7697 67.6872L57.9947 99.8172C57.4575 100.465 56.7751 100.978 56.0028 101.313C55.2306 101.647 54.3903 101.796 53.55 101.745Z"
								fill="#ac65ff"
							/>
						</svg>
						<p>Back</p>
					</div>
					{#each sidebarBook.notes as note, i}
						<BookCover
							title={note.title}
							note={true}
							clickFunction={() => {
								if (sidebarBook) {
									selectCurrentNote(sidebarBook, i);
								}
							}}
							rightClickFunction={(e) => {
								e.preventDefault();
								contextMenuX = e.pageX;
								contextMenuY = e.pageY;
								showContextMenuFunction(i);
							}}
						/>
					{/each}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="new-folder"
						on:click={() => {
							showNewNoteModal = true;
							setTimeout(() => {
								inputNoteNameElement.focus();
							}, 250);
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 59 59"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M29.2079 16.104V42.3119M16.1039 29.2079H42.3118"
								stroke="#a0a0a0"
								stroke-width="5.24158"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M29.2079 55.4158C43.6821 55.4158 55.4158 43.6821 55.4158 29.2079C55.4158 14.7337 43.6821 3 29.2079 3C14.7337 3 3 14.7337 3 29.2079C3 43.6821 14.7337 55.4158 29.2079 55.4158Z"
								stroke="#a0a0a0"
								stroke-width="5.24158"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<p>New Note</p>
					</div>
				{:else}
					{#each mainData.data.data as book, i}
						<BookCover
							title={book.name}
							color={book.color}
							clickFunction={() => {
								showSidebarNotes(i);
							}}
							rightClickFunction={(e) => {
								e.preventDefault();
								contextMenuX = e.pageX;
								contextMenuY = e.pageY;
								showContextMenuFunction(i);
							}}
						/>
					{/each}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="new-folder"
						on:click={() => {
							showNewFolderModal = true;
							setTimeout(() => {
								inputNameElement.focus();
							}, 250);
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 59 59"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M29.2079 16.104V42.3119M16.1039 29.2079H42.3118"
								stroke="#a0a0a0"
								stroke-width="5.24158"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M29.2079 55.4158C43.6821 55.4158 55.4158 43.6821 55.4158 29.2079C55.4158 14.7337 43.6821 3 29.2079 3C14.7337 3 3 14.7337 3 29.2079C3 43.6821 14.7337 55.4158 29.2079 55.4158Z"
								stroke="#a0a0a0"
								stroke-width="5.24158"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<p>New Folder</p>
					</div>
				{/if}
			</div>
			<!-- <div class="resizer" on:mousedown={onResizer1Drag} /> -->
			<div class="md-view" bind:this={editor}>
				<TabGroup os={mainData.os}>
					{#each tabs as tab, i}
						{#if i == currentTab}
							<Tab
								name={tab.note.title}
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
								name={tab.note.title}
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
				</TabGroup>
				<div class="editor">
					{#if tabs[currentTab].isEditing}
						{#if mainData.os == 'darwin'}
							svelte-ignore a11y-click-events-have-key-events
							<div class="centered-edit">Press Command + e to escape edit mode</div>
						{:else}
							<div class="centered-edit">Press Ctrl + e to escape edit mode</div>
						{/if}
						<div class="editor-flex">
							<textarea
								class="editor-textarea"
								bind:value={tabs[currentTab].note.noteData}
								bind:this={markdownTextArea}
								on:keydown={(e) => {
									if (e.key == 'Tab') {
										e.preventDefault();
										const area = e.currentTarget;
										const start = area.selectionStart;
										const end = area.selectionEnd;

										area.value =
											area.value.substring(0, start) +
											'\t' +
											area.value.substring(end);

										area.selectionStart = area.selectionEnd = start + 1;
									}
								}}
							/>
							{#if tabs[currentTab].preview}
								<div
									class="editor-preview markdown-editor__result-html"
									id="markdown-output"
									bind:this={markdownOutput}
								>
									{@html renderMd(tabs[currentTab].note.noteData)}
								</div>
							{/if}
						</div>
					{:else}
						{#if tabs[currentTab].note != emptyNote}
							{#if mainData.os == 'darwin'}
								<div class="centered-edit">Press Command + e to edit</div>
							{:else}
								<div class="centered-edit">Press Ctrl + e to edit</div>
							{/if}
						{:else}
							<Spacer space={0.5} />
						{/if}
						<div class="markdown-editor__result-html">
							{@html renderMd(tabs[currentTab].note.noteData)}
						</div>
					{/if}
					<!-- <NewEditor /> -->
					<!-- <Editor bind:mdValue={tabs[currentTab].note.noteData} /> -->
				</div>
			</div>
		</main>
	{/if}
{/if}

<style>
	.context-menu {
		position: absolute;
		border: 1px solid #676767;
		border-radius: 0.5rem;
		padding: 0.3rem;
		background-color: var(--editor-background);
		z-index: 999;
	}
	.context-menu li {
		list-style: none;
	}
	.context-menu ul > li > button {
		background-color: transparent;
		background-repeat: no-repeat;
		border: none;
		cursor: pointer;
		overflow: hidden;
		outline: none;
		color: white;
		width: 100%;
		text-align: left;
		padding: 0.25rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		border-radius: 0.25rem;
	}
	.context-menu ul > li > button:hover {
		background-color: #ac65ff;
	}
	.editor-preview {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		border-left: 1px solid #676767;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.editor {
		overflow-y: auto;
		height: calc(100vh - 5rem);
	}
	.editor-flex {
		display: flex;
		height: calc(100% - 2rem);
	}
	.editor-textarea {
		border: none;
		resize: none;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		font-size: 14px;
		background-color: transparent;
	}
	.editor-textarea:focus {
		outline: none;
	}
	.backtofolders {
		display: flex;
		align-items: center;
		font-size: 13px;
		color: #ac65ff;
		margin-top: -15px;
		margin-bottom: 5px;
		z-index: 10;
		-webkit-app-region: no-drag;
		width: 56px;
	}
	.backtofolders:hover {
		cursor: pointer;
	}
	.centered-edit {
		color: #505050;
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 12px;
		height: 1rem;
		margin-bottom: 1rem;
	}
	.modal-input {
		background-color: #3f3f3f;
		border-radius: 0.38rem;
		color: white;
		border: 1px solid #676767;
		padding: 2px;
		padding-left: 8px;
	}
	.modal-input:focus {
		outline: 2px solid var(--accent-color);
	}
	.modal-input-label {
		font-size: 12px;
	}
	.new-folder {
		position: fixed;
		bottom: 0.5rem;
		left: 0.75rem;
		display: flex;
		gap: 0.25rem;
		cursor: pointer;
		align-items: center;
	}

	.new-folder p {
		font-size: 12.5px;
		font-weight: 600;
		color: #a0a0a0;
	}

	.new-folder:hover p {
		color: #fff;
	}
	.new-folder:hover path {
		stroke: #fff;
	}

	.add-button {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.add-button svg {
		padding: 2px;
		border-radius: 5px;
		margin-right: 0.5rem;
	}
	.add-button:hover svg {
		background-color: #9090903c;
	}
	.editor {
		height: calc(100vh - 40px);
		padding: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0;
		box-sizing: border-box;
		background-color: var(--editor-background);
	}
	.main-wrapper {
		display: flex;
		height: 100%;
		box-sizing: content-box;
		overflow: hidden;
	}
	.sidebar {
		width: 12rem;
		padding: 0.5rem;
		height: 100%;
	}
	.md-view {
		width: 100%;
		border-left: 1px solid #3f3f3f;
	}
</style>
