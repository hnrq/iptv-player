<script lang="ts">
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import type { Segment } from 'm3u8-parser';
	import Hls from 'hls.js';
	import { type M3UPlaylist } from '$lib/types';

	let video: HTMLVideoElement = $state();
	let playlist: M3UPlaylist = $state();

	const fetchPlaylist = async (url: string) => {
		const response = await fetch(`/api/playlist/${url}`);
		return response.json();
	};

	onMount(async () => {
		const url = page.url.searchParams.get('url') as string;

		const dataRaw = localStorage.getItem(encodeURIComponent(url));
		const data: M3UPlaylist = dataRaw ? JSON.parse(dataRaw) : await fetchPlaylist(url);
		playlist = data;
		setContext('playlist', data);

		if (Hls.isSupported()) {
			var hls = new Hls({ debug: true });
			hls.loadSource(data.segments[0].uri);
			hls.attachMedia(video);
			hls.on(Hls.Events.MEDIA_ATTACHED, () => {
				video.muted = true;
				video.play();
			});
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = data.segments[0].uri;
			video.addEventListener('canplay', () => {
				video.play();
			});
		}
	});
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<video height="600px" bind:this={video} controls></video>
</div>
