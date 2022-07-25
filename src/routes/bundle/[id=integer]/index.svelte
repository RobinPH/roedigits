<script lang="ts">
	import { onMount } from 'svelte';
	import trpc, { type InferQueryOutput } from '$lib/trpc/client';
	import CourseAsBundleBriefInfo from '$lib/components/Bundle/CourseAsBundleBriefInfo.svelte';
	import { page } from '$app/stores';
	import { myBundles } from '$store/account';
	import { minuteFormat } from '$lib/utility';
	import BundleActionButton from '$lib/components/Bundle/BundleActionButton.svelte';
	import Loading from '$lib/components/Loading/Loading.svelte';
	import Editable from '$lib/components/Editable/Editable.svelte';
	import * as Yup from 'yup';
	import EditableTextAreaInput from '$lib/components/Editable/EditableTextArea.svelte';
	import EditableTextInput from '$lib/components/Editable/EditableText.svelte';
	import EditableImage from '$lib/components/Editable/EditableImage.svelte';
	import EditableText from '$lib/components/Editable/EditableText.svelte';
	import EditableList from '$lib/components/Editable/EditableList.svelte';
	import Biography from '$lib/components/Biography/Biography.svelte';

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
	<Editable
		{id}
		hidden={true}
		query="bundle.updateBundle"
		initialValues={{
			price: bundle.price,
			discount: bundle.discount
		}}
		validationSchema={Yup.object({
			price: Yup.number().required('Required'),
			discount: Yup.number().required('Required')
		})}
	>
		<div class="bg-gray-300 p-5">
			<div>Price: <EditableTextInput id="price" /></div>
			<div>Discount: <EditableTextInput id="discount" /></div>
		</div>
	</Editable>
	<div class="hero min-h-screen bg-base-200 px-24 sm:px-12 md:px-48">
		<Editable
			{id}
			query="bundle.updateBundle"
			initialValues={{
				name: bundle.name,
				description: bundle.description,
				image: bundle.image
			}}
			validationSchema={Yup.object({
				name: Yup.string().required('Required'),
				description: Yup.string().required('Required'),
				image: Yup.string().required('Required')
			})}
		>
			<div class="flex w-full">
				<div class={`card rounded-lg ${owned ? 'border-4 border-warning' : ''}`}>
					{#if owned}
						<span class="absolute top-0 left-0 bg-warning m-2 p-2 text-xs font-bold rounded"
							>OWNED</span
						>
					{/if}
					<EditableImage id="image" class="rounded-lg shadow-2xl" alt="course-thumbnail" />
				</div>
				<div class="my-auto pl-10">
					<h1 class="text-5xl font-bold"><EditableTextInput id="name" /></h1>
					<p class="py-6">
						<EditableTextAreaInput id="description" />
					</p>
					<BundleActionButton {bundle} {owned} {isSingle} />
				</div>
			</div>
		</Editable>
	</div>
	<div class="hero bg-blue-100 px-24 sm:px-12 md:px-48 py-24">
		<div class="flex w-full space-x-5">
			<div class="w-full">
				<Editable
					id={bundle.details.id}
					query="bundle.updateBundleDetails"
					initialValues={{
						title: bundle.details?.title,
						description: bundle.details?.description
					}}
					validationSchema={Yup.object({
						title: Yup.string().required('Required'),
						description: Yup.string().required('Required')
					})}
				>
					<h1 class="text-5xl font-bold"><EditableTextInput id="title" /></h1>
					<p class="py-6">
						<EditableTextAreaInput id="description" />
					</p>
				</Editable>
				<BundleActionButton {bundle} {owned} {isSingle} />
			</div>
			<div class="w-full justify-end hidden sm:block">
				<div class="card bg-base-100 shadow-xl border-t-8 w-fit ml-auto">
					<div class="card-body">
						<Editable
							{id}
							query="bundle.updateBundle"
							initialValues={{
								features: bundle.features
							}}
							validationSchema={Yup.object({
								x: Yup.array().of(Yup.string().required('Required'))
							})}
						>
							<EditableList id="features" />
							{#each bundle.features as feature, i (i)}
								<div>
									<div class="flex align-middle">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 my-auto"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
										<div class="truncate font-bold my-auto">
											<EditableText id={`features.${i}`} />
										</div>
									</div>
								</div>
							{/each}
						</Editable>
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if bundle.details}
		<!-- <div class="hero bg-green-100 px-24 sm:px-12 md:px-72 py-24">
			<div class="w-full">
				<h1 class="text-xl font-bold">By the end of this course, you'll be able to…</h1>
				<Editable
					id={bundle.details.id}
					query="bundle.updateBundleDetails"
					initialValues={{
						whatYouWillBeAbleTo: bundle.details.whatYouWillBeAbleTo
					}}
					validationSchema={Yup.object({
						title: Yup.array().of(Yup.string().required('Required'))
					})}
				>
					<EditableList id="whatYouWillBeAbleTo" />
					{#each bundle.details.whatYouWillBeAbleTo as whatYouWillBeAbleTo, i (i)}
						<div class="flex justify-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 my-auto"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<div><EditableText id={`whatYouWillBeAbleTo.${i}`} /></div>
						</div>
					{/each}
				</Editable>
			</div>
		</div> -->
		<div class="hero bg-yellow-100 px-24 sm:px-12 md:px-72 py-24">
			<div class="w-full">
				<h1 class="text-xl font-bold">What You'l Learn...</h1>
				<Editable
					id={bundle.details.id}
					query="bundle.updateBundleDetails"
					initialValues={{
						whatYouWillLearn: bundle.details.whatYouWillLearn
					}}
					validationSchema={Yup.object({
						x: Yup.array().of(Yup.string().required('Required'))
					})}
				>
					<EditableList id="whatYouWillLearn" />
					{#each bundle.details.whatYouWillLearn as whatYouWillLearn, i}
						<div class="flex justify-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 my-auto"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<div><EditableText id={`whatYouWillLearn.${i}`} /></div>
						</div>
					{/each}
				</Editable>
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
			<Biography />
		</div>
	</div>
	{#if bundle && false}
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
