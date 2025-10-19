<script lang="ts">
	import { Player } from './components/Player';
	import ChannelSelector from './components/ChannelSelector.svelte';

	import { playlist } from './store';
	import playlists from '../store';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	const initPlaylist = async () => {
		if ($playlists[page.url.searchParams.get('url') as string] === undefined) {
			await goto(resolve('/'));
			toast.error('Playlist not found');
		}
		playlist.set($playlists[page.url.searchParams.get('url') as string]);
	};
</script>

{#await initPlaylist()}
	<div class="vjs-loading-spinner"></div>
{:then}
	<div class="h-dvh">
		<Player />
		<ChannelSelector />
	</div>
{/await}
