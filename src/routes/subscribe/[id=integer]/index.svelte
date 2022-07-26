<script lang="ts">
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import AnimatedElement from '$lib/components/AnimatedElement.svelte';
	import BundleBriefInfo from '$lib/components/Bundle/BundleBriefInfo.svelte';
	import BundleBriefPrice from '$lib/components/Bundle/BundleBriefPrice.svelte';
	import BundlePrice from '$lib/components/Bundle/BundlePrice.svelte';
	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import type { Bundle, Course } from '@prisma/client';
	import { onMount } from 'svelte';
	import { myBundles } from '$store/account';
	import { goto } from '$app/navigation';

	const id = parseInt($page.params.id);

	let bundle: InferQueryOutput<'bundle.get'>;

	let similarBundles = new Array<
		Bundle & {
			courses: Course[];
		}
	>();

	let isSingle: boolean = false;

	onMount(async () => {
		myBundles.set(await trpc.query('account.myBundles'));
		bundle = await trpc.query('bundle.get', { id });

		isSingle = bundle ? bundle.courses.length === 1 : false;

		const similarBundleIds = new Set<number>();

		if (bundle) {
			if ($myBundles.find((b) => b.id === bundle.id)) {
				goto(`/bundle/${bundle.id}`);
			}

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
	<div class="hero bg-zinc-800 py-24 text-[#F8F7F9]">
		<div class="w-full px-4 sm:px-12 md:px-72">
			<div in:fly={{ y: 200, duration: 1000 }}>
				<h1 class="text-5xl font-bold text-center">Go from Beginner to Expert</h1>

				<p class="py-6 text-center">
					{bundle.description}
				</p>
			</div>
			<div class="w-full sm:w-96 mx-auto" in:fly={{ y: 200, duration: 1500 }}>
				<BundlePrice {bundle} />
			</div>
		</div>
	</div>

	<div class="hero bg-zinc-300">
		<div class="w-full  px-4 sm:px-12 md:px-72 py-24">
			<!-- <AnimatedElement> -->
			<div in:fly={{ y: 200, duration: 1500 }}>
				<h1 class="text-2xl font-bold py-5">Similar Items</h1>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each similarBundles.slice(0, 3) as bundle, i (bundle.id)}
					<div in:fly={{ y: 200, duration: 2000 + 500 * i }}>
						<BundleBriefPrice {bundle} />
					</div>
				{/each}
			</div>
			<!-- </AnimatedElement> -->
		</div>
	</div>
{/if}
