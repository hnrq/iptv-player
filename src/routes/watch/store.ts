import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { type M3UPlaylist } from '$lib/types';
import { writable } from 'svelte/store';

export const playlist = writable<M3UPlaylist | undefined>();
export const selectedChannel = writable<number>();

selectedChannel.subscribe((index) => {
	if (!browser || !index) return;
	const url = new URL(window.location.href);
	url.searchParams.set('channel', index.toString());
	goto(url, { replaceState: true });
});

export const showChannelSelector = writable(false);
