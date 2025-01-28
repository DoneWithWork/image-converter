<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { options } from '$lib/config/config';
	import { handleFileInput } from '$lib/stores/fileStore';
	import type { optionsType } from '$lib/types/File';
	import { ChevronDownIcon, FileUp, Folder } from 'lucide-svelte';
</script>

<div
	class="group relative inline-block cursor-pointer rounded-md bg-blue-400 transition-all duration-500 hover:bg-blue-500"
>
	<Input
		id="file-input"
		onchange={handleFileInput}
		required
		type="file"
		multiple
		class="absolute hidden"
	/>
	<div class="flex h-14 w-full flex-row items-center">
		<label
			class="flex h-full flex-row items-center gap-2 border-r-[1px] border-white px-3 pr-4"
			for="file-input"
		>
			<span><FileUp size={30} class="size-7 font-semibold text-white" /></span>

			<span class="text-xl font-semibold text-white">Choose Files</span>
		</label>
		<div class="grid size-14 place-items-center">
			<ChevronDownIcon
				size={20}
				class="size-6 text-white transition-transform duration-200 group-hover:rotate-180"
			/>
		</div>
	</div>

	<div
		class="absolute left-0 mt-[0.5px] hidden w-full rounded-md bg-blue-400 shadow-md group-hover:visible group-hover:block"
	>
		<ul class="relative flex flex-col">
			<label
				for="file-input"
				class="flex w-full cursor-pointer flex-row items-center gap-2 border-b-[1px] border-b-gray-300 py-5 pl-3"
			>
				<Folder class="size-6 text-white" size={24} />
				<p class="px-4 text-lg font-semibold text-white">From Device</p>
			</label>
			<Input
				id="file-input"
				onchange={handleFileInput}
				required
				type="file"
				multiple
				class="hidden"
			/>

			{#each options as option (option.name)}
				{@render dropdown(option)}
				{@render modal(option.name)}
			{/each}
		</ul>
	</div>
</div>

{#snippet dropdown(option: optionsType)}
	<label
		for={option.name}
		class="flex w-full flex-row items-center gap-2 border-b-[1px] border-b-gray-300 py-5 pl-3"
	>
		<option.icon class="size-6 text-white" size={24} />
		<p class="cursor-pointer px-4 text-lg font-semibold text-white">
			{option.name}
		</p>
	</label>
{/snippet}

{#snippet modal(id: string)}
	<input type="checkbox" {id} class="daisy-modal-toggle" />
	<div class="daisy-modal" role="dialog">
		<div class="daisy-modal-box">
			<h3 class="text-lg font-bold text-black">Hello!</h3>
			<p class="py-4">This modal works with a hidden checkbox!</p>
			<div class="daisy-modal-action">
				<label for={id} class="daisy-btn">Close!</label>
			</div>
		</div>
	</div>
{/snippet}
