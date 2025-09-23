<script lang="ts">
import UndoArrowIcon from "$lib/images/arrow-counterclockwise.svg";
import RedoArrowIcon from "$lib/images/arrow-clockwise.svg";
import LinkIcon from "$lib/images/link.svg";
import CommentIcon from "$lib/images/chat-square-text.svg";
import SuggestionIcon from "$lib/images/pencil-square.svg";
import ImageIcon from "$lib/images/card-image.svg";

import { setBlockType } from "prosemirror-commands";
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
        let weird = true; // Some blocks (like lists) are weird right now and all text styles will not apply to them
        getToolbarItems().textStyles.forEach(item => {
            if (!setBlockType(item.blockType, item.args)(editorState)) textStyle = item.val;
            else weird = false;
        });
        if (weird) textStyle = "p"; // Set to default if weird
    }
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
    > *:hover:not([disabled]) {
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
button :global(> svg) {
    width: 20px;
    height: 20px;
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
    {#each getToolbarItems().listTypes as item}
        <button title={item.tooltip} onclick={runCommand(wrapInList(item.nodeType))} disabled={editorState && !wrapInList(item.nodeType)(editorState)}><item.icon /></button>
    {/each}
</div>
