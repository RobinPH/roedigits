<script lang="ts">
	import { onMount } from 'svelte';
	import trpc from '$lib/trpc/client';
	import type { Course } from '@prisma/client';
	import BundleList from '$lib/components/Bundle/BundleList.svelte';

	let bundles = new Array<{
		image: string;
		id: number;
		name: string;
		description: string;
		courses?: Course[] | null;
	}>();

	onMount(async () => {
		bundles = await trpc.query('bundle.getAll');
	});
</script>

<BundleList {bundles} />
