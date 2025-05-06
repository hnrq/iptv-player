<script lang="ts">
	import FormAddSource from '$lib/components/forms/FormAddSource.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { goto, replaceState } from '$app/navigation';
	import { getFlash } from 'sveltekit-flash-message';
	import Play from '@material-symbols/svg-400/rounded/play_arrow-fill.svg?component';
	import Add from '@material-symbols/svg-400/rounded/add.svg?component';
	import * as Dialog from '$lib/components/ui/dialog';
	import { page } from '$app/state';
	import playlistsStore from './store';
	import type { M3UPlaylist } from '$lib/types';
	import { Button } from '$lib/components/ui/button';

	const { data }: { data: PageData } = $props();
	const flash = getFlash(page);

	const form = superForm(data.form, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				playlistsStore.add(result.data as M3UPlaylist);
				$flash = { type: 'success', message: `Added source ${result.data?.url}` };
				goto(`/watch?url=${encodeURIComponent(result.data?.url)}`);
			}
		}
	});

	let playlists = $derived(Object.values($playlistsStore));
</script>

<main class="w-dvh flex h-dvh flex-col items-center justify-center gap-3">
	{#if playlists.length > 0}
		<div class="flex h-full w-full flex-col gap-3 p-4">
			<div class="flex justify-between">
				<h2 class="text-2xl"><Play class="h-20 fill-white" />Playlists - {playlists.length}</h2>
				<Button variant="ghost" onclick={() => replaceState('', { modalShown: 'add-playlist' })}>
					<Add class="fill-primary" />
				</Button>
			</div>
			<div class="flex flex-col">
				{#each playlists as playlist (playlist.url)}
					<a
						href={`/watch?url=${encodeURIComponent(playlist.url)}`}
						class="flex flex-col gap-2 px-6 py-3 hover:bg-secondary/90"
					>
						<h3 class="font-bold">{playlist.url}</h3>
						<small><b>{playlist.segments.length}</b> channels</small>
					</a>
				{/each}
			</div>
		</div>
		<Dialog.Root
			open={page.state.modalShown === 'add-playlist'}
			onOpenChange={(open) => {
				if (!open) replaceState('', { modalShown: undefined });
			}}
		>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add Playlist</Dialog.Title>
				</Dialog.Header>
				<FormAddSource {form} action="?/source" />
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<Play class="h-20 fill-white" />
		<div class="max-w-100 w-80">
			<FormAddSource {form} action="?/source" />
		</div>
	{/if}
</main>
