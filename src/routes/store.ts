import type { M3UPlaylist } from '$lib/types';
import omit from 'lodash/omit';
import { writable } from 'svelte/store';

const store = writable<Record<string, M3UPlaylist>>({});

const STORAGE_KEY = 'playlists';

const playlists = {
	subscribe: store.subscribe,
	add: (playlist: M3UPlaylist) => store.update((curr) => ({ ...curr, [playlist.url]: playlist })),
	remove: (url: string) => store.update((curr) => omit(curr, url)),
	init: async () => {
		store.set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'));

		store.subscribe((value) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		});
	}
};

export default playlists;
