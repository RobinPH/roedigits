<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
	import { getContext, SvelteComponentTyped } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;
	export let label: string = '';
	export let bottomLabel: string = '';
	export let placeholder: string = '';
	export let component: SvelteComponentTyped;
	export let props: Record<string, any> = {};

	const errors = getContext<Writable<Record<string, any>>>('errors');
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for="label-top">
		<span class="label-text">{label ?? ''}</span>
	</label>
	<svelte:component this={component} {placeholder} {...props} {id} name={id} />

	{#if $errors[id] || bottomLabel}
		<label class="label" for="label-bottom">
			<span class="label-text-alt text-red-500">{$errors[id] ?? ''}</span>
			<span class="label-text-alt">{bottomLabel ?? ''}</span>
		</label>
	{/if}
</div>
