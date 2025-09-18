<script lang="ts">
import { onMount } from "svelte";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { DOMParser } from "prosemirror-model";
import { splitListItem, liftListItem, sinkListItem } from "prosemirror-schema-list";
import { InputRule, inputRules, undoInputRule, wrappingInputRule } from "prosemirror-inputrules";
import { history } from "prosemirror-history";
import { schema } from "./schema";
import { tabListItem } from "./list-commands";

let { content: body_html, editorState = $bindable(), editorView = $bindable() } = $props();

let dom: HTMLElement;

onMount(() => {
    const content = document.createElement("div");
    content.innerHTML = body_html;
    const doc = DOMParser.fromSchema(schema).parse(content);

    editorState = EditorState.create({
        plugins: [
            inputRules({ rules: [
                wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.unordered_list),
                wrappingInputRule(/^(\d+)\.\s$/, schema.nodes.ordered_list, match => ({order: +match[1]}), (match, node) => node.childCount + node.attrs.order == +match[1]),
            ] }),
            keymap({
                "Backspace": undoInputRule,
                "Enter": splitListItem(schema.nodes.list_item),
                "Tab": tabListItem,
                "Shift-Tab": liftListItem(schema.nodes.list_item)
            }),
            keymap(baseKeymap),
            history()
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
