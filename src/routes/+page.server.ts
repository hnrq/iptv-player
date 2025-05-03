import { schema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import parseM3U from '$lib/utils/parseM3U';

export const load = async () => ({ form: await superValidate(zod(schema)) });

export const actions = {
	source: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		const { data } = form;
		if (!form.valid) return fail(400, { form });

		return {
			url: form.data.url,
			data: await parseM3U(
				data.url,
				data.authenticated ? { username: data.username!, password: data.password! } : undefined
			)
		};
	}
};
