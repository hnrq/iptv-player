<script lang="ts">
	import { Player } from './components/Player';

	import { playlist, selectedChannel } from './store';
	import playlists from '../store';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const playlistUrl = page.url.searchParams.get('url') as string;

	onMount(async () => {
		if ($playlists[playlistUrl] === undefined) {
			await goto(resolve('/'));
			toast.error('Playlist not found');
		}
		playlist.set($playlists[playlistUrl]);
		selectedChannel.set(Number(page.url.searchParams.get('channel') ?? 0));
	});
</script>

<div class="h-dvh">
	{#if $playlist}
		<Player {playlistUrl} />
	{/if}
</div>
