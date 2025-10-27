import * as m3u8Parser from 'm3u8-parser';
import camelCase from 'lodash/camelCase';
import type { Segment } from '$lib/types';

const parseTVGTags = (tvgString: string) => {
	const [tagsString, title] = tvgString.replace('-1 ', '').replaceAll('"', '').split(',');
	return tagsString.split(' ').reduce(
		(acc, entry) => {
			const [key, value] = entry.split('=');
			return { ...acc, [camelCase(key.replace('tvg-', ''))]: value };
		},
		{ title }
	);
};

const parseM3U = async (
	url: string,
	credentials?: { username: string; password: string }
): Promise<Omit<Segment, 'title'>[]> => {
	const auth = credentials ? `${credentials.username}:${credentials.password}@` : '';
	const parser = new m3u8Parser.Parser();

	const response = await fetch(`${auth}${url}`);
	parser.push(await response.text());
	parser.end();

	return parser.manifest.segments.map((segment) => ({
		...segment,
		...parseTVGTags(segment.title as string)
	}));
};

export default parseM3U;
