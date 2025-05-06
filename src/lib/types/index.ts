import type m3u8Parser from 'm3u8-parser';

export type XTreamSegment = {
	num: number;
	name: string;
	stream_type: string;
	stream_id: number;
	stream_icon: string;
	epg_channel_id: string;
	added: string;
	custom_sid: string;
	tv_archive: number;
	direct_source: string;
	tv_archive_duration: number;
	category_id: string;
	category_ids: number[];
	thumbnail: string;
};

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
