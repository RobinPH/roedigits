<script lang="ts">
	import trpc from '$lib/trpc/client';
	import { fly, fade } from 'svelte/transition';

	import { onMount } from 'svelte';
	import AnimatedElement from '$lib/components/AnimatedElement.svelte';

	let uniqueOwners: number = 0;

	onMount(async () => {
		uniqueOwners = await trpc.query('bundle.getUniqueOwnersCount');
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
<div class="hero min-h-screen bg-[url(/images/bg-3.jpg)]">
	<div class="hero-overlay bg-opacity-80" />
	<AnimatedElement>
		<div class="hero-content text-center text-neutral-content text-[#F8F7F9]">
			<div class="max-w-md" in:fade={{ duration: 1000 }}>
				<h1 class="mb-5 text-6xl font-bold">RoeDigits</h1>
				<p class="mb-5">
					RoeDigits is an online-based company made by students who love to teach math to anyone
					willing to learn it. Founded in 2022, RoeDigits set out itself to be a leading educational
					website that teaches different topics in Mathematics to anyone who wants to learn.
				</p>
				<a class="btn btn-warning" href="/register">Register Now</a>
			</div>
		</div>
	</AnimatedElement>
</div>
<div class="hero min-h-screen bg-zinc-300">
	<div class="hero-content w-full px-4 text-center">
		<AnimatedElement>
			<div in:fly={{ x: -200, duration: 2000 }}>
				<h1 class="text-6xl font-bold">Our Mission</h1>
				<p class="text-lg py-6">
					At RoeDigits, every person in our company loves math and loves to teach it. With the
					passion to spread that love of math with other people, we try our best to make learning
					math fast and efficient but in an enjoyable way. As much as we focus on helping our
					student learn efficiently and fast, we prioritize making learning math an enjoyable
					journey because we believe that the fastest way to make people fall in love with math is
					to make it fun and enjoyable.
				</p>
			</div>
		</AnimatedElement>
	</div>
</div>
<div class="hero min-h-screen bg-zinc-800">
	<div class="hero-content w-full px-4 text-center text-[#F8F7F9]">
		<AnimatedElement>
			<div in:fly={{ x: 200, duration: 2000 }}>
				<h1 class="text-6xl font-bold">Our Vision</h1>
				<p class="text-lg py-6">
					We at RoeDigits envision a future where Math is not something that intimidate people but
					something people enjoy and love.
				</p>
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
