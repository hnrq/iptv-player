<script lang="ts">
	import { playlist, selectedChannel, showChannelSelector } from '../store';
	import * as Command from '$lib/components/ui/command';

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			showChannelSelector.update((curr) => !curr);
		}
	};

	let searchTerm = $state('');
	let filteredChannels = $derived(
		$playlist?.segments.filter((segment) => segment.title.includes(searchTerm))?.slice(0, 10) ?? []
	);
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog
	shouldFilter={false}
	bind:open={() => $showChannelSelector, (value) => showChannelSelector.set(value)}
>
	<Command.Input bind:value={searchTerm} placeholder="Search for a channel..." />
	<Command.List>
		<Command.Group heading="Channels">
			<Command.Empty>No results found.</Command.Empty>
			{#each filteredChannels as segment, index (segment.title)}
				<Command.Item
					onclick={() => {
						selectedChannel.set(index);
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
		</Command.Group>
	</Command.List>
</Command.Dialog>
