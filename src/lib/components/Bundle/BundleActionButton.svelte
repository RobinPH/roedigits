<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';

	export let bundle: InferQueryOutput<'bundle.get'>;
	export let owned: boolean;
	export let isSingle: boolean;
</script>

{#if bundle}
	{#if !owned}
		<a class="btn btn-warning font-bold" href={`/subscribe/${bundle.id}`}>Enroll Now</a>
	{:else if bundle.courses.length === 1}
		<a class="btn btn-warning font-bold" href={`/course/${bundle.courses[0].id}`}>Start Learning</a>
	{:else}
		<div class="dropdown">
			<label tabindex="0" class="btn m-1 btn-warning">Start Learning</label>
			<ul
				tabindex="0"
				class="dropdown-content menu p-2 shadow bg-warning rounded-box min-w-max text-left"
			>
				{#each bundle.courses as course (course.id)}
					<li>
						<a class="btn btn-warning text-left hover:btn-ghost" href="#">{course.name}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/if}
