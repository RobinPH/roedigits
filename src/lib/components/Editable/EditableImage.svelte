<script lang="ts">
	import { getValueFromObject } from '$lib/utility';

	import { account } from '$store/account';

	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;

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

<img src={value} alt="editable" {...$$props} />
{#if $isEditting && authenticated}
	<input
		{id}
		type="text"
		class="text-black"
		bind:value
		on:change={handleChange}
		on:blur={handleChange}
	/>
{/if}
