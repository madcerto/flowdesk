<script lang="ts">
import UndoArrowIcon from "$lib/images/arrow-counterclockwise.svg";
import RedoArrowIcon from "$lib/images/arrow-clockwise.svg";
import LinkIcon from "$lib/images/link.svg";
import CommentIcon from "$lib/images/chat-square-text.svg";
import SuggestionIcon from "$lib/images/pencil-square.svg";
import ImageIcon from "$lib/images/card-image.svg";
import UnorderedListIcon from "$lib/images/list-ul.svg";
import OrderedListIcon from "$lib/images/list-ol.svg";
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
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 1.25rem;
        background: transparent;
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
</style>

<div id="toolbar">
<!-- TODO: consider making all these divs with background-image so they can't be selected -->
    <img src={UndoArrowIcon} alt="Undo"/>
    <img src={RedoArrowIcon} alt="Redo"/>
    <button id="hundred">100%</button>
    <div class="divider"></div>
    <button><b>B</b></button>
    <button><i>I</i></button>
    <button><u>U</u></button>
    <div class="divider"></div>
    <img src={LinkIcon} alt="Insert link"/>
    <img src={CommentIcon} alt="Insert comment"/>
    <img src={SuggestionIcon} alt="Enter suggestion mode"/>
    <img src={ImageIcon} alt="Insert image" role="button"/>
    <div class="divider"></div>
    <img src={UnorderedListIcon} alt="Insert unordered list"/>
    <img src={OrderedListIcon} alt="Insert ordered list"/>
    <button><s>T</s></button>
</div>
