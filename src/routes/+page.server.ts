import { AddSourceSchema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod(AddSourceSchema))
});

export const actions = {
	source: async ({ request }) => {
		const form = await superValidate(request, zod(AddSourceSchema));
		if (!form.valid) return fail(400, { form });

		return { form };
	}
};
