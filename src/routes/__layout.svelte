<script lang="ts">
	import Footer from '$lib/Footer/Footer.svelte';
	import Header from '$lib/Header/Header.svelte';

	import '../app.css';
</script>

<div data-theme="mytheme">
	<Header />
	<div class="min-h-screen bg-zinc-800">
		<slot />
	</div>
	<!-- <Footer /> -->
</div>
