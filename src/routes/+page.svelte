<script lang="ts">
	import { goto } from '$app/navigation';
	import Cta from '$lib/components/CTA.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import Header from '$lib/components/Header.svelte';
	import InputFiles from '$lib/components/InputFiles.svelte';
	import InputForm from '$lib/components/inputForm.svelte';
	import { setConverted } from '$lib/stores/convertedStore';
	import { filesStore } from '$lib/stores/fileStore.js';
	import { type Metadata } from '$lib/types/types';
	import { LoaderCircle } from 'lucide-svelte';

	let isLoading = $state(false);
	export const submitFiles = async () => {
		isLoading = true;
		const formData = new FormData();
		const metadata: Metadata[] = [];

		// Populate FormData and metadata
		$filesStore.forEach((file) => {
			formData.append('files', file.fileObject || ''); // Append actual File objects
			metadata.push({
				id: file.id,
				name: file.name,
				driveFileId: file.driveFileId || null,
				access_token: file.accessToken || null,
				outputFormat: file.outputFormat
			});
		});

		// Add metadata as JSON string
		formData.append('metadata', JSON.stringify(metadata));

		try {
			const response = await fetch('/api/convert', {
				method: 'POST',
				body: formData // Let browser set Content-Type with boundary
			});

			if (!response.ok) throw new Error('Conversion failed');
			const { files } = await response.json();
			setConverted(files);
			await goto('/download');
		} catch (error) {
			console.error('Upload error:', error);
			throw error; // Re-throw for error handling in components
		} finally {
			isLoading = false;
		}
	};
</script>

<div class=" mt-10 w-full space-y-3 bg-white text-center">
	<Header />

	<!-- Custom Dropdown  -->

	{#if $filesStore.length === 0}
		<Dropzone />
	{:else}
		<div class="mx-auto flex w-[90%] flex-col items-start">
			<InputForm classNames="rounded-none" />
			<InputFiles />
			<button class="self-end" onclick={submitFiles} disabled={isLoading}>
				{#if isLoading}
					<div class="flex flex-row items-center gap-2">
						<LoaderCircle class="size-5  animate-spin" />
						<span>Converting...</span>
					</div>
				{:else}
					Convert
				{/if}
			</button>
		</div>
	{/if}
</div>

<!-- Call to Action section  -->
<Cta />
