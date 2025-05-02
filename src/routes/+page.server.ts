import { schema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({ form: await superValidate(zod(schema)) });

export const actions = {
	source: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		return redirect(`/watch?`, { type: 'success', message: 'Successfully added source' }, cookies);
	}
};
