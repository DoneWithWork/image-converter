<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children } = $props();
	let loading = $state(false);
	let hidden = $state(false);
	let progress = $state(0);
	onMount(() => {
		beforeNavigate(() => {
			console.log('beforeNavigate');
			loading = true;
			hidden = false;
			progress = 0;
			incrementProgress();
		});
		afterNavigate(() => {
			console.log('afterNavigate');
			progress = 100;
			setTimeout(() => {
				loading = false;
				hidden = true;
				progress = 0;
			}, 300);
		});
	});
	function incrementProgress() {
		if (loading) {
			setTimeout(() => {
				progress += Math.random() * 10;
				if (progress < 90) incrementProgress();
			}, 100);
		}
	}
</script>

<div
	class={`fixed left-0 top-0 h-1 bg-blue-500 transition-all duration-200 ${hidden ? 'opacity-0' : 'opacity-100'}`}
	style="width: {progress}%"
></div>
<Navbar />
<div class="mx-auto mt-5 h-screen w-full max-w-6xl px-3">{@render children()}</div>
<footer class="mt-10 border-t border-gray-200 py-6">
	<div class="flex justify-center">
		<p class="text-sm text-gray-600">© 2025 DoneWithWork. All rights reserved.</p>
	</div>
</footer>
