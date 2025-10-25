<script lang="ts">
	import FormAddSource from '$lib/components/forms/FormAddSource.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { goto, replaceState } from '$app/navigation';
	import Add from '@material-symbols/svg-400/rounded/add.svg?component';
	import * as Dialog from '$lib/components/ui/dialog';
	import { page } from '$app/state';
	import playlistsStore from './store';
	import type { M3UPlaylist } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import parseM3U from '$lib/utils/parseM3U';
	import parseXTream from '$lib/utils/parseXTream';
	import { resolve } from '$app/paths';

	const { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		dataType: 'json',
		onUpdate: async ({ form }) => {
			try {
				const segments = await (form.data.type === 'm3u' ? parseM3U : parseXTream)(
					form.data.url,
					form.data.authenticated
						? { username: form.data.username!, password: form.data.password! }
						: undefined
				);

				playlistsStore.add({ ...form.data, segments } as unknown as M3UPlaylist);
				toast.success(`Added source ${form.data?.url}`);

				goto(`/watch?url=${encodeURIComponent(form.data?.url)}`);
			} catch (e) {
				toast.error((e as Error).message);
			}
		}
	});

	let playlists = $derived(Object.values($playlistsStore));
</script>

<main class="flex flex-col items-center justify-center gap-3">
	{#if playlists.length > 0}
		<div class="flex h-full w-full flex-col gap-3 p-4">
			<div class="flex justify-between">
				<h2 class="text-2xl">Playlists - {playlists.length}</h2>
				<Button variant="ghost" onclick={() => replaceState('', { modalShown: 'add-playlist' })}>
					<Add class="fill-primary" />
				</Button>
			</div>
			<div class="flex flex-col">
				{#each playlists as { url, segments } (url)}
					<a
						href={resolve('/watch') + '?' + new URLSearchParams({ url }).toString()}
						class="hover:bg-secondary/90 flex flex-col gap-2 px-6 py-3"
					>
						<h3 class="font-bold">{url}</h3>
						<small><b>{segments.length}</b> channels</small>
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
		<div class="w-80 max-w-100">
			<FormAddSource {form} action="?/source" />
		</div>
	{/if}
</main>
