<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
	import { account } from '$store/account';
	import { goto } from '$app/navigation';

	const routes = [
		{
			key: 'subscribe',
			label: 'Subscribe',
			path: '/subscribe'
		},
		{
			key: 'courses',
			label: 'Courses',
			path: '/bundles'
		},
		{
			key: 'more',
			label: 'More',
			sub: [
				{
					key: 'about-us',
					label: 'About Us',
					path: '/about'
				},
				{
					key: 'faq',
					label: 'Frequently Asked Question',
					path: '/faq'
				},
				{
					key: 'contact-us',
					label: 'Contact Us',
					path: '/contact'
				}
			]
		}
	];
</script>

<!-- svelte-ignore a11y-missing-attribute -->

<div class="navbar bg-zinc-900 text-[#F8F7F9] lg:px-44">
	<div class="navbar-start">
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
			>
				{#each routes as route (route.key)}
					{#if route.path}
						<li><a href={route.path}>{route.label}</a></li>
					{:else if route.sub}
						<li tabindex="0">
							<a class="justify-between">
								{route.label}
								<svg
									class="fill-current"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg
								>
							</a>
							<ul class="p-2">
								{#each route.sub as sub (sub.key)}
									<li><a href={sub.path}>{sub.label}</a></li>
								{/each}
							</ul>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<a class="btn btn-ghost normal-case text-xl hover:bg-warning hover:text-black" href="/">
			<div class="w-10 rounded-full pr-2">
				<img src="/images/logo.png" alt="roedigits-logo" class="w-auto" />
			</div>
			<p>RoeDigits</p>
		</a>
		<ul class="menu menu-horizontal p-0 space-x-2 invisible lg:visible">
			{#each routes as route (route.key)}
				{#if route.path}
					<a class="btn btn-ghost hover:bg-warning hover:text-black rounded-btn" href={route.path}
						>{route.label}</a
					>
				{:else if route.sub}
					<div class="dropdown ">
						<label tabindex="0" class="btn btn-ghost rounded-btn hover:bg-warning hover:text-black"
							>{route.label}
							<svg
								class="fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
							></label
						>
						<ul
							tabindex="0"
							class="menu dropdown-content p-2 shadow rounded-box w-52 mt-4 bg-zinc-900"
						>
							{#each route.sub as sub (sub.key)}
								<li>
									<a href={sub.path} class="w-full hover:bg-warning hover:text-black">{sub.label}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		</ul>
	</div>

	<div class="navbar-end space-x-2">
		{#if $account}
			<div class="dropdown dropdown-end">
				<button class="btn btn-ghost hover:bg-warning hover:text-black">
					<p class="px-2">{$account.email}</p>
					<div class="w-10 rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-10 w-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</button>
				<ul
					tabindex="0"
					class="menu menu-compact bg-zinc-900 dropdown-content mt-3 p-2 shadow rounded-box w-52"
				>
					<li>
						<button
							class="hover:bg-warning hover:text-black"
							on:click={() => {
								goto('/myBundles');
							}}>My Courses</button
						>
					</li>
					<li>
						<button
							class="hover:bg-warning hover:text-black"
							on:click={() => {
								account.set(null);
								goto('/');
							}}>Logout</button
						>
					</li>
				</ul>
			</div>
		{:else}
			<button class="btn btn-ghost" on:click={() => goto('/login')}>Login</button>
			<button class="btn btn-warning" on:click={() => goto('/register')}>Register</button>
		{/if}
	</div>
</div>
