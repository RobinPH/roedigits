<script lang="ts">
	import { getValueFromObject } from '$lib/utility';

	import { account } from '$store/account';

	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;
	export let parser = (value: string) => value;
	export let hidden = false;

	const isEditting = getContext<Writable<boolean>>('isEditting');
	const form = getContext<Writable<Record<string, any>>>('form');
	const handleChange = getContext<(event: Event) => void>('handleChange');

	let authenticated: boolean | undefined;

	const authenticate = () => {
		return !!$account && $account.type === 'ADMIN';
	};

	onMount(async () => {
		authenticated = authenticate();
	});

	let value = getValueFromObject($form, id);
</script>

{#if $isEditting && authenticated}
	<label for={id}>{id}</label>
	<input
		type="text"
		class="text-black"
		{id}
		bind:value
		on:change={handleChange}
		on:blur={handleChange}
	/>
{:else if !hidden}
	{parser(value)}
{/if}
