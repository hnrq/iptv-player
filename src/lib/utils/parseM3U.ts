import m3u8Parser from 'm3u8-parser';
import camelcase from 'lodash.camelcase';

const parseTVGTags = (tvgString: string) => {
	const [tagsString, title] = tvgString.replace('-1 ', '').replaceAll('"', '').split(',');
	return tagsString.split(' ').reduce(
		(acc, entry) => {
			const [key, value] = entry.split('=');
			return { ...acc, [camelcase(key.replace('tvg-', ''))]: value };
		},
		{ title }
	);
};

const parseM3U = async (
	url: string,
	credentials?: { username: string; password: string }
): Promise<Omit<m3u8Parser.Segment, 'title'>[]> => {
	const auth = credentials ? `${credentials.username}:${credentials.password}@` : '';
	const parser = new m3u8Parser.Parser();

	const response = await fetch(`${auth}${url}`);
	parser.push(await response.text());
	parser.end();

	return parser.manifest.segments.map((segment) => ({
		...segment,
		...parseTVGTags(segment.title)
	}));
};

export default parseM3U;
