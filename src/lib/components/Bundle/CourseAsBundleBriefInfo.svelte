<script lang="ts">
	import type { InferQueryOutput } from '$lib/trpc/client';
	import BundleBriefInfo from './BundleBriefInfo.svelte';

	export let course: InferQueryOutput<'bundle.getAll'>[number]['courses'][number];

	$: bundle = course.bundles.find(
		(bundle) => bundle.courses.length === 1 && bundle.courses[0].id === course.id
	);
</script>

{#if bundle}
	<BundleBriefInfo {bundle} />
{/if}
