<script>
	import { GithubIcon } from 'lucide-svelte';
</script>

<a
	class="flex flex-row items-center gap-3 hover:cursor-pointer"
	href="https://github.com/DoneWithWork/image-converter"
	aria-label="Github"
	target="_blank"
	rel="noopener noreferrer"
>
	<div class=" hidden size-8 place-items-center rounded-full bg-gray-700 md:grid">
		<GithubIcon size={35} class="size-5 fill-white text-white" />
	</div>
	<p class="text-sm font-semibold md:text-lg">Github</p>
</a>
