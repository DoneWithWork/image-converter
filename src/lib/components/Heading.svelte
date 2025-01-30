<script lang="ts">
	const { children } = $props();
</script>

<h1 class="text-center text-xl font-bold sm:text-2xl md:text-4xl xl:text-5xl">
	{@render children()}
</h1>
