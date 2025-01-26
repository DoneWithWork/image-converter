import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import { uploadSchema } from '$lib/schema/schema';

export const load = async () => {
	const form = await superValidate(zod(uploadSchema));
	return { form };
};
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(uploadSchema));
		if (!form.valid) return fail(400, { form });

		const files = form.data.files.map((file) => {
			return { name: file.name, size: file.size };
		});
		console.log(files);
		return message(form, 'You have uploaded a valid File');
	}
} satisfies Actions;
