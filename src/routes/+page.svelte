<script lang="ts">
	import Dropzone from './Dropzone.svelte';
	import Header from './Header.svelte';
	import { XCircle } from 'lucide-svelte';
	import byteSize from 'byte-size';
	import { filesStore, removeFile } from '$lib/stores/fileStore.js';
	import Cta from '$lib/components/CTA.svelte';
</script>

<div class=" mt-10 w-full space-y-3 text-center">
	<Header />

	<!-- Custom Dropdown  -->
	<Dropzone />
</div>
<!-- Display the Files  -->
<div class="space-y-2">
	{#each $filesStore as file (file.id)}
		<div class="flex flex-row items-center justify-between">
			<p>{file.name}</p>
			<p>{byteSize(file.size)}</p>
			<XCircle
				onclick={() => removeFile(file.id)}
				size={20}
				class="size-6 cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-700"
			/>
		</div>
	{/each}
</div>
<!-- Call To Action  -->
<Cta />
