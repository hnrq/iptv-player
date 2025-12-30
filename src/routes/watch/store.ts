import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { type M3UPlaylist } from '$lib/types';
import { writable } from 'svelte/store';
import { Search } from 'js-search';

const createPlaylist = () => {
	const { subscribe, set } = writable<M3UPlaylist | undefined>();
	let search = new Search('title');
	search.addIndex('title');

	return {
		subscribe,
		search: (searchTerm: string): M3UPlaylist['segments'] | undefined => search.search(searchTerm),
		set: (playlist?: M3UPlaylist) => {
			set(playlist);
			if (playlist) {
				search = new Search('title');
				search.addIndex('title');
				search.addDocuments(playlist.segments);
			}
		}
	};
};
export const playlist = createPlaylist();
export const selectedChannel = writable<number>();

selectedChannel.subscribe((index) => {
	if (!browser || index === undefined) return;
	const url = new URL(window.location.href);
	url.searchParams.set('channel', index.toString());
	goto(url, { replaceState: true });
});

export const showChannelSelector = writable(false);
