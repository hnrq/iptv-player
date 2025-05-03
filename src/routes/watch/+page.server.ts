import { redirect } from 'sveltekit-flash-message/server';

export const load = ({ url, cookies }) => {
	if (!url.searchParams.get('url'))
		return redirect(307, '/', { type: 'error', message: 'No URL provided' }, cookies);
};
