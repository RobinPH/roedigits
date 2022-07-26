<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import { delay, getBundlePrice } from '$lib/utility';
	import { account } from '$store/account';
	import { v4 as uuidv4 } from 'uuid';

	export let label: string;
	export let bundle: InferQueryOutput<'bundle.get'>;
	const isSingle = bundle ? bundle.courses.length === 1 : false;
	let isPurchasing = false;
	const id = uuidv4();
</script>

<label for={id} class="btn btn-primary w-full modal-button">{label}</label>
<input type="checkbox" {id} class="modal-toggle" />
<label for={id} class="modal cursor-pointer">
	<label class="modal-box w-full sm:w-1/2 relative z-50" for="">
		<label for={id} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
		<h3 class="text-lg font-bold">Confirmation</h3>
		{#if bundle}
			<div class="py-4 flex justify-between">
				<div class="text-left">
					{#if isSingle}
						<p class="text-xl font-bold">
							Course: <a href={`/bundle/${bundle.id}`}><b>{bundle.courses[0].name}</b></a>
						</p>
						<p>Single Course Payment</p>
					{:else}
						<p class="text-xl font-bold">
							Bundle: <a href={`/bundle/${bundle.id}`}><b>{bundle.name}</b></a>
						</p>
						<p>Complete Bundle Payment</p>
					{/if}
				</div>
				<div class="text-right">
					<p>
						Price: <span class="font-bold text-xl">₱{getBundlePrice(bundle)}</span>
					</p>
				</div>
			</div>
			<button
				class="btn btn-primary w-full"
				class:loading={isPurchasing}
				on:click={async () => {
					isPurchasing = true;

					try {
						if (!$account) {
							const destination = $page.url.pathname;
							goto(`/login?destination=${destination}`);
							throw new Error('Not logged in');
						}
						if (bundle) {
							const success = await trpc.query('account.purchaseBundle', {
								id: bundle.id
							});

							if (success) {
								goto(`/bundle/${bundle.id}`);
							}
						}
					} catch (e) {
						console.error(e);
					} finally {
						isPurchasing = false;
					}
				}}
			>
				Confirm Purchase
			</button>
		{/if}
	</label>
</label>
