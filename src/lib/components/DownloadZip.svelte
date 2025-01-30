<script lang="ts">
	import { convertedStore } from '$lib/stores/convertedStore';
	import JSZip from 'jszip';
	import Button from '$lib/components/ui/button/button.svelte';

	let isdownloading = $state(false);

	async function downloadAsZip(files: { name: string; url: string }[]) {
		const zip = new JSZip();
		isdownloading = true;
		try {
			// Fetch all files in parallel
			const fetchPromises = files.map(async (file) => {
				const response = await fetch(file.url);
				if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
				const blob = await response.blob();
				zip.file(file.name, blob);
			});

			await Promise.all(fetchPromises);

			// Generate ZIP file
			const content = await zip.generateAsync({ type: 'blob' });

			// Trigger download
			const url = window.URL.createObjectURL(content);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'archive.zip';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			// Alternative using file-saver:
			// saveAs(content, 'archive.zip');
		} catch (error) {
			console.error('ZIP creation failed:', error);
			// Handle error (show notification, etc.)
		} finally {
			isdownloading = false;
		}
	}
</script>

<Button
	size="lg"
	class="rounded bg-blue-500 p-2 text-white shadow-xl"
	disabled={$convertedStore.length === 0 || isdownloading}
	onclick={() => downloadAsZip($convertedStore.map((file) => ({ name: file.name, url: file.url })))}
>
	Download All as ZIP
</Button>
