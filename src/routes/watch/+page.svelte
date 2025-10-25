<script lang="ts">
	import { Player } from './components/Player';
	import ChannelSelector from './components/ChannelSelector.svelte';

	import { playlist } from './store';
	import playlists from '../store';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	const playlistUrl = page.url.searchParams.get('url') as string;

	const initPlaylist = async () => {
		if ($playlists[playlistUrl] === undefined) {
			await goto(resolve('/'));
			toast.error('Playlist not found');
		}
		playlist.set($playlists[playlistUrl]);
	};
</script>

{#await initPlaylist()}
	<div class="vjs-loading-spinner"></div>
{:then}
	<div class="h-dvh">
		<Player {playlistUrl} />
		<ChannelSelector />
	</div>
{/await}
