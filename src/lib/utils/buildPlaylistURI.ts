export const buildPlaylistURI = (uri: string) =>
	uri.startsWith('https:') ? uri : `/api/proxy?url=${encodeURIComponent(uri)}`;
