import { AddSourceSchema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import parseM3U from '$lib/utils/parseM3U';
import parseXTream from '$lib/utils/parseXTream';
import { error } from '@sveltejs/kit';

export const load = async () => ({
	form: await superValidate(zod(AddSourceSchema))
});

export const actions = {
	source: async ({ request }) => {
		const form = await superValidate(request, zod(AddSourceSchema));
		const { data } = form;
		if (!form.valid) return fail(400, { form });

		const segments = await (form.data.type === 'm3u' ? parseM3U : parseXTream)(
			data.url,
			data.authenticated ? { username: data.username!, password: data.password! } : undefined
		);

		if (!segments.length) return error(500, 'Failed to fetch Playlist');

		return {
			url: form.data.url,
			type: form.data.type,
			segments
		};
	}
};
