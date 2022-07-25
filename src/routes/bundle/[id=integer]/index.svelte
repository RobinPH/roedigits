<script lang="ts">
	import { onMount } from 'svelte';
	import trpc, { type InferQueryOutput } from '$lib/trpc/client';
	import CourseAsBundleBriefInfo from '$lib/components/Bundle/CourseAsBundleBriefInfo.svelte';
	import { page } from '$app/stores';
	import { myBundles } from '$store/account';
	import { minuteFormat } from '$lib/utility';
	import BundleActionButton from '$lib/components/Bundle/BundleActionButton.svelte';
	import Loading from '$lib/components/Loading/Loading.svelte';

	let id = parseInt($page.params.id);

	let bundle: InferQueryOutput<'bundle.get'>;
	let uniqueOwners: number = 0;
	let owned = false;
	let isSingle = false;

	$: if (bundle) {
		owned = $myBundles.find((b) => bundle && b.id === bundle.id) !== undefined;
	}

	onMount(async () => {
		bundle = await trpc.query('bundle.get', { id });
		myBundles.set(await trpc.query('account.myBundles'));
		isSingle = bundle ? bundle.courses.length === 1 : false;

		trpc.query('bundle.getUniqueOwnersCount').then((count) => {
			uniqueOwners = count;
		});
	});
</script>

{#if bundle}
	<div class="hero min-h-screen bg-base-200 px-24 sm:px-12 md:px-48">
		<div class="flex w-full">
			<div class={`card rounded-lg shadow-2xl ${owned ? 'border-4 border-warning' : ''}`}>
				{#if owned}
					<span class="absolute top-0 left-0 bg-warning m-2 p-2 text-xs font-bold rounded"
						>OWNED</span
					>
				{/if}
				<img src={bundle.image} class="rounded-lg shadow-2xl" alt="course-thumbnail" />
			</div>
			<div class="my-auto pl-10">
				<h1 class="text-5xl font-bold">{bundle.name}</h1>
				<p class="py-6">
					{bundle.description}
				</p>
				<BundleActionButton {bundle} {owned} {isSingle} />
			</div>
		</div>
	</div>
	<div class="hero bg-blue-100 px-24 sm:px-12 md:px-48 py-24">
		<div class="flex w-full space-x-5">
			<div class="w-full">
				<h1 class="text-5xl font-bold">{bundle.details?.title}</h1>
				<p class="py-6">{bundle.details?.description}</p>
				<BundleActionButton {bundle} {owned} {isSingle} />
			</div>
			<div class="w-full justify-end hidden sm:block">
				<div class="card bg-base-100 shadow-xl border-t-8 w-fit ml-auto">
					<div class="card-body">
						{#each bundle.features as feature (feature.id)}
							<div>
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
										<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
									</svg>
									<span class="truncate font-bold">{feature.name}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if bundle.details}
		<div class="hero bg-green-100 px-24 sm:px-12 md:px-72 py-24">
			<div class="w-full">
				<h1 class="text-xl font-bold">By the end of this course, you'll be able to…</h1>
				{#each bundle.details.whatYouWillBeAbleTo as whatYouWillBeAbleTo}
					<p>- {whatYouWillBeAbleTo}</p>
				{/each}
			</div>
		</div>
		<div class="hero bg-yellow-100 px-24 sm:px-12 md:px-72 py-24">
			<div class="w-full">
				<h1 class="text-xl font-bold">What You'l Learn...</h1>
				{#each bundle.details.whatYouWillLearn as whatYouWillLearn}
					<p>- {whatYouWillLearn}</p>
				{/each}
			</div>
		</div>
	{/if}
	<div class="hero bg-base-200 px-24 sm:px-12 md:px-72 py-24">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-2xl font-bold py-5">Join {uniqueOwners} happy students!</h1>
				<BundleActionButton {bundle} {owned} {isSingle} />
			</div>
		</div>
	</div>
	<div class="hero bg-red-200 px-24 sm:px-12 md:px-72 py-24">
		<div class="w-full">
			<h1 class="text-2xl font-bold py-5">Your Instructor</h1>
			<div class="flex space-x-5">
				<div>
					<img
						src="https://www.filepicker.io/api/file/su7jLanLRmmanlmn5RyO"
						class="max-w-[10rem] rounded-lg shadow-2xl"
						alt="instructor"
					/>
					<p class="text-center font-bold">Christian Roed</p>
				</div>
				<div>
					<p>
						Hi! My name is Mosh Hamedani. I'm a software engineer with two decades of experience.
						I've taught millions of people how to code and how to become professional software
						engineers through my online courses and YouTube channel.
					</p>
					<br />
					<p>I believe coding should be fun and accessible to everyone.</p>
				</div>
			</div>
		</div>
	</div>
	{#if bundle}
		{#if bundle.courses.length > 1}
			<div class="hero bg-green-100 px-24 sm:px-12 md:px-72 py-24">
				<div class="w-full">
					<div><h1 class="text-2xl font-bold py-5">Courses Included with Purchase</h1></div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each bundle.courses as course (course.id)}
							<CourseAsBundleBriefInfo {course} />
						{/each}
					</div>
				</div>
			</div>
		{:else if bundle.courses.length === 1}
			<div class="hero bg-green-100 px-24 sm:px-12 md:px-72 py-24">
				<div class="w-full">
					<div><h1 class="text-2xl font-bold py-5">Course Curriculum</h1></div>
					{#each bundle.courses[0].curricula as curriculum (curriculum.id)}
						<div class="mb-2">
							<h2 class="font-bold text-bold p-2 bg-gray-400">{curriculum.title}</h2>
							{#each curriculum.contents.sort((a, b) => a.index - b.index) as content (content.id)}
								<div class="flex justify-between bg-slate-100 p-2">
									<p>
										{content.index} - {content.title} ({minuteFormat(content.video.length)})
									</p>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
{:else}
	<div><Loading /></div>
{/if}
