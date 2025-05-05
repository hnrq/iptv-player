<script lang="ts">
	import { onMount } from 'svelte';
	import videojs from 'video.js';
	import Hls from 'hls.js';
	import { playlist, selectedChannel, showChannelSelector } from '../../store';
	import '../VideoJSControls';

	import 'video.js/dist/video-js.css';
	import './index.css';

	let video: HTMLVideoElement | undefined = $state();
	let channelSelectorToggle: HTMLButtonElement | undefined = $state();
	let hls: Hls | undefined = $state();

	onMount(async () => {
		if (!video) return;
		const player = videojs(video, {
			fill: true,
			liveui: true,
			autoplay: true,
			preloadWebComponents: true,
			techOrder: ['chromecast', 'html5'],
			controlBar: {
				pictureInPictureToggle: true,
				subsCapsButton: false
			}
		});

		const element = player.getChild('controlBar')?.addChild('ToggleChannelSelector');
		channelSelectorToggle = element?.el() as HTMLButtonElement;

		if (Hls.isSupported()) {
			hls = new Hls({ debug: true });
			hls.on(Hls.Events.MEDIA_ATTACHED, () => {
				if (!video) return;
				video.muted = true;
				video.play();
			});
		} else {
			video.addEventListener('canplay', () => {
				video?.play();
			});
		}
	});

	$effect(() => {
		channelSelectorToggle?.classList.toggle('text-primary', $showChannelSelector);
	});

	$effect.pre(() => {
		if (!video || !$playlist || !hls) return;
		if (Hls.isSupported()) {
			hls.loadSource($playlist.segments[$selectedChannel].uri);
			hls.attachMedia(video);
		} else video.src = $playlist.segments[$selectedChannel].uri;
	});
</script>

<video class="video-js" controls bind:this={video}>
	<track kind="captions" />
</video>

<style>
	:global(.vjs-texttrack-settings) {
		display: none;
	}
</style>
