<script>
	import { CTA } from '$lib/config/config';
</script>

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
