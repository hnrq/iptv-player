import { type } from 'arktype';
import type m3u8Parser from 'm3u8-parser';

export const PlaylistType = type.enumerated('m3u', 'xtream');

export type Segment = m3u8Parser.Segment & {
	id?: string;
	logo?: string;
	groupTitle?: string;
};

export type M3UPlaylist = {
	url: string;
	type: 'm3u';
	segments: Segment[];
};
