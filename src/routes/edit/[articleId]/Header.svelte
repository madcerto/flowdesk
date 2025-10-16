<script lang="ts">
import { enhance } from "$app/forms";
import Toolbar from "./Toolbar.svelte";
import MetaFields from "./MetaFields.svelte";
import LoaderIcon from "$lib/images/loader-2-line.svelte";

const { editorState, dispatch, focusEditor, headline, etag, desk, stage, metaFields } = $props();

let saving = $state(false);
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
        button:hover, input[type=submit]:hover:not([disabled]) {
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
    #submit-button {
        position: relative;
        :global(svg) {
            position: absolute;
            left: 0;
            right: 0;
            margin-inline: auto;
            height: 100%;
            width: 100%;
            fill: var(--primary-800);
            animation: spin 2000ms infinite linear;
        }
    }
    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
</style>

<header>
    <form method="post" use:enhance={({ formData }) => {
            formData.append("body_html", document.querySelector(".ProseMirror")?.innerHTML.replace(/"/g, '\\"') || "");
            formData.append("_etag", etag);
            saving = true;
            return async ({ update }) => {
                // TODO: if redirecting, save formData in local storage or somewhere
                update({ reset: false });
                saving = false;
            };
        }}>
        <div id="primary-header">
            <!-- TODO: when highlighted, displays "headline" to indicate you're editing the headline field -->
            <p id="desk-stage">{desk.name.toUpperCase()} / {stage.name.toUpperCase()}</p>
            <input id="headline" name="headline" value={headline} autocomplete="off" />
            <button>CLOSE</button>
            <span id="submit-button">
                <input type="submit" value="SAVE" style:color={saving ? "var(--neutral-primary-1)" : undefined} disabled={saving} />
                {#if saving}<LoaderIcon />{/if}
            </span>
            <button>SEND</button>
        </div>
        <Toolbar {editorState} {dispatch} {focusEditor} />
        <MetaFields {metaFields}/>
    </form>
</header>
