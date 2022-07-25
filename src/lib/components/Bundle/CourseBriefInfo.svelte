<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';

	export let course: InferQueryOutput<'bundle.getAll'>[number]['courses'][number];
</script>

<a
	sveltekit:reload
	class="card card-compact w-full bg-base-100 shadow-xl 'duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:cursor-pointer"
	href={`/course/${course.id}`}
>
	<figure><img src={course.image} alt="course-thumbnail" /></figure>
	<div class="card-body">
		<h2 class="card-title">{course.name}</h2>
		<p>{course.description}</p>
	</div>
</a>
