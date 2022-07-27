<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';
	import { myBundles } from '$store/account';

	export let bundle: InferQueryOutput<'bundle.getAll'>[number];

	$: owned = $myBundles.some((b) => b.id === bundle.id);
</script>

<a
	sveltekit:reload
	class={`card card-compact w-full bg-base-100 shadow-xl duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:cursor-pointer border-8  ${
		owned ? 'border-warning' : 'border-[#F8F7F9]'
	}`}
	href={`/bundle/${bundle.id}/${bundle.name.replace(/[^a-z0-9+]+/gi, '+')}`}
>
	{#if owned}
		<span class="absolute top-0 left-0 bg-warning m-2 p-2 text-xs font-bold rounded text-black"
			>OWNED</span
		>
	{/if}

	<figure><img src={bundle.image} alt="course-thumbnail" /></figure>
	<div class={`card-body ${owned ? 'bg-warning' : 'bg-[#F8F7F9]'}`}>
		<h2 class="card-title">{bundle.name}</h2>
		<p>{bundle.description}</p>

		{#if bundle.courses && bundle.courses.length > 1}
			<br />
			<p>{bundle.courses.length} Course Bundle</p>
		{/if}
	</div>
</a>
