<script lang="ts">
	import { page } from '$app/stores';
	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/Loading/Loading.svelte';

	const id = parseInt($page.params.id);

	let bundle: InferQueryOutput<'bundle.get'>;

	onMount(async () => {
		bundle = await trpc.query('bundle.get', { id });

		if (bundle) {
			goto(`/subscribe/${bundle.id}/${bundle.name.replace(/[^a-z0-9+]+/gi, '+')}`);
		} else {
			goto('/subscribe');
		}
	});
</script>

<Loading />
