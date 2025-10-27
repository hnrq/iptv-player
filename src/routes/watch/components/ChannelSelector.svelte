<script lang="ts">
	import { playlist, selectedChannel, showChannelSelector } from '../store';
	import * as Command from '$lib/components/ui/command';
	import { Spinner } from '$lib/components/ui/spinner';
	import { onMount } from 'svelte';

	const PAGE_SIZE = 10;

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			showChannelSelector.update((curr) => !curr);
		}
	};

	const intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting)
				itemCount = Math.min(itemCount + PAGE_SIZE, filteredChannels.length ?? PAGE_SIZE);
		});
	});

	let searchTerm = $state('');
	let spinner = $state<HTMLDivElement>();
	let itemCount = $state(PAGE_SIZE);
	let filteredChannels = $derived(
		$playlist?.segments.filter((segment) => segment.title?.includes(searchTerm)) ?? []
	);
	let displayedChannels = $derived(filteredChannels.slice(0, itemCount));

	$effect(() => {
		if (spinner) intersectionObserver.observe(spinner);
	});

	onMount(() => {
		return () => intersectionObserver.disconnect();
	});
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog
	shouldFilter={false}
	portalProps={{ disabled: true }}
	onOpenChange={(open) => showChannelSelector.set(open)}
	open={$showChannelSelector}
>
	<Command.Input
		bind:value={searchTerm}
		oninput={() => {
			itemCount = PAGE_SIZE;
		}}
		placeholder="Search for a channel..."
	/>
	<Command.List>
		<Command.Group heading="Channels">
			<Command.Empty>No results found.</Command.Empty>
			{#each displayedChannels as segment, index (index)}
				<Command.Item
					onclick={() => {
						selectedChannel.set($playlist?.segments.indexOf(segment) ?? 1);
						showChannelSelector.set(false);
					}}
					class="flex h-10 items-center gap-4 hover:cursor-pointer"
				>
					<object data={segment.logo} title="" width="50">
						<p class="text-xs font-bold">No Logo</p>
					</object>
					<span>{segment.title}</span>
				</Command.Item>
			{/each}
			{#if filteredChannels.length > displayedChannels.length}
				<div bind:this={spinner} class="flex justify-center p-2">
					<Spinner />
				</div>
			{/if}
		</Command.Group>
	</Command.List>
</Command.Dialog>
