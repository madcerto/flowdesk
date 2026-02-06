<script lang="ts">
import BinIcon from "$lib/images/trash-fill.svelte";
let { item, deleteContentItem, dragging=$bindable() } = $props();

async function deleteItem(_e: Event) {
    let deleteData = await fetch(`${import.meta.env.VITE_SD_API_URL}/archive/spike/${item._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", "If-Match": item._etag },
        body: `{ "state": "spiked" }`
    })
    .then((res) => res.json())
    .catch((err) => ({ _status: "ERR", _message: `delete request failed: ${err}` }));
    if (deleteData._status == "ERR") { // TODO: handle potential errors here
        console.log(deleteData);
    } else {
        deleteContentItem(item._id);
    }
}
</script>

<style>
.content-item {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 1rem;
    border: 1px solid var(--neutral-primary-3);
    border-left: 2px solid var(--accent-blue);
    background: white;
    div:nth-child(1) {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
        * {
            margin: 0.25rem 0;
        }
    }
}
.categories {
    display: flex;
    flex-direction: row;
}
.category {
    font-size: 0.875rem;
    font-weight: bold;
    background: var(--accent-purple);
    padding: 0.25rem 0.75rem;
    margin: 0 0 0.75rem 0.75rem;
    border-radius: 0.25rem;
}
.headline {
    padding: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: bold;
}
.authors-list {
    padding: 0 0.75rem;
    flex: 1 0 0;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 1rem;
}
.byline {
    font-style: italic;
    font-weight: bold;
}
.author {
    background: var(--neutral-primary-2);
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: var(--neutral-secondary-2);
    font-weight: bold;
}
.edit-btn {
    background: var(--primary-800);
    border-radius: 0.25rem;
    line-height: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0.5rem !important;
    color: white;
    text-decoration: none;
    font-weight: bold;
}
.delete-btn {
    padding: 0.5rem;
    margin: 0.25rem 1rem !important;
    background: var(--accent-red);
    border-radius: 0.25rem;
    cursor: pointer;
    justify-content: center;
    :global(svg) {
        fill: white;
        height: 100%;
    }
}
</style>

<div class="content-item" draggable="true" role="listitem"
    ondragend={() => dragging = undefined}
    ondragstart={(ev: DragEvent) => { dragging = item._id; ev.dataTransfer?.setData("text", item._id); }}>
    <div>
        <p class="headline" title="Headline">{item.headline}</p>
        {#if item.authors || item.byline}<p>by</p>{/if}
        <span class="authors-list">
            {#if item.byline}<p class="byline" title="Byline">{item.byline}</p>{/if}
        {#each item.authors as author, idx}
            {#if idx > 0 || item.byline}<p>, </p>{/if}
            <p class="author">{author.sub_label}</p>
        {/each}
        </span>
        <a class="edit-btn" href={`/edit/${item._id}`}>Edit</a>
        <button class="delete-btn" onclick={deleteItem}><BinIcon /></button>
        <!-- TODO: vertically center the bin icon inside the button -->
    </div>
    <div class="categories">
    {#each item.anpa_category as category}
        <p class="category">{category.name.toUpperCase()}</p>
    {/each}
    </div>
</div>
