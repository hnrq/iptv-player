<script lang="ts">
	import FormAddSource from '$lib/components/forms/FormAddSource.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { goto, replaceState } from '$app/navigation';
	import Add from '@material-symbols/svg-400/rounded/add.svg?component';
	import * as Dialog from '$lib/components/ui/dialog';
	import { page } from '$app/state';
	import playlistsStore from './store';
	import type { M3UPlaylist } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	const { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		dataType: 'json',
		onUpdate: async ({ result, form }) => {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.segments) {
				playlistsStore.add({ ...form.data, segments: action.segments } as unknown as M3UPlaylist);
				await goto(`/watch?url=${encodeURIComponent(form.data?.url)}`);
			}
		}
	});

	let playlists = $derived(Object.values($playlistsStore));
</script>

{#snippet removePlaylistAlertDialog(url: string)}
	<AlertDialog.Root>
		<AlertDialog.Trigger><Button variant="ghost">Remove</Button></AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Remove Playlist</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Description>
				Are you sure you want to remove playlist <b>{url}</b>? This action cannot be undone.
			</AlertDialog.Description>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={() => playlistsStore.remove(url)}>Remove</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/snippet}

{#snippet playlistListItem({ url, segments }: M3UPlaylist)}
	<div class="hover:bg-secondary/90 flex items-center justify-between rounded-sm border transition">
		<a
			href={resolve('/watch') + '?' + new URLSearchParams({ url }).toString()}
			class="flex max-w-7/10 flex-col gap-2 px-6 py-3"
		>
			<h3 class="overflow-hidden font-bold text-ellipsis">{url}</h3>
			<small><b>{segments.length}</b> channels</small>
		</a>
		{@render removePlaylistAlertDialog(url)}
	</div>
{/snippet}

<main class="m-auto flex max-w-200 flex-col items-center justify-center gap-3">
	{#if playlists.length > 0}
		<div class="flex h-full w-full flex-col gap-3 p-4">
			<div class="flex justify-between">
				<h2 class="text-xl font-bold">You have {playlists.length} Playlists</h2>
				<Button onclick={() => replaceState('', { modalShown: 'add-playlist' })}>
					Add playlist<Add />
				</Button>
			</div>
			<hr />
			<div class="flex flex-col gap-2">
				{#each playlists as playlist (playlist.url)}
					{@render playlistListItem(playlist)}
				{/each}
			</div>
		</div>
	{:else}
		<div class="mx-auto flex h-dvh w-100 items-center justify-center">
			<FormAddSource {form} action="?/source" />
		</div>
	{/if}
</main>

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
