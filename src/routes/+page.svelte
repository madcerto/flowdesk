<script lang="ts">
import "$lib/styles/app.css";
import ContentItem from "./ContentItem.svelte";

const { data } = $props();
</script>

<div style:width="50%">
{#each data.archive._items as item}
<ContentItem {item}/>
{/each}
</div>
