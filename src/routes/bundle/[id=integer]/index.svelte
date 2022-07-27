<script lang="ts">
	import { onMount } from 'svelte';
	import trpc from '$lib/trpc/client';
	import { page } from '$app/stores';
	import Loading from '$lib/components/Loading/Loading.svelte';
	import { goto } from '$app/navigation';

	let id = parseInt($page.params.id);

	onMount(async () => {
		const bundle = await trpc.query('bundle.get', { id });

		if (bundle) {
			goto(`/bundle/${bundle.id}/${bundle.name.replace(/[^a-z0-9+]+/gi, '+')}`);
		} else {
			goto('/bundles');
		}
	});
</script>

<Loading />
