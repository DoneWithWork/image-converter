<script lang="ts">
	import { goto } from '$app/navigation';
	import { returnOutputFormats } from '$lib/config/config';
	import { setConverted } from '$lib/stores/convertedStore';
	import { filesStore, removeFile, updateOutputFormat } from '$lib/stores/fileStore.js';
	import { type Metadata, type OutputFileFormat } from '$lib/types/types';
	import byteSize from 'byte-size';
	import { Settings, XCircle } from 'lucide-svelte';
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

<div class="w-full border-2 border-blue-500 px-5 py-4">
	{#each $filesStore as file (file.id)}
		<div class="flex flex-row flex-wrap items-center justify-between">
			<div class="flex flex-col text-left">
				<p class="w-full truncate text-wrap sm:w-56 md:w-72 lg:w-96">{file.name}</p>

				<p class="text-base text-gray-500">{byteSize(file.size)}</p>
			</div>

			<div class="flex flex-row items-center gap-4">
				<div class="flex flex-row items-center gap-4">
					<p class="text-base font-semibold text-gray-500">Output:</p>
					<select
						onchange={(event) => {
							const target = event.target as HTMLSelectElement;
							if (target) {
								updateOutputFormat(file.id, target.value as OutputFileFormat);
							}
						}}
						class="daisy-select daisy-select-primary daisy-select-sm mr-5 w-full max-w-xs"
					>
						{#each returnOutputFormats(file.format) as format}
							<option value={format}>{format}</option>
						{/each}
					</select>
				</div>
				<label for={`settings-${file.id}`} class="">
					<Settings size={20} class="size-7 cursor-pointer text-gray-600" /></label
				>

				<XCircle
					onclick={() => removeFile(file.id)}
					size={20}
					class="size-7 cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-700"
				/>
				<input type="checkbox" id={`settings-${file.id}`} class="daisy-modal-toggle" />
				<div class="daisy-modal" role="dialog">
					<div class="daisy-modal-box">
						<h3 class="text-lg font-bold">Hello!</h3>
						<p class="py-4">This modal works with a hidden checkbox!</p>
						<div class="daisy-modal-action">
							<label for={`settings-${file.id}`} class="daisy-btn">Close!</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
