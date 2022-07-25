<script lang="ts">
	import trpc from '$lib/trpc/client';
	import { myBundles } from '$store/account';
	import type { Course } from '@prisma/client';
	import { onMount } from 'svelte';
	import AnimatedElement from '../AnimatedElement.svelte';
	import Loading from '../Loading/Loading.svelte';
	import { fly } from 'svelte/transition';

	import BundleBriefInfo from './BundleBriefInfo.svelte';

	type Bundle = {
		image: string;
		id: number;
		name: string;
		description: string;
		courses?: Course[] | null;
	};

	export let bundles: Bundle[];
	let packages = new Array<Bundle>();
	let singleCourse = new Array<Bundle>();

	$: if (bundles) {
		packages = bundles.filter((bundle) => bundle.courses && bundle.courses.length > 1);
		singleCourse = bundles.filter((bundle) => bundle.courses && bundle.courses.length === 1);
	}

	onMount(async () => {
		// bundles = await trpc.query('bundle.getAll');
		myBundles.set(await trpc.query('account.myBundles'));
	});
</script>

{#if bundles}
	<div class="py-14 bg-zinc-800">
		<div class="px-24 sm:px-4 md:px-48">
			<h1 class="text-5xl font-bold py-5 text-[#F8F7F9]">Bundles</h1>
			{#if packages.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each packages as bundle, i (bundle.id)}
						<div in:fly={{ y: 200, duration: 2000 + 500 * i }}>
							<BundleBriefInfo {bundle} />
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-left">
					<p class="text-2xl text-[#F8F7F9]">No bundles available.</p>
				</div>
			{/if}
		</div>

		<div class="px-24 sm:px-4 md:px-48">
			<h1 class="text-5xl font-bold py-5 text-[#F8F7F9]">Courses</h1>
			{#if singleCourse.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each singleCourse as bundle, i (bundle.id)}
						<BundleBriefInfo {bundle} />
					{/each}
				</div>
			{:else}
				<div class="text-left">
					<p class="text-2xl text-[#F8F7F9]">No courses available.</p>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<Loading />
{/if}
