<script lang="ts">
    import { goto } from "$app/navigation";
    let articleId: string = $state("");
</script>

<label for="articleId">Enter article ID: </label>
<input id="articleId" bind:value={articleId} />
<button onclick={() => goto(`/edit/${articleId}`)}>Edit</button>
