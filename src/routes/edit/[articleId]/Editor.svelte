<script lang="ts">
import { onMount } from "svelte";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { DOMParser } from "prosemirror-model";

let { content: body_html, editorState = $bindable(), editorView = $bindable() } = $props();

let dom: HTMLElement;

onMount(() => {
    const content = document.createElement("div");
    content.innerHTML = body_html;
    const doc = DOMParser.fromSchema(schema).parse(content);

    editorState = EditorState.create({
        plugins: [
            keymap(baseKeymap)
        ],
        doc
    });

    editorView = new EditorView({mount: dom}, {
        state: editorState,
        dispatchTransaction: (transaction) => {
            editorState = editorView.state.apply(transaction)
            // TODO: update toolbar to disable impossible commands

            editorView.updateState(editorState)
        },
    });
});

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
.ProseMirror {
    outline: none
}
:global(:root:focus-within .ProseMirror ::selection) {
    background-color: var(--secondary-2);
}
</style>

<main>
    <article class="-sm:p-12">
        <div class="ui-editor ProseMirror"
             bind:this={dom}
        ></div>
    </article>
</main>
