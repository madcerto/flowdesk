<script lang="ts">
import UndoArrowIcon from "$lib/images/arrow-counterclockwise.svg";
import RedoArrowIcon from "$lib/images/arrow-clockwise.svg";
import LinkIcon from "$lib/images/link.svg";
import CommentIcon from "$lib/images/chat-square-text.svg";
import SuggestionIcon from "$lib/images/pencil-square.svg";
import ImageIcon from "$lib/images/card-image.svg";
import UnorderedListIcon from "$lib/images/list-ul.svg";
import OrderedListIcon from "$lib/images/list-ol.svg";

let deskName = "Opinion";
let stageName = "Authoring";

let title = $state("Arson and antisemitic graffiti heighten fears of hate crime on Drexel campus");
</script>
<style>
    header {
        position: sticky;
        top: 0;
    }
    #primary-header {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin: 1rem;
        * {
            background: inherit;
            font-family: serif;
        }
        button {
            font-size: 1rem;
            color: var(--primary-800);
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
    }
    #headline:hover {
        border-bottom: 2px solid var(--neutral-primary-2);
    }
    #headline:focus-visible {
        border-bottom: 2px solid var(--primary-800);
    }
</style>

<header>
    <div id="primary-header">
        <p id="desk-stage">{deskName.toUpperCase()} / {stageName.toUpperCase()}</p>
        <input id="headline" bind:value={title} />
        <button>CLOSE</button>
        <button>SAVE</button>
        <button>SEND</button>
    </div>
    <div id="toolbar">
        <img src={UndoArrowIcon} alt="Undo"/>
        <img src={RedoArrowIcon} alt="Redo"/>
        <button>100%</button>
        <button>B</button>
        <button>I</button>
        <button>U</button>
        <img src={LinkIcon} alt="Insert link"/>
        <img src={CommentIcon} alt="Insert comment"/>
        <img src={SuggestionIcon} alt="Enter suggestion mode"/>
        <img src={ImageIcon} alt="Insert image" role="button"/>
        <img src={UnorderedListIcon} alt="Insert unordered list"/>
        <img src={OrderedListIcon} alt="Insert ordered list"/>
        <button>T</button>
    </div>
</header>
