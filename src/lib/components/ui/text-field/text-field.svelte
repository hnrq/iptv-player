<script lang="ts" generics="T extends Record<string, unknown>">
	import * as Form from '../form';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import { Input } from '../input';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputType } from '../input/input.svelte';

	const {
		name,
		label,
		form,
		type,
		...rest
	}: Pick<HTMLInputAttributes, 'placeholder' | 'disabled'> & {
		name: FormPathLeaves<T>;
		type?: InputType;
		label?: string;
		form: SuperForm<T>;
	} = $props();
	const { value } = formFieldProxy(form, name);
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label}<Form.Label>{label}</Form.Label>{/if}
			<Input {...props} bind:value={$value} {type} {...rest} />
		{/snippet}
	</Form.Control>
	<Form.Description />
	<Form.FieldErrors />
</Form.Field>
