<script lang="ts">
	import { Player } from './components/Player';
	import ChannelSelector from './components/ChannelSelector.svelte';

	import { onMount } from 'svelte';
	import { playlist } from './store';
	import playlists from '../store';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	onMount(async () => {
		if ($playlists[page.url.searchParams.get('url') as string] === undefined) {
			goto('/');
			toast.error('Playlist not found');
		}
		playlist.set($playlists[page.url.searchParams.get('url') as string]);
	});
</script>

<div class="h-screen">
	<Player />
	<ChannelSelector />
</div>
