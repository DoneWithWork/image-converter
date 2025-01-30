<script lang="ts">
	import InputForm from '$lib/components/inputForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { handleFileInput } from '$lib/stores/fileStore.js';
</script>

<Button
	class="mx-auto flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 bg-gray-50 hover:bg-gray-100"
	ondragover={(e: DragEvent) => e.preventDefault()}
	ondrop={(e: DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer?.files) {
			handleFileInput(e.dataTransfer.files);
		}
	}}
>
	<div class="flex flex-col items-center justify-center space-y-2">
		<InputForm classNames="rounded-md" />
		<p class="text-wrap text-sm text-gray-800">Unlimited File Size (Please don't test this ahah)</p>
	</div>
</Button>
