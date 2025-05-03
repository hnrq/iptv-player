<script lang="ts">
	import FormAddSource from '$lib/components/forms/FormAddSource.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';

	const { data }: { data: PageData } = $props();
	const flash = getFlash(page);

	const form = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				localStorage.setItem(
					encodeURIComponent(result.data?.url),
					JSON.stringify(result.data?.data)
				);
				$flash = { type: 'success', message: `Added source ${result.data?.url}` };
				goto(`/watch?url=${encodeURIComponent(result.data?.url)}`);
			}
		}
	});
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-3">
	<h1 class="text-4xl">Playa</h1>
	<div class="max-w-100 w-80">
		<FormAddSource {form} action="?/source" />
	</div>
</main>
