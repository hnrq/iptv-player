<script lang="ts">
	import { createRawSnippet, onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import videojs from 'video.js';
	import { playlist, selectedChannel, showChannelSelector } from '../../store';
	import Hamburger from '@material-symbols/svg-400/rounded/menu.svg?component';
	import './videoJSControls';

	import './index.css';
	import type Player from 'video.js/dist/types/player';
	import { toast } from 'svelte-sonner';
	import ChannelSelector from '../ChannelSelector.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { TOS_KEY } from '$lib/components/ui/terms-of-service/terms-of-service.svelte';

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

		player.on('xhr-hooks-ready', () => {
			// @ts-expect-error: Vhs is included in videojs by default
			player.tech({ IWillNotUseThisInPlugins: true }).vhs.xhr.onRequest((options) => {
				options.beforeSend = (xhr: XMLHttpRequest) => {
					if (localStorage[TOS_KEY] === 'true')
						xhr.setRequestHeader('X-Terms-Accepted', localStorage[TOS_KEY]);
				};
				return options;
			});
		});

		player.on('error', () => {
			toast.error(player?.error()?.message ?? '');
			player?.getChild('errorDisplay')?.addChild('SvelteComponentWrapper', {
				component: Button,
				props: {
					class: buttonVariants({ variant: 'default' })
						.split(' ')
						.map((c) => `${c}!`)
						.join(' '),
					onclick: () => showChannelSelector.set(true),
					children: createRawSnippet(() => ({ render: () => '<span>Change channel</span>' }))
				}
			});
		});

		player.getChild('controlBar')?.addChild('SvelteComponentWrapper', {
			component: Hamburger,
			props: {
				width: 24,
				height: 42,
				class: 'fill-white mx-2 hover:cursor-pointer',
				onclick: () => showChannelSelector.set(true)
			}
		});

		player.addChild('SvelteComponentWrapper', { component: ChannelSelector });
	});

	$effect.pre(() => {
		if (!video || !$playlist) return;
		const uri = $playlist.segments[$selectedChannel].uri;

		if (!uri) return;

		player?.src({
			src: playlistUrl.startsWith('http:')
				? `${PUBLIC_API_HOST}?url=${encodeURIComponent(uri)}`
				: uri,
			type: 'application/x-mpegURL'
		});
	});
</script>

<video class="video-js" controls bind:this={video}>
	<track kind="captions" />
</video>
