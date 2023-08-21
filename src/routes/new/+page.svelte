<script lang="ts">
	import { onMount } from 'svelte';
	import Spacer from '$lib/components/Spacer.svelte';
	import { goto } from '$app/navigation';

	let innerHeight: number = 0;
	let createFile: () => void;
	let openFile: () => void;
	type mainData = {
		path: string;
		data: string;
	};
	let a: mainData = { path: '', data: '' };

	onMount(() => {
		innerHeight = window.innerHeight;

		window.electron.receive('getData', (data: any) => {
			a = data;
		});

		createFile = () => {
			window.electron.send('createFile', null);
		};
		openFile = () => {
			window.electron.send('openFile', null);
		};
		window.setInterval(function () {
			if (a.data != '') {
				if (a.data != null) {
					goto('/app');
				}
			}
		}, 200);
	});
</script>

<svelte:window bind:innerHeight />

<main class="select-wrapper" style="height: {innerHeight - 150}px;">
	<div class="selector">
		<h1>Welcome to Livre</h1>
		<Spacer space={3} />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="newFile selector-button" on:click={createFile}>
			<svg
				width="32"
				height="32"
				viewBox="0 0 65 65"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M32.13 14.28C33.6087 14.28 34.8075 15.4788 34.8075 16.9575V29.4525H47.3025C48.7812 29.4525 49.98 30.6513 49.98 32.13C49.98 33.6087 48.7812 34.8075 47.3025 34.8075H34.8075V47.3025C34.8075 48.7812 33.6087 49.98 32.13 49.98C30.6513 49.98 29.4525 48.7812 29.4525 47.3025V34.8075H16.9575C15.4788 34.8075 14.28 33.6087 14.28 32.13C14.28 30.6513 15.4788 29.4525 16.9575 29.4525H29.4525V16.9575C29.4525 15.4788 30.6513 14.28 32.13 14.28Z"
					fill="#ac65ff"
				/>
				<path
					d="M0 11.6025C0 5.1946 5.1946 0 11.6025 0H52.6575C59.0653 0 64.26 5.1946 64.26 11.6025V52.6575C64.26 59.0653 59.0653 64.26 52.6575 64.26H11.6025C5.1946 64.26 0 59.0653 0 52.6575V11.6025ZM11.6025 5.355C8.1521 5.355 5.355 8.1521 5.355 11.6025V52.6575C5.355 56.1079 8.1521 58.905 11.6025 58.905H52.6575C56.1079 58.905 58.905 56.1079 58.905 52.6575V11.6025C58.905 8.1521 56.1079 5.355 52.6575 5.355H11.6025Z"
					fill="#ac65ff"
				/>
			</svg>
			<div>
				<h3>Create a new library file</h3>
				<p>Creates a file containing all your notebooks</p>
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="selectFile selector-button" on:click={openFile}>
			<svg
				width="32"
				height="40"
				viewBox="0 0 65 52"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8.78815 51.9451H56.339C61.3487 51.9451 64.26 49.0344 64.26 43.2689V13.7979C64.26 8.0325 61.3212 5.14973 55.4993 5.14973H28.2676C26.3645 5.14973 25.2169 4.67398 23.8175 3.49847L22.1103 2.07112C20.2631 0.53175 18.8358 0 16.065 0H7.72465C2.82677 0 0 2.79871 0 8.45224V43.2689C0 49.0623 2.96672 51.9451 8.78815 51.9451ZM4.50609 8.67614C4.50609 5.90538 5.98945 4.50609 8.6482 4.50609H14.9174C16.7646 4.50609 17.8842 4.95377 19.3115 6.18529L21.0188 7.58458C22.8379 9.096 24.3213 9.65569 27.092 9.65569H55.4157C58.1865 9.65569 59.7536 11.1391 59.7536 14.0498V15.7291H4.50609V8.67614ZM8.8721 47.4391C6.07339 47.4391 4.50609 45.9558 4.50609 43.045V19.9553H59.7536V43.073C59.7536 45.9558 58.1865 47.4391 55.4157 47.4391H8.8721Z"
					fill="#ac65ff"
				/>
			</svg>

			<div>
				<h3>Open a library file</h3>
				<p>Opens existing notebooks</p>
			</div>
		</div>
	</div>
</main>

<style>
	.select-wrapper {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		-webkit-user-select: none;
		-webkit-app-region: drag;
	}
	.selector {
		-webkit-app-region: no-drag;
	}
	.selector h1 {
		font-size: 3rem;
	}
	.selector-button {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 10px;
		border-radius: 10px;
		cursor: pointer;
	}
	.selector-button:hover {
		background-color: #6b22bf;
	}
	.selector-button:hover svg path {
		fill: white;
	}
</style>
