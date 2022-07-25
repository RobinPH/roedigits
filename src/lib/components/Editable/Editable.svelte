<script lang="ts">
	import trpc, { type InferQueryOutput } from '$lib/trpc/client';

	import { account } from '$store/account';
	import { getContext, onMount, setContext } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import { writable } from 'svelte/store';
	import * as Yup from 'yup';

	export let id: number;
	export let query: Parameters<typeof trpc['query']>[0];

	export let onSubmit = async (values: Record<string, any>) => {
		const x = await trpc.query(query, {
			id,
			data: values
		});
	};
	export let validationSchema = Yup.object();
	export let initialValues: Record<string, any> = {};
	export let hidden = false;

	let authenticated: boolean | undefined;
	let isHovering = false;

	const isEditting = writable(false);

	const authenticate = () => {
		return !!$account && $account.type === 'ADMIN';
	};

	onMount(async () => {
		authenticated = authenticate();
	});

	const { form, handleChange, handleSubmit, errors } = createForm({
		initialValues,
		validationSchema,
		onSubmit
	});

	let submitButton: HTMLButtonElement;

	setContext('isEditting', isEditting);
	setContext('form', form);
	setContext('handleChange', (event: Event) => {
		// @ts-ignore
		const [key, index] = event.target.id.split('.');

		form.update((form) => {
			if (index) {
				// @ts-ignore
				form[key][index] = event.target.value;
			} else {
				// @ts-ignore
				form[key] = event.target.value;
			}

			return {
				...form
			};
		});
	});
</script>

{#if authenticated}
	<div
		class={`card box-border ${$isEditting || isHovering ? 'border-4 hover:border-success' : ''}`}
		on:focus={() => (isHovering = true)}
		on:mouseover={() => (isHovering = true)}
		on:blur={() => (isHovering = false)}
		on:mouseout={() => (isHovering = false)}
	>
		<button
			class="absolute top-0 right-0 p-1 m-1 text-xs btn btn-ghost btn-circle btn-sm"
			class:hidden={!isHovering || $isEditting}
			on:click={() => {
				isEditting.set(true);
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
				<path
					fill-rule="evenodd"
					d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		<div class="absolute bottom-0 right-0 m-1 text-xs" class:hidden={!$isEditting}>
			<button class="btn btn-error btn-xs" on:click={() => isEditting.set(false)}>Cancel</button>
			<button
				class="btn btn-success btn-xs"
				on:click={() => {
					if (submitButton) {
						submitButton.click();
					}
					isEditting.set(false);
				}}>Save</button
			>
		</div>
		{#if $isEditting}
			<form on:submit={handleSubmit}>
				<slot />
				<button class="hidden" bind:this={submitButton} />
			</form>
		{:else}
			<slot />
		{/if}
	</div>
{:else if !hidden}
	<slot />
{/if}
