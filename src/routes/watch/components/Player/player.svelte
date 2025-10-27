<script lang="ts">
	import { onMount } from 'svelte';
	import videojs from 'video.js';
	import { playlist, selectedChannel, showChannelSelector } from '../../store';
	import './videoJSControls';

	import './index.css';
	import type Player from 'video.js/dist/types/player';
	import { toast } from 'svelte-sonner';

	let { playlistUrl }: { playlistUrl: string } = $props();

	let video: HTMLVideoElement | undefined = $state();
	let player: Player | undefined = $state();

	onMount(async () => {
		if (!video) return;

		player = videojs(video, {
			fill: true,
			liveui: true,
			responsive: true,
			autoplay: true,
			controlBar: {
				audioTrackButton: false,
				pictureInPictureToggle: true,
				subsCapsButton: false
			}
		});

		// @ts-expect-error: This is injected through videojs-mobile-ui
		player.mobileUi();

		player.on('error', () => {
			toast.error(player?.error()?.message ?? '');
			showChannelSelector.set(true);
		});

		player.getChild('controlBar')?.addChild('ToggleChannelSelector');
		player.addChild('ChannelSelectorOverlay');
	});

	$effect.pre(() => {
		if (!video || !$playlist) return;
		const uri = $playlist.segments[$selectedChannel].uri;

		if (!uri) return;

		player?.src({
			src: playlistUrl.startsWith('http:') ? `/api/proxy?url=${encodeURIComponent(uri)}` : uri,
			type: 'application/x-mpegURL'
		});
	});
</script>

<video class="video-js" controls bind:this={video}>
	<track kind="captions" />
</video>
