<script lang="ts" module>
	import * as z from 'zod';

	export const AddSourceSchema = z
		.object({
			url: z.url(),
			type: z.enum(['m3u', 'xtream']).default('m3u'),
			authenticated: z.boolean().default(false),
			username: z.string().optional(),
			password: z.string().optional()
		})
		.superRefine(({ authenticated, username, password }, ctx) => {
			if (!username && authenticated)
				ctx.addIssue({
					code: 'custom',
					message: 'Required',
					path: ['username']
				});
			if (!password && authenticated)
				ctx.addIssue({
					code: 'custom',
					message: 'Required',
					path: ['password']
				});
		});
</script>

<script lang="ts">
	import TextField from '$lib/components/ui/text-field/text-field.svelte';
	import { type SuperForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { fly } from 'svelte/transition';
	import * as Tabs from '$lib/components/ui/tabs';

	const { form, action }: { action?: string; form: SuperForm<z.infer<typeof AddSourceSchema>> } =
		$props();

	const { enhance, form: formData, submitting } = form;
</script>

<form {action} method="POST" use:enhance class="flex flex-col gap-2">
	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Tabs.Root disabled={$submitting} {...props} bind:value={$formData.type}>
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="m3u">M3U URL</Tabs.Trigger>
						<Tabs.Trigger value="xtream">Xtream Codes</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<TextField
		{form}
		disabled={$submitting}
		name="url"
		placeholder="https://iptv-org.github.io/iptv/index.m3u"
	/>
	<Form.Field {form} name="authenticated">
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox disabled={$submitting} {...props} bind:checked={$formData.authenticated} />
				<Form.Label>Needs Authentication</Form.Label>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	{#if $formData.authenticated}
		<div transition:fly={{ x: 20, duration: 200 }}>
			<TextField
				disabled={$submitting}
				{form}
				name="username"
				label="Username"
				placeholder="johndoe"
			/>
			<TextField
				disabled={$submitting}
				{form}
				name="password"
				label="Password"
				type="password"
				placeholder="********"
			/>
		</div>
	{/if}
	<Form.Button disabled={$submitting}>Add Source</Form.Button>
</form>
