import { AddSourceSchema } from '$lib/components/forms/FormAddSource.svelte';
import parseM3U from '$lib/utils/parseM3U';
import parseXtream from '$lib/utils/parseXtream';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod4(AddSourceSchema))
});

export const actions = {
	source: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(AddSourceSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const segments = await (form.data.type === 'm3u' ? parseM3U : parseXtream)(
				form.data.url,
				form.data.authenticated
					? { username: form.data.username!, password: form.data.password! }
					: undefined
			);

			setFlash({ type: 'success', message: `Added source ${form.data?.url}` }, cookies);
			return { form, segments };
		} catch (e) {
			setFlash({ type: 'error', message: (e as Error).message }, cookies);
			return fail(500, { form });
		}
	}
};
