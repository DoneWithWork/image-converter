<script lang="ts">
	import Dropzone from './Dropzone.svelte';
	import Header from './Header.svelte';
	import { Settings, XCircle } from 'lucide-svelte';
	import byteSize from 'byte-size';
	import { filesStore, removeFile } from '$lib/stores/fileStore.js';
	import Cta from '$lib/components/CTA.svelte';
	import InputForm from '$lib/components/inputForm.svelte';
	import { getPossibleConversions } from '$lib/config/config';
</script>

<div class=" mt-10 w-full space-y-3 bg-white text-center">
	<Header />

	<!-- Custom Dropdown  -->

	{#if $filesStore.length === 0}
		<Dropzone />
	{:else}
		<div class="mx-auto flex w-[90%] flex-col items-start">
			<InputForm classNames="rounded-none" />
			<div class="w-full border-2 border-blue-500 px-5 py-4">
				{#each $filesStore as file (file.id)}
					<div class="flex flex-row flex-wrap items-center justify-between">
						<div class="flex flex-col text-left">
							<p>{file.name}</p>

							<p class="text-base text-gray-500">{byteSize(file.size)}</p>
						</div>

						<div class="flex flex-row items-center gap-4">
							<div class="flex flex-row items-center gap-4">
								<p class="text-base font-semibold text-gray-500">Output:</p>
								<select
									class="daisy-select daisy-select-primary daisy-select-sm mr-5 w-full max-w-xs"
								>
									{#each getPossibleConversions(file.type) as type}
										<option value={type}>{type}</option>
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
		</div>
	{/if}
</div>
<!-- Display the Files  -->
<div class="space-y-2"></div>
<!-- Call To Action  -->
<Cta />
