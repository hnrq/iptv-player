import { page } from '$app/state';
import { type M3UPlaylist } from '$lib/types';
import { writable } from 'svelte/store';

const fetchPlaylist = async (url: string) => {
	const response = await fetch(`/api/playlist/${url}`);
	return response.json();
};

export const initPlaylistStore = async () => {
	const url = page.url.searchParams.get('url') as string;

	const dataRaw = localStorage.getItem(encodeURIComponent(url));
	return dataRaw ? JSON.parse(dataRaw) : fetchPlaylist(url);
};

export const playlist = writable<M3UPlaylist | undefined>();
export const selectedChannel = writable(0);
export const showChannelSelector = writable(false);
