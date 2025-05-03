import { type } from 'arktype';
import type { Segment } from 'm3u8-parser';

export const PlaylistType = type.enumerated('m3u', 'xtream');

export type M3UPlaylist = {
	url: string;
	type: 'm3u';
	segments: Segment[];
};
