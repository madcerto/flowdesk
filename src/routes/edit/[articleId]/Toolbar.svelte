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

const { editorState, dispatch, focusEditor } = $props();
function runCommand(command: any) {
    return (e: Event) => {
        e.preventDefault();
        focusEditor();
        command(editorState, dispatch);
    }
}

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
        <option value="p" title="Ctrl-Alt-0">Normal text</option>
        <option value="h1" title="Ctrl-Alt-1">Heading 1</option>
        <option value="h2" title="Ctrl-Alt-2">Heading 2</option>
        <option value="h3" title="Ctrl-Alt-3">Heading 3</option>
        <option value="h4" title="Ctrl-Alt-4">Heading 4</option>
        <option value="h5" title="Ctrl-Alt-5">Heading 5</option>
        <option value="h6" title="Ctrl-Alt-6">Heading 6</option>
    </select>
    <div class="divider"></div>
    <button title="Bold (Ctrl-B)" onclick={runCommand(toggleMark(schema.marks.bold))}><b>B</b></button>
    <button title="Italic (Ctrl-I)" onclick={runCommand(toggleMark(schema.marks.italic))}><i>I</i></button>
    <button title="Underline (Ctrl-U)" onclick={runCommand(toggleMark(schema.marks.underline))}><u>U</u></button>
    <button title="Strikethrough (Alt-Shift-5)" onclick={runCommand(toggleMark(schema.marks.strikethrough))}><s>T</s></button>
    <button title="Superscript (Ctrl-.)" onclick={runCommand(toggleMark(schema.marks.superscript))} style="font-size: 1rem">X<sup>2</sup></button>
    <button title="Subscript (Ctrl-,)" onclick={runCommand(toggleMark(schema.marks.subscript))} style="font-size: 1rem">X<sub>2</sub></button>
    <div class="divider"></div>
    <img src={LinkIcon} alt="Insert link"/>
    <img src={CommentIcon} alt="Insert comment"/>
    <img src={SuggestionIcon} alt="Enter suggestion mode"/>
    <img src={ImageIcon} alt="Insert media"/>
    <div class="divider"></div>
    <button title="Insert unordered list" onclick={runCommand(wrapInList(schema.nodes.unordered_list))}><img src={UnorderedListIcon} alt="Bulleted list"/></button>
    <button title="Insert unordered list" onclick={runCommand(wrapInList(schema.nodes.ordered_list))}><img src={OrderedListIcon} alt="Insert ordered list"/></button>
</div>
