import { AddSourceSchema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import parseM3U from '$lib/utils/parseM3U';

const defaults = { url: '', type: 'm3u', authenticated: false } as typeof AddSourceSchema.infer;

export const load = async () => ({
	form: await superValidate(arktype(AddSourceSchema, { defaults }))
});

export const actions = {
	source: async ({ request }) => {
		const form = await superValidate(request, arktype(AddSourceSchema, { defaults }));
		const { data } = form;
		if (!form.valid) return fail(400, { form });

		return {
			url: form.data.url,
			type: form.data.type,
			segments: await parseM3U(
				data.url,
				data.authenticated ? { username: data.username!, password: data.password! } : undefined
			)
		};
	}
};
