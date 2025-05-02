<script lang="ts">
	import FormAddSource from '$lib/components/forms/FormAddSource.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const form = superForm(data.form);
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-3">
	<h1 class="text-4xl">Playa</h1>
	<div class="max-w-100 w-80">
		<FormAddSource {form} action="?/source" />
	</div>
</main>
