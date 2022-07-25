<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { delay } from '$lib/utility';
	import type { Account } from '$lib/account/Account';
	import { account } from '$store/account';

	export let destination = $page.url.pathname;

	let authenticated: boolean | undefined;

	const authenticate = () => !!$account;

	onMount(async () => {
		const result = authenticate();

		if (!result) {
			goto('/login?destination=' + destination);
		}

		authenticated = result;
	});
</script>

{#if authenticated === true}
	<slot {account} />
{:else if authenticated === undefined}
	<span>Loading....</span>
{/if}
