<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import { onMount } from 'svelte';
	import playlists from './store';
	import { browser } from '$app/environment';

	const flash = getFlash(page);
	let { children } = $props();

	onMount(() => {
		if (browser) playlists.init();
	});

	$effect(() => {
		if ($flash) toast[$flash.type]($flash.message);
	});

	$effect(() => {
		if (page.error?.message && page.status !== 404) toast.error(page.error?.message);
	});
</script>

<Toaster />
{#await playlists.init() then}
	{@render children()}
{/await}
