import { AddSourceSchema } from '$lib/components/forms/FormAddSource.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	form: await superValidate(zod4(AddSourceSchema))
});

export const actions = {
	source: async ({ request }) => {
		const form = await superValidate(request, zod4(AddSourceSchema));
		if (!form.valid) return fail(400, { form });

		return { form };
	}
};
