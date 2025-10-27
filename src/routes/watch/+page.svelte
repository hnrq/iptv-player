<script lang="ts">
	import { Player } from './components/Player';

	import { playlist, selectedChannel, showChannelSelector } from './store';
	import playlists from '../store';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	const playlistUrl = page.url.searchParams.get('url') as string;

	const initStore = async () => {
		if ($playlists[playlistUrl] === undefined) {
			await goto(resolve('/'));
			toast.error('Playlist not found');
		}
		playlist.set($playlists[playlistUrl]);
		selectedChannel.set(Number(page.url.searchParams.get('channel') ?? 0));
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			showChannelSelector.update((curr) => !curr);
		}
	};
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="h-dvh">
	{#await initStore() then}<Player {playlistUrl} />{/await}
</div>
