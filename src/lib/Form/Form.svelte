<script lang="ts">
	import { setContext } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as Yup from 'yup';

	export let label: string;
	export let submitButtonLabel = 'Submit';
	export let initialValues: Record<string, any> = {};
	export let validationSchema = Yup.object();
	export let onSubmit: (values: Record<string, any>) => void = (values) => {};

	const { form, errors, state, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit
	});

	setContext('form', form);
	setContext('errors', errors);
	setContext('handleChange', handleChange);
	setContext('test', 'testvalue');
</script>

<div class="card w-96 bg-base-100 shadow-xl mx-auto">
	<div class="card-body">
		{#if label}
			<h2 class="card-title">{label}</h2>
		{/if}
		<form on:submit={handleSubmit}>
			<slot />
			<div class="card-actions">
				<button class="btn btn-primary w-full mt-5" type="submit">{submitButtonLabel}</button>
			</div>
		</form>
	</div>
</div>
