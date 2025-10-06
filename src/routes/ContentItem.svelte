<script lang="ts">
const { item } = $props();
</script>

<style>
.content-item {
    display: flex;
    margin: 1rem;
    gap: 0.25rem;
    align-items: center;
    border-left: 2px solid var(--accent-blue);
}
.headline {
    padding: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: bold;
}
.authors-list {
    /* background: var(--neutral-primary-2); */
    /* border-radius: 0.25rem; */
    padding: 0 0.75rem;
    margin: 0;
    flex: 1 0 0;
    display: flex;
    flex-direction: columns;
    gap: 0.5rem;
    align-items: center;
    font-size: 1rem;
    p:not(.author) {
        line-height: 1rem;
    }
}
.byline {
    font-style: italic;
    font-weight: bold;
}
.author {
    background: var(--neutral-primary-2);
    width: fit-content;
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
    color: white;
    text-decoration: none;
    font-weight: bold;
}
</style>

<div class="content-item">
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
</div>
