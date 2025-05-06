import { type M3UPlaylist } from '$lib/types';
import { writable } from 'svelte/store';

export const playlist = writable<M3UPlaylist | undefined>();
export const selectedChannel = writable(0);
export const showChannelSelector = writable(false);
