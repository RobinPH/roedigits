<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;

	const form = getContext<Writable<Record<string, any>>>('form');
	const handleChange = getContext<(event: Event) => void>('handleChange');
</script>

<input
	{...$$props}
	type="password"
	class="input input-sm input-bordered w-full max-w-xs"
	bind:value={$form[id]}
	on:change={handleChange}
/>
