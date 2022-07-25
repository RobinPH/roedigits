<script lang="ts">
	import Footer from '$lib/Footer/Footer.svelte';
	import Header from '$lib/Header/Header.svelte';

	import '../app.css';
</script>

<div data-theme="corporate">
	<div class="min-h-screen bg-slate-400">
		<Header />
		<slot />
	</div>
	<Footer />
</div>
