<script lang="ts">
	import { onMount } from 'svelte';
	import trpc from '$lib/trpc/client';
	import BundleList from '$lib/components/Bundle/BundleList.svelte';
	import { myBundles } from '$store/account';

	onMount(async () => {
		myBundles.set(await trpc.query('account.myBundles'));
	});
</script>

<BundleList bundles={$myBundles} />
