<script lang="ts">
	import { resize } from '$lib/utility';

	import { account } from '$store/account';

	import { getContext, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let id: string;

	const isEditting = getContext<Writable<boolean>>('isEditting');
	const form = getContext<Writable<Record<string, any>>>('form');
	const handleChange = getContext<(event: Event) => void>('handleChange');

	let authenticated: boolean | undefined;

	const authenticate = () => {
		return !!$account && $account.type === 'ADMIN';
	};

	setContext('id', id);

	onMount(async () => {
		authenticated = authenticate();
	});

	let size: number = $form[id].length;

	$: {
		resize($form[id], size, '');
	}
</script>

{#if $isEditting && authenticated}
	<p>Length (Refresh after saving to see changes)</p>
	<input type="number" bind:value={size} class="text-black" />
{/if}
<slot />
