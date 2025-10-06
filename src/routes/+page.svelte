<script lang="ts">
import "$lib/styles/app.css";
import ContentItem from "./ContentItem.svelte";

const { data } = $props();

const getDeskItems = (deskId: string) => data.archive._items.filter((item: any) => item.task.desk == deskId);
</script>

<style>
.desk-name {
    margin: 0 1rem;
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    border-bottom: 1px solid var(--neutral-primary-3);
}
</style>

<div style:width="75%">
    {#each data.desks._items as desk}
    <h2 class="desk-name">{desk.name}</h2>
    {#each getDeskItems(desk._id) as item}
        <ContentItem {item} />
    {/each}
    {/each}
</div>
