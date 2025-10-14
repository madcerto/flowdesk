<script lang="ts">
import "$lib/styles/app.css";
import ContentItem from "./ContentItem.svelte";
import PlusIcon from "$lib/images/plus-lg.svelte";

const { data } = $props();

let archive = $state(data.archive);

const getDeskStages = (deskId: string) => data.stages._items.filter((stage: any) => stage.desk == deskId);
const stageItems: Map<string, any[]> = $derived.by(() => {
    return new Map(data.stages._items.map((stage: any) => [stage._id, archive._items.filter((item: any) => item.task.stage == stage._id && item.state != "spiked")]));
});

$inspect(stageItems);

const createContentItem = (desk: any, stageId: string) => async () => {
    let body = `{
        "version":1,
        "profile":"${desk.default_content_profile}",
        "template":"${desk.default_content_template}",
        "task":{
            "desk":"${desk._id}",
            "stage":"${stageId}",
            "user":"${JSON.parse(localStorage.getItem("sess:user") || "")._id}"
        }
    }`;

    let new_item = await fetch(`${import.meta.env.VITE_SD_API_URL}/archive`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body
    })
    .then((res) => res.json());
    // TODO: handle potential errors here
    archive._items.unshift(new_item);
}

function deleteContentItem(itemId: string) {
    archive._items = archive._items.filter((item: any) => item._id != itemId);
}
</script>

<style>
main {
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    margin: auto;
}
h3 {
    margin: 0 1rem;
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    border-bottom: 1px solid var(--neutral-primary-3);
}
.stage-header {
    margin: 1rem;
    margin-bottom: 0;
    display: flex;
    flex-direction: row;
    button {
        padding: 0.25rem 0.5rem;
        margin: 0 1rem;
        background: var(--accent-green);
        border-radius: 0.25rem;
        cursor: pointer;
        :global(svg) {
            height: 100%;
            fill: white;
        }
    }
}
h5 {
    margin: 0;
    padding: 0.25rem 0.75rem;
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
        <h3>{desk.name.toUpperCase()}</h3>
        {#each getDeskStages(desk._id) as stage}
            <div class="stage-header">
                <h5>{stage.name.toUpperCase()}</h5>
                <button onclick={createContentItem(desk, stage._id)}><PlusIcon /></button>
            </div>
            {#each stageItems.get(stage._id) || [] as item}
                <ContentItem {item} {deleteContentItem} />
            {:else}
                <p class="empty">No items...</p>
            {/each}
        {/each}
    {/each}
</main>
