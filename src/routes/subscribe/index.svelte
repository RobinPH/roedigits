<script lang="ts">
	import AnimatedElement from '$lib/components/AnimatedElement.svelte';
	import BundlePrice from '$lib/components/Bundle/BundlePrice.svelte';
	import Loading from '$lib/components/Loading/Loading.svelte';
	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import { myBundles } from '$store/account';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let bundles: InferQueryOutput<'bundle.getAll'>;
	let shownBundles: InferQueryOutput<'bundle.getAll'>;

	onMount(async () => {
		bundles = (await trpc.query('bundle.getAll'))
			.filter((bundle) => !$myBundles.some((b) => b.id === bundle.id))
			.sort((a, b) => {
				return b.courses.length - a.courses.length;
			});

		shownBundles = bundles.slice(0, 6);
	});
</script>

{#if bundles}
	<div class="py-20 px-24 sm:px-12 md:px-32 bg-zinc-800">
		{#if shownBundles.length > 0}
			<div class="text-transparent">a</div>
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				in:fly={{ y: 200, duration: 1000 }}
			>
				{#each shownBundles as bundle (bundle.id)}
					<BundlePrice {bundle} />
				{/each}
			</div>
			{#if shownBundles.length < bundles.length}
				<div class="mt-4 w-full text-center">
					<button
						class="btn btn-primary w-full md:w-48"
						on:click={() => {
							shownBundles = bundles;
						}}
					>
						Show All
					</button>
				</div>
			{/if}
		{:else}
			<div class="text-[#F8F7F9]">
				<h1 class="text-5xl font-bold py-5">You have purchased all items</h1>
				<p class="text-lg">No more items available to purchase</p>
			</div>
		{/if}
	</div>
{:else}
	<Loading />
{/if}
