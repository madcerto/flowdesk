<script lang="ts">
import "$lib/styles/app.css";
import ContentItem from "./ContentItem.svelte";

const { data } = $props();

const getDeskStages = (deskId: string) => data.stages._items.filter((stage: any) => stage.desk == deskId);
const getStageItems = (stageId: string) => data.archive._items.filter((item: any) => item.task.stage == stageId);
</script>

<style>
main {
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    margin: auto;
}
.desk-name {
    margin: 0 1rem;
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    border-bottom: 1px solid var(--neutral-primary-3);
}
.stage-name {
    margin: 1rem;
    margin-bottom: 0;
    padding: 0.25rem 0.75rem;
    width: fit-content;
    background: var(--secondary-3);
    border-radius: 0.25rem;
}
.empty {
    margin: 1rem 2rem;
    font-style: italic;
}
</style>

<main>
    {#each data.desks._items as desk}
        <h3 class="desk-name">{desk.name.toUpperCase()}</h3>
        {#each getDeskStages(desk._id) as stage}
            <h5 class="stage-name">{stage.name.toUpperCase()}</h5>
            {#each getStageItems(stage._id) as item}
                <ContentItem {item} />
            {:else}
                <p class="empty">No items...</p>
            {/each}
        {/each}
    {/each}
</main>
