<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';
	import { getBundlePrice } from '$lib/utility';
	import BundleBuyModal from './BundleBuyModal.svelte';

	export let bundle: InferQueryOutput<'bundle.get'>;

	const isSingle = bundle ? bundle.courses.length === 1 : false;
</script>

{#if bundle}
	<div class="card bg-base-100 shadow-xl mx-auto w-full ">
		<div class="card-body text-center">
			{#if isSingle}
				<p class="text-2xl font-bold">
					Course: <a href={`/bundle/${bundle.id}`}><b>{bundle.courses[0].name}</b></a>
				</p>
				<p>Single Course Payment</p>
			{:else}
				<p class="text-2xl font-bold">
					Bundle: <a href={`/bundle/${bundle.id}`}><b>{bundle.name}</b></a>
				</p>
				<p>Complete Bundle Payment</p>
			{/if}
			<div class=" py-10">
				<span class="text-5xl">₱{getBundlePrice(bundle)}</span>
				<div class="my-auto inline-block -translate-y-2"><del>₱{bundle.price}</del></div>
				<p class="pt-4"><b>Limited time at this price!</b></p>
			</div>
			<div class="card-actions">
				<BundleBuyModal label="Buy Now" {bundle} />
			</div>
		</div>
	</div>
{/if}
