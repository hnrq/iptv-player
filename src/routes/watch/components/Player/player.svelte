<script lang="ts">
	import { onMount } from 'svelte';
	import videojs from 'video.js';
	import { playlist, selectedChannel, showChannelSelector } from '../../store';
	import './videoJSControls';

	import './index.css';
	import type Player from 'video.js/dist/types/player';
	import { toast } from 'svelte-sonner';
	import { buildPlaylistURI } from '$lib/utils/buildPlaylistURI';

	let video: HTMLVideoElement | undefined = $state();
	let channelSelectorToggle: HTMLButtonElement | undefined = $state();
	let player: Player | undefined = $state();

	onMount(async () => {
		if (!video) return;

		player = videojs(video, {
			fill: true,
			liveui: true,
			autoplay: true,
			controlBar: {
				audioTrackButton: false,
				pictureInPictureToggle: true,
				subsCapsButton: false
			}
		});

		player.on('error', () => {
			toast.error(player?.error()?.message ?? '');
			showChannelSelector.set(true);
		});

		const element = player.getChild('controlBar')?.addChild('ToggleChannelSelector');
		channelSelectorToggle = element?.el() as HTMLButtonElement;
	});

	$effect(() => {
		channelSelectorToggle?.classList.toggle('text-primary', $showChannelSelector);
	});

	$effect.pre(() => {
		if (!video || !$playlist) return;
		const uri = $playlist.segments[$selectedChannel].uri;

		if (!uri) return;

		player?.src({
			src: buildPlaylistURI(uri),
			type: 'application/x-mpegURL'
		});
	});
</script>

<video class="video-js" controls bind:this={video}>
	<track kind="captions" />
</video>
