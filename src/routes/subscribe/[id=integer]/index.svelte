<script lang="ts">
	import { page } from '$app/stores';
	import BundleBriefInfo from '$lib/components/Bundle/BundleBriefInfo.svelte';
	import BundleBriefPrice from '$lib/components/Bundle/BundleBriefPrice.svelte';
	import BundlePrice from '$lib/components/Bundle/BundlePrice.svelte';
	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import type { Bundle, Course } from '@prisma/client';
	import { onMount } from 'svelte';

	const id = parseInt($page.params.id);

	let bundle: InferQueryOutput<'bundle.get'>;

	let similarBundles = new Array<
		Bundle & {
			courses: Course[];
		}
	>();

	let isSingle: boolean = false;

	onMount(async () => {
		bundle = await trpc.query('bundle.get', { id });

		isSingle = bundle ? bundle.courses.length === 1 : false;

		const similarBundleIds = new Set<number>();

		if (bundle) {
			for (const course of bundle.courses) {
				for (const b of course.bundles) {
					if (similarBundleIds.has(b.id) || b.id === bundle.id) {
						continue;
					}

					similarBundles.push(b);

					similarBundleIds.add(b.id);
				}
			}
		}
	});
</script>

{#if bundle}
	<div class="hero bg-zinc-800 py-24 text-white">
		<div class="w-full px-24 sm:px-12 md:px-72">
			<h1 class="text-5xl font-bold text-center">Go from Beginner to Expert</h1>
			<p class="py-6 text-center">
				{bundle.description}
			</p>
			<div class="w-full sm:w-96 mx-auto">
				<BundlePrice {bundle} />
			</div>
		</div>
	</div>

	<div class="hero bg-zinc-300">
		<div class="w-full  px-24 sm:px-12 md:px-72 py-24">
			<div><h1 class="text-2xl font-bold py-5">Similar Items</h1></div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each similarBundles.slice(0, 3) as bundle (bundle.id)}
					<BundleBriefPrice {bundle} />
				{/each}
			</div>
		</div>
	</div>
{/if}
