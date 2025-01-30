<script lang="ts">
	import DownloadZip from '$lib/components/DownloadZip.svelte';
	import ConvertedFile from '$lib/components/ConvertedFile.svelte';
	import { convertedStore } from '$lib/stores/convertedStore';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Heading from '$lib/components/Heading.svelte';

	onMount(() => {
		// Scroll to the top of the page
		window.scrollTo(0, 0);
		if ($convertedStore.length === 0) {
			goto('/');
		}
	});
</script>

<Heading>Download Your Converted Files</Heading>
<div class="mt-3 w-full rounded-md border-2 border-blue-500 shadow-md md:mt-10">
	{#each $convertedStore as file (file.url)}
		<ConvertedFile {file} />
	{/each}
</div>
<div class="mt-3 flex w-full flex-row flex-wrap items-center justify-end gap-3">
	<DownloadZip />
	<Button size="lg" variant="outline" aria-label="Return to Home"
		><a href="/">Return To Home</a></Button
	>
</div>
