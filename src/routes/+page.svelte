<script lang="ts">
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { uploadSchema } from '$lib/schema/schema';
	import InputForm from '$lib/components/inputForm.svelte';
	import { Award, Image, Shield } from 'lucide-svelte';
	let { data } = $props();

	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(uploadSchema),
		taintedMessage: () => {
			return new Promise((resolve) => {
				alert('You have uploaded a file.');
			});
		}
	});

	const files = filesProxy(form, 'files');

	const CTA = [
		{
			icon: Image,
			label: 'Convert Any Image',
			description: 'Convert any image to any format'
		},
		{
			icon: Shield,
			label: 'Free and Secure',
			description:
				"Our image converter is free and secure, we don't store any of your data permanently. We also don't use any third-party services to process your images."
		},
		{
			icon: Award,
			label: 'Fast and Reliable',
			description: 'Our image converter is fast and reliable, we process your images in seconds.'
		}
	];
</script>

<div class=" mt-10 w-full space-y-3 text-center">
	<div class="mb-8 space-y-3">
		<h1 class=" text-3xl font-bold md:text-4xl xl:text-5xl">Image Converter</h1>
		<p class="text-lg font-semibold">
			Convert and Compress Images for <strong class="text-xl text-blue-400 underline">Free</strong>
		</p>
	</div>
	<button
		class="mx-auto flex h-64 w-3/4 flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 bg-gray-50 hover:bg-gray-100"
		ondragover={(e) => e.preventDefault()}
		ondrop={(e) => {
			e.preventDefault();
			if (e.dataTransfer?.files) {
				files.set(e.dataTransfer.files);
			}
		}}
	>
		<div class="flex flex-col items-center justify-center space-y-2">
			<InputForm />
			<p class="text-sm text-gray-800">Unlimited File Size (Please don't test this ahah)</p>
		</div>
	</button>
	<!-- <form method="POST" enctype="multipart/form-data" use:enhance>
		<Input type="file" multiple name="files" required bind:files={$files} />
		{#if $errors.files}<span>{$errors.files}</span>{/if}
		<button>Submit</button>
	</form> -->
</div>
<div class="mx-auto mt-10 max-w-4xl rounded-lg border-2 border-gray-100 p-5 shadow-md">
	<div class="space-y-3 px-4 py-3">
		<h2 class="mb-5 text-2xl font-bold">How to convert images</h2>
		<ol class="list-decimal space-y-2 pl-10">
			<li>Click on the <strong>"Choose Files"</strong> button</li>
			<li>Select the images you want to convert</li>
			<li>Click on the <strong>"Convert"</strong> button</li>
		</ol>
	</div>
	<div class="mt-10 grid grid-cols-1 gap-5 space-y-3 sm:grid-cols-3">
		{#each CTA as item}
			<div class="flex flex-col items-center">
				<item.icon class="mb-5 size-10 font-normal" size={24} />
				<div class="flex flex-col">
					<h3 class="mb-4 text-center text-lg font-semibold">{item.label}</h3>
					<p class="text-justify text-sm text-gray-600">{item.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
