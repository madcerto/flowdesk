<script lang="ts">
    import { page } from "$app/state";
    import "$lib/styles/app.css";
    import Header from "./Header.svelte";

    const { data } = $props();
</script>

<style>
    main {
        margin-top: 8.75rem;
    }
    article {
        margin: auto;
        padding: 5rem;
        max-width: 816px;
        box-sizing: border-box;
        background-color: white;
        border: solid 1px var(--neutral-primary-3);
    }
</style>

<Header />
<main>
    <article class="-sm:p-12">
{@html data.body_html}
    </article>
</main>

<footer>
    <p>Editing article: {page.params.articleId}</p>
</footer>
