import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const streamUrl = url.searchParams.get('url');
	console.log('Proxying URL:', streamUrl);

	if (!streamUrl) {
		return new Response(JSON.stringify({ error: 'Missing "url" query parameter.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const baseUrlDirectory = new URL('.', streamUrl).href;
	const proxyEndpoint = url.origin + url.pathname;

	try {
		const response = await fetch(streamUrl);
		const contentType = response.headers.get('content-type') ?? '';

		if (
			['application/vnd.apple.mpegurl', 'audio/mpegurl', 'application/x-mpegurl'].includes(
				contentType
			)
		) {
			const playlistText = await response.text();
			const rewrittenPlaylist = playlistText
				.split('\n')
				.map((line) => {
					if (line && !line.startsWith('#') && !line.startsWith('http')) {
						try {
							const absoluteSegmentUrl = new URL(line, baseUrlDirectory).href;

							return `${proxyEndpoint}?url=${encodeURIComponent(absoluteSegmentUrl)}`;
						} catch (e) {
							console.warn(`Failed to resolve path: ${line}`, e);
							return line;
						}
					}
					return line;
				})
				.join('\n');

			const headers = new Headers(response.headers);
			headers.delete('content-length');

			return new Response(rewrittenPlaylist, {
				status: response.status,
				headers: headers
			});
		}

		return response;
	} catch (err) {
		console.error('Proxy Fetch Error:', err);
		return error(500, 'Internal proxy error during stream fetch.');
	}
};
