<script lang="ts">
	import { onMount } from 'svelte';
	import trpc, { type InferQueryOutput } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import Authenticated from '$lib/auth/Authenticated.svelte';
	import type { Account } from '$lib/account/Account';
	import { goto } from '$app/navigation';
	import { minuteFormat } from '$lib/utility';

	export let id = parseInt($page.params.id);

	let course: InferQueryOutput<'course.get'>;
	let account: Account;
	let hasAccess: boolean | undefined;

	onMount(async () => {
		course = await trpc.query('course.get', { id });

		if (!course) {
			goto('/bundles');
			return;
		}

		hasAccess = await trpc.query('account.hasAccessToCourse', {
			id
		});

		if (!hasAccess) {
			if (course.bundles.length > 0) {
				goto(`/bundle/${course.bundles[0].id}`);
			} else {
				goto('/bundles');
			}
		}
	});
</script>

<Authenticated let:account>
	{#if hasAccess === true && course}
		<div class="hero bg-green-100 px-24 sm:px-12 md:px-72 py-24">
			<div class="w-full">
				<h1 class="text-5xl font-bold text-center">{course.name}</h1>
				<div><h1 class="text-2xl font-bold py-5">Course Curriculum</h1></div>
				{#each course.curricula as curriculum (curriculum.id)}
					<div class="mb-2">
						<h2 class="font-bold text-bold p-2 bg-gray-400">{curriculum.title}</h2>
						{#each curriculum.contents.sort((a, b) => a.index - b.index) as content (content.id)}
							<div class="flex justify-between bg-slate-100 p-2">
								<p>
									{content.index} - {content.title} ({minuteFormat(content.video.length)})
								</p>
								<a class="btn btn-primary btn-xs" href={content.video.link}>GO</a>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{:else if hasAccess === undefined}
		Loading...
	{/if}
</Authenticated>
