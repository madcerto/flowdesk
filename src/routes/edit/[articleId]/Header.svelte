<script lang="ts">
import Toolbar from "./Toolbar.svelte";
import MetaFields from "./MetaFields.svelte";

const { editorState, dispatch, focusEditor, headline } = $props();

let deskName = "Opinion";
let stageName = "Authoring";

let title = $state(headline);
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
        button {
            font-size: 1rem;
            color: var(--primary-800);
        }
        button:hover {
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
    <div id="primary-header">
        <!-- TODO: when highlighted, displays "headline" to indicate you're editing the headline field -->
        <p id="desk-stage">{deskName.toUpperCase()} / {stageName.toUpperCase()}</p>
        <input id="headline" bind:value={title} autocomplete="off" />
        <button>CLOSE</button>
        <button>SAVE</button>
        <button>SEND</button>
    </div>
    <Toolbar {editorState} {dispatch} {focusEditor} />
    <MetaFields />
</header>
