<script lang="ts">
	import { Download, LoaderCircle } from 'lucide-svelte';

	let { file } = $props();
	let isdownloading = $state(false);
	async function handleDownload(fileName: string, fileUrl: string) {
		isdownloading = true;
		try {
			// Fetch the file from the URL
			const response = await fetch(fileUrl);
			const blob = await response.blob();

			// Create a temporary URL for the blob
			const blobUrl = window.URL.createObjectURL(blob);

			// Create a temporary anchor element
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = fileName || fileUrl.split('/').pop() || 'download';

			// Append to body, click, and remove
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the URL object
			window.URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Download failed:', error);
			// Handle error (e.g., show notification)
			alert('Download failed');
		} finally {
			isdownloading = false;
		}
	}
</script>

<div class="flex w-full flex-row flex-wrap items-center justify-between px-2 py-2">
	<div class="flex flex-row justify-center gap-10">
		<p class="text-sm md:text-base">{file.name}</p>
		<p class=" hidden text-gray-500 md:block md:text-base"><strong>Type:</strong> {file.type}</p>
	</div>
	<button
		onclick={() => handleDownload(file.name, file.url)}
		class="rounded bg-blue-500 p-2 text-white"
	>
		{#if isdownloading}
			<LoaderCircle size={16} class="size-4 animate-spin" />
		{:else}
			<Download size={16} class="size-4" />
		{/if}
	</button>
</div>
