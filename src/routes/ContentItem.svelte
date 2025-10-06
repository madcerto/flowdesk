<script lang="ts">
const { item } = $props();
</script>

<style>
.content-item {
    display: flex;
    padding: 1rem;
    gap: 0.25rem;
    align-items: center;
    line-height: 0.25rem;
}
.desk-stage {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1rem;
    background: var(--secondary-3);
    padding: 0.25rem 0.75rem;
    margin: 0;
    border-radius: 0.25rem;
    vertical-align: center;
}
.headline {
    padding: 0 0.75rem;
}
.authors-list {
    /* background: var(--neutral-primary-2); */
    /* border-radius: 0.25rem; */
    padding: 0 0.75rem;
    margin: 0;
    line-height: 0.25rem;
    flex: 1 0 0;
}
.author {
    color: var(--neutral-secondary-2);
    vertical-align: center;
}
.edit-btn {
    background: var(--primary-800);
    border-radius: 0.25rem;
    line-height: 1rem;
    padding: 0.5rem;
    color: white;
    text-decoration: none;
}
</style>

<div class="content-item">
    <!-- <p id="desk-stage">{desk.name.toUpperCase()} / {stage.name.toUpperCase()}</p> -->
    <p class="desk-stage">{item.task.desk} / {item.task.stage}</p>
    <p class="headline"><b>{item.headline}</b></p>
    {#if item.authors}<p>by</p>{/if}
    <span class="authors-list">
    {#each item.authors as author}
        <p class="author"><b>{author.sub_label}</b></p>
    {/each}
    </span>
    <a class="edit-btn" href={`/edit/${item._id}`}>Edit</a>
</div>
