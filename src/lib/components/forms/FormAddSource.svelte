<script lang="ts" module>
	import { z } from 'zod';

	export const schema = z
		.object({
			url: z.string().url(),
			type: z.enum(['xtream', 'm3u']).default('m3u'),
			authenticated: z.boolean().default(false),
			username: z.string().optional(),
			password: z.string().optional()
		})
		.superRefine(({ authenticated, username, password }, context) => {
			if (authenticated && !username)
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Required',
					path: ['username']
				});
			if (authenticated && !password)
				context.addIssue({
					code: z.ZodIssueCode.custom,
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

	const { form, action }: { action?: string; form: SuperForm<z.infer<typeof schema>> } = $props();

	const { enhance, form: formData, submitting } = form;
</script>

<form {action} method="POST" use:enhance class="flex flex-col gap-2">
	<Tabs.Root disabled={$submitting} bind:value={$formData.type}>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="m3u">M3U URL</Tabs.Trigger>
			<Tabs.Trigger value="xtream">Xtream Codes</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
	<TextField {form} disabled={$submitting} name="url" placeholder="http://iptv.com" />
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
