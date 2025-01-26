<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Navbar />
<div class="mx-auto mt-5 w-full max-w-6xl px-3">{@render children()}</div>
<footer class="mt-10 border-t border-gray-200 py-6">
	<div class="flex justify-center">
		<p class="text-sm text-gray-600">© 2025 DoneWithWork. All rights reserved.</p>
	</div>
</footer>
