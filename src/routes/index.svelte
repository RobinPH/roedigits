<script lang="ts">
	import trpc from '$lib/trpc/client';
	import { fly, fade } from 'svelte/transition';

	import { onMount } from 'svelte';
	import AnimatedElement from '$lib/components/AnimatedElement.svelte';
	import Editable from '$lib/components/Editable/Editable.svelte';
	import * as Yup from 'yup';
	import EditableText from '$lib/components/Editable/EditableText.svelte';
	import EditableTextArea from '$lib/components/Editable/EditableTextArea.svelte';

	let uniqueOwners: number = 0;
	let homeTitle: string | undefined;
	let homeDescription: string | undefined;
	let missionTitle: string | undefined;
	let missionDescription: string | undefined;
	let visionTitle: string | undefined;
	let visionDescription: string | undefined;
	let loaded = false;

	const get = async (for_: string) => {
		const pageText = await trpc.query('pageText.get', {
			for: for_
		});

		return pageText?.text;
	};

	onMount(async () => {
		uniqueOwners = await trpc.query('bundle.getUniqueOwnersCount');
		homeTitle = await get('homeTitle');
		homeDescription = await get('homeDescription');
		missionTitle = await get('missionTitle');
		missionDescription = await get('missionDescription');
		visionTitle = await get('visionTitle');
		visionDescription = await get('visionDescription');

		loaded = true;
	});
</script>

<!-- <div class="hero min-h-screen ">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div>
			<h1 class="text-6xl font-bold">RoeDigits</h1>
			<p class="py-6">
				RoeDigits is an online-based company made by students who love to teach math to anyone
				willing to learn it. Founded in 2022, RoeDigits set out itself to be a leading educational
				website that teaches different topics in Mathematics to anyone who wants to learn.
			</p>
			<a class="btn btn-primary" href="/register">Register</a>
		</div>
	</div>
</div> -->
{#if loaded}
	<div class="hero min-h-screen bg-[url(/images/bg-3.jpg)]">
		<div class="hero-overlay bg-opacity-80" />
		<AnimatedElement>
			<div class="hero-content text-center text-neutral-content text-[#F8F7F9]">
				<div class="max-w-md" in:fade={{ duration: 1000 }}>
					<Editable
						id={0}
						query="pageText.update"
						initialValues={{
							homeTitle: homeTitle,
							homeDescription: homeDescription
						}}
						validationSchema={Yup.object({
							homeTitle: Yup.string().required('Required'),
							homeDescription: Yup.string().required('Required')
						})}
					>
						<h1 class="mb-5 text-6xl font-bold"><EditableText id="homeTitle" /></h1>
						<p class="mb-5">
							<EditableTextArea id="homeDescription" />
						</p>
					</Editable>
					<a class="btn btn-warning" href="/register">Register Now</a>
				</div>
			</div>
		</AnimatedElement>
	</div>
	<div class="hero min-h-screen bg-zinc-300">
		<div class="hero-content w-full px-4 text-center">
			<AnimatedElement>
				<div in:fly={{ x: -200, duration: 2000 }}>
					<Editable
						id={0}
						query="pageText.update"
						initialValues={{
							missionTitle: missionTitle,
							missionDescription: missionDescription
						}}
						validationSchema={Yup.object({
							missionTitle: Yup.string().required('Required'),
							missionDescription: Yup.string().required('Required')
						})}
					>
						<h1 class="text-6xl font-bold"><EditableTextArea id="missionTitle" /></h1>
						<p class="text-lg py-6">
							<EditableTextArea id="missionDescription" />
						</p>
					</Editable>
				</div>
			</AnimatedElement>
		</div>
	</div>
	<div class="hero min-h-screen bg-zinc-800">
		<div class="hero-content w-full px-4 text-center text-[#F8F7F9]">
			<AnimatedElement>
				<div in:fly={{ x: 200, duration: 2000 }}>
					<Editable
						id={0}
						query="pageText.update"
						initialValues={{
							visionTitle: visionTitle,
							visionDescription: visionDescription
						}}
						validationSchema={Yup.object({
							visionTitle: Yup.string().required('Required'),
							visionDescription: Yup.string().required('Required')
						})}
					>
						<h1 class="text-6xl font-bold"><EditableTextArea id="visionTitle" /></h1>
						<p class="text-lg py-6">
							<EditableTextArea id="visionDescription" />
						</p>
					</Editable>
				</div>
			</AnimatedElement>
		</div>
	</div>
	<div class="hero min-h-screen bg-zinc-300">
		<div class="hero-content w-full px-4 text-center ">
			<AnimatedElement
				><div in:fly={{ y: 200, duration: 2000 }}>
					<h1 class="text-5xl font-bold">Join {uniqueOwners} Happy Students</h1>
					<p class="text-lg py-6">
						<a class="btn btn-warning font-bold" href="/register">REGISTER NOW</a>
					</p>
				</div></AnimatedElement
			>
		</div>
	</div>
{/if}
