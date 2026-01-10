<script lang="ts">
	import { onMount } from 'svelte';
	import * as Dialog from '../dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { buttonVariants } from '../button';

	let open = $state(false);
	let agreed = $state(false);

	onMount(() => {
		const hasAccepted = localStorage.getItem('tos_accepted');
		if (!hasAccepted) open = true;
	});

	const accept = () => {
		localStorage.setItem('tos_accepted', 'true');
		open = false;
	};

	const sections = [
		{
			title: 'No Content Provided',
			description:
				'This app is a neutral player. We do not provide, host, or link to any media content or playlists.'
		},
		{
			title: 'User Responsibility',
			description:
				'You are solely responsible for ensuring your source streams are legal. The developer does not condone piracy.'
		},
		{
			title: 'Proxy Purpose',
			description:
				'The HTTP-to-HTTPS proxy is for technical compatibility only. It is not intended to bypass DRM or ISP blocks.'
		},
		{
			title: 'Liability',
			description:
				'The developer is not liable for any misuse of this tool or legal issues arising from user-provided content.'
		}
	];
</script>

<Dialog.Root {open}>
	<Dialog.Content interactOutsideBehavior="ignore" escapeKeydownBehavior="ignore" showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title>Terms of Service & Disclaimer</Dialog.Title>
			<Dialog.Description>Please read and accept before proceeding.</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-2 py-8">
			{#each sections as { title, description }, i (title)}
				<h3 class="text-xl font-bold">{title}</h3>
				<p>{description}</p>
				{#if i < sections.length - 1}<hr />{/if}
			{/each}
		</div>
		<Dialog.Footer class="flex flex-col gap-8">
			<div class="flex items-start gap-3">
                <Checkbox id="terms" bind:checked={agreed} />
                <div class="grid gap-2">
                    <Label for="terms">Accept terms and conditions</Label>
                    <p class="text-muted-foreground text-sm">
                        By clicking this checkbox, you agree to the terms and conditions.
                    </p>
                </div>
            </div>
			<Dialog.Close disabled={!agreed} onclick={accept} class={buttonVariants({ variant: 'default' })}>Accept and Continue</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
