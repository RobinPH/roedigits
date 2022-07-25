<script lang="ts">
	import Footer from '$lib/Footer/Footer.svelte';
	import Header from '$lib/Header/Header.svelte';

	import '../app.css';
</script>

<div data-theme="mytheme">
	<div class="min-h-screen bg-zinc-800">
		<Header />
		<slot />
	</div>
	<!-- <Footer /> -->
</div>
