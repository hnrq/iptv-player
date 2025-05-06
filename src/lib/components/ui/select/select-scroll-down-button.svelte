<script lang="ts">
	import ChevronDown from '@material-symbols/svg-400/rounded/chevron-down.svg?component';
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>
