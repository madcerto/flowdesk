<script lang="ts">
import UndoArrowIcon from "$lib/images/arrow-counterclockwise.svg";
import RedoArrowIcon from "$lib/images/arrow-clockwise.svg";
import LinkIcon from "$lib/images/link.svg";
import CommentIcon from "$lib/images/chat-square-text.svg";
import SuggestionIcon from "$lib/images/pencil-square.svg";
import ImageIcon from "$lib/images/card-image.svg";
import UnorderedListIcon from "$lib/images/list-ul.svg";
import OrderedListIcon from "$lib/images/list-ol.svg";

import { toggleMark, setBlockType } from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import { undo, redo } from "prosemirror-history";
import { schema } from "./schema";
import { getToolbarItems } from "./toolbar-items";

const { editorState, dispatch, focusEditor } = $props();
function runCommand(command: any) {
    return (e: Event) => {
        e.preventDefault();
        focusEditor();
        command(editorState, dispatch);
    }
}

$effect(() => {
    // Runs every time editorState changes
    // Make sure it's not undefined
    if (editorState) {
        getToolbarItems().textStyles.forEach(item => {
            if (!setBlockType(item.blockType, item.args)(editorState)) textStyle = item.val;
        });
    }
    console.log(editorState);
})

let textStyle: string = $state("p");

function setTextStyle(e: Event) {
    if (textStyle == "p") runCommand(setBlockType(schema.nodes.paragraph))(e);
    else runCommand(setBlockType(schema.nodes.heading, { level: Number(textStyle[1]) }))(e);
};
</script>

<style>
#toolbar {
    display: flex;
    padding: 0 1rem;
    height: 2.5rem;
    background: var(--neutral-primary-2);
    border-radius: 9999px;
    align-items: center;
    > * {
        height: 1.75rem;
        padding: 0.25rem 0.5rem;
        margin: 0 0.25rem;
        border-radius: 0.25rem;
        font-family: "Liberation Mono", "Courier New", monospace;
        font-size: 1.25rem;
        background: transparent;
        img {
            height: 100%;
        }
    }
    > *:hover {
        background: var(--primary-200);
    }
}
.divider {
    height: 1.5rem !important;
    border-right: solid 1px var(--neutral-primary-4);
    border-radius: 0 !important;
    padding: 0 !important;
}
#hundred {
    font-size: 1.125rem;
}
#text-style {
    font-size: 1.125rem;
    font-family: "Times New Roman";
}
</style>

<div id="toolbar">
<!-- TODO: consider making all these divs with background-image so they can't be selected -->
    <button title="Undo (Ctrl-Z)" onclick={runCommand(undo)}><img src={UndoArrowIcon} alt="Undo"/></button>
    <button title="Redo (Ctrl-Shift-Z)" onclick={runCommand(redo)}><img src={RedoArrowIcon} alt="Redo"/></button>
    <button id="hundred">100%</button>
    <div class="divider"></div>
    <select id="text-style" name="text-style" bind:value={textStyle} onchange={setTextStyle}>
        {#each getToolbarItems().textStyles as item}
            <option value={item.val} title="Ctrl-Alt-{item.shortcut}">{item.name}</option>
        {/each}
    </select>
    <div class="divider"></div>
    {#each getToolbarItems().textFormatting as item}
        <button title={item.tooltip} onclick={runCommand(item.command)} disabled={editorState && !item.command(editorState)}>{@html item.innerHtml}</button>
    {/each}
    <div class="divider"></div>
    <img src={LinkIcon} alt="Insert link"/>
    <img src={CommentIcon} alt="Insert comment"/>
    <img src={SuggestionIcon} alt="Enter suggestion mode"/>
    <img src={ImageIcon} alt="Insert media"/>
    <div class="divider"></div>
    <button title="Insert unordered list (Ctrl-Shift-8)" onclick={runCommand(wrapInList(schema.nodes.unordered_list))}><img src={UnorderedListIcon} alt="Bulleted list"/></button>
    <button title="Insert ordered list (Ctrl-Shift-7)" onclick={runCommand(wrapInList(schema.nodes.ordered_list))}><img src={OrderedListIcon} alt="Insert ordered list"/></button>
</div>
