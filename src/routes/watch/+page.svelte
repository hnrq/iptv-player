<script lang="ts">
	import Player from './components/Player.svelte';
	import ChannelSelector from './components/ChannelSelector.svelte';

	import { onMount } from 'svelte';
	import { initPlaylistStore, playlist } from './store';

	onMount(async () => {
		playlist.set(await initPlaylistStore());
	});
</script>

<div class="h-screen">
	<Player />
	<ChannelSelector />
</div>
