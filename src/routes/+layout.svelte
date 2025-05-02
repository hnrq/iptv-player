<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';

	const flash = getFlash(page);
	let { children } = $props();

	$effect(() => {
		if ($flash) toast[$flash.type]($flash.message);
	});
</script>

<Toaster />
{@render children()}

{#if $flash}
	{@const bg = $flash.type == 'success' ? '#3D9970' : '#FF4136'}
	<div style:background-color={bg} class="flash">{$flash.message}</div>
{/if}
