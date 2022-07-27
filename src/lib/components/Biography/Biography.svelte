<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';
	import trpc from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import Editable from '../Editable/Editable.svelte';
	import EditableImage from '../Editable/EditableImage.svelte';
	import EditableText from '../Editable/EditableText.svelte';
	import EditableTextArea from '../Editable/EditableTextArea.svelte';
	import * as Yup from 'yup';

	export let id: number = 1;
	let instructor: InferQueryOutput<'instructor.get'>;

	onMount(async () => {
		instructor = await trpc.query('instructor.get', { id });
	});
</script>

{#if instructor}
	<Editable
		{id}
		query="instructor.updateInstructor"
		initialValues={{
			name: instructor.name,
			biography: instructor.biography,
			image: instructor.image
		}}
		validationSchema={Yup.object({
			name: Yup.string().required('Required'),
			biography: Yup.string().required('Required'),
			image: Yup.string().required('Required')
		})}
	>
		<div class="block lg:flex lg:space-x-5 text-center lg:text-left">
			<div class="">
				<EditableImage
					id="image"
					class="m-auto max-w-[10rem] rounded-lg shadow-2xl"
					alt="instructor"
				/>
				<p class="font-bold"><EditableText id="name" /></p>
			</div>
			<div>
				<EditableTextArea id="biography" />
			</div>
		</div>
	</Editable>
{/if}
