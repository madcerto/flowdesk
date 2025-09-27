<script lang="ts">
import { enhance } from "$app/forms";
import Toolbar from "./Toolbar.svelte";
import MetaFields from "./MetaFields.svelte";

const { editorState, dispatch, focusEditor, headline, etag } = $props();

let deskName = "Opinion";
let stageName = "Authoring";

let bodyHtmlInput: HTMLInputElement;
let etagInput: HTMLInputElement;

async function saveContent() {
    // Set body_html hidden input to the article content
    bodyHtmlInput.value = document.querySelector(".ProseMirror")?.innerHTML.replace(/"/g, '\\"') || "";
    etagInput.value = etag;
}
</script>

<style>
    header {
        position: fixed;
        top: 0;
        width: 100%;
        padding: 1rem;
        background: var(--neutral-primary-1);
        border-bottom: 1px solid var(--primary-200);
    }
    #primary-header {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 1rem;
        * {
            background: inherit;
            font-family: serif;
        }
        button, input[type=submit] {
            font-size: 1rem;
            color: var(--primary-800);
        }
        button:hover, input[type=submit]:hover {
            color: var(--secondary-4);
            cursor: pointer;
        }
    }
    #desk-stage {
        font-size: 0.875rem;
        font-weight: 700;
        background: var(--secondary-3);
        padding: 0.25rem 0.75rem;
        margin: 0;
        border-radius: 0.25rem;
    }
    #headline {
        font-size: 1.5rem;
        line-height: 2rem;
        flex: 1 1 0%;
        border-bottom: 2px solid transparent;
    }
    #headline:hover {
        border-bottom: 2px solid var(--neutral-primary-2);
    }
    #headline:focus-visible {
        border-bottom: 2px solid var(--primary-800);
        outline: none;
    }
</style>

<header>
    <form method="post" use:enhance={() => async ({ update }) => update({ reset: false })}>
        <div id="primary-header">
            <!-- TODO: when highlighted, displays "headline" to indicate you're editing the headline field -->
            <p id="desk-stage">{deskName.toUpperCase()} / {stageName.toUpperCase()}</p>
            <input id="headline" name="headline" value={headline} autocomplete="off" />
            <button>CLOSE</button>
            <input type="submit" value="SAVE" onclick={saveContent} />
            <button>SEND</button>
            <input hidden name="body_html" bind:this={bodyHtmlInput} />
            <input hidden name="_etag" bind:this={etagInput} />
        </div>
        <Toolbar {editorState} {dispatch} {focusEditor} />
        <MetaFields />
    </form>
</header>
