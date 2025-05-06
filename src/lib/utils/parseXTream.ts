import type { Segment, XTreamSegment } from '$lib/types';

type SegmentInfo = Pick<Segment, 'id' | 'logo' | 'title' | 'groupTitle' | 'uri'>;

const parseXTream = async (
	url: string,
	credentials?: { username: string; password: string }
): Promise<Omit<SegmentInfo, 'title'>[]> => {
	const queryParams = new URLSearchParams({
		action: 'get_live_streams',
		...credentials
	});

	if (credentials === undefined) throw new Error('Credentials are required');

	const response = await fetch(
		new URL(`/player_api.php?${queryParams.toString()}`, url).toString()
	);

	if (!response.ok) throw new Error(`${response.url}: ${response.status} ${await response.text()}`);

	const data: XTreamSegment[] = await response.json();
	return data.map((segment) => ({
		id: segment.stream_id.toString(),
		logo: segment.stream_icon,
		title: segment.name,
		groupTitle: segment.category_id,
		uri: new URL(
			`/live/${credentials.username}/${credentials?.password}/${segment.stream_id}.m3u8`,
			url
		).toString()
	}));
};

export default parseXTream;
