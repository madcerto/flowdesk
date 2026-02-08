<script lang="ts">
import { ToastContainer, Toast } from "flowbite-svelte";
import { fly } from "svelte/transition";
import { untrack } from "svelte";
import "$lib/styles/app.css";
import "./toast.css";
import PlusIcon from "$lib/images/plus-lg.svelte";
import CloudUploadIcon from "$lib/images/cloud-upload.svelte";
import type { NotificationItem } from "./notifications";
import { createNotification } from "./notifications";
import ContentItem from "./ContentItem.svelte";
import PublishDialog from "./PublishDialog.svelte";

const { data, form } = $props();

let dragging: string | undefined = $state(undefined);
let highlightedStage = $derived(dragging ? "" : null);
let publishHovered = $state(false);
let publishing: string | undefined = $state(undefined);
let notifications: NotificationItem[] = $state([]);
let archive = $state(data.archive);

let nextNotifId = 1;
const addNotification = (message: string) => createNotification(message, notifications, nextNotifId);

const getDeskStages = (deskId: string) => data.stages._items.filter((stage: any) => stage.desk == deskId);
const stageItems: Map<string, any[]> = $derived.by(() => {
    return new Map(data.stages._items.map((stage: any) => [stage._id, archive._items.filter((item: any) => item.task.stage == stage._id && item.state != "spiked")]));
});
const getItemPublishable = (itemId: string) => {
    let deskId = archive._items.find((i: any) => i._id == itemId).task.desk;
    return data.desks._items.find((d: any) => d._id == deskId).desk_type == "production";
}

const createContentItem = (desk: any, stageId: string) => async () => {
    let body = `{
        "version":1,
        "profile":"${desk.default_content_profile}",
        "template":"${desk.default_content_template}",
        "task":{
            "desk":"${desk._id}",
            "stage":"${stageId}",
            "user":"${JSON.parse(localStorage.getItem("sess:user") || "")._id}"
        }
    }`;

    let new_item = await fetch(`${import.meta.env.VITE_SD_API_URL}/archive`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body
    })
    .then((res) => res.json());
    // TODO: handle potential errors here
    archive._items.unshift(new_item);
}

function deleteContentItem(itemId: string) {
    archive._items = archive._items.filter((item: any) => item._id !== itemId);
}

async function moveContentItem(itemId: string, deskId: string, stageId: string) {
    let itemIdx = archive._items.findIndex((item: any) => item._id == itemId);
    if (archive._items[itemIdx].task.stage == stageId) return;
    let moveResponse = await fetch(`${import.meta.env.VITE_SD_API_URL}/archive/${itemId}/move`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: `{ "task": { "desk": "${deskId}", "stage": "${stageId}" } }`
    })
    .then((res) => res.json())
    .catch((err) => ({ _status: "ERR", _message: `move request failed: ${err}` }));
    if (moveResponse._status == "ERR") { // TODO: handle potential errors here
        console.log(moveResponse);
    } else {
        archive._items[itemIdx].task.desk = deskId;
        archive._items[itemIdx].task.stage = stageId
    }
}

$effect(() => { if (form) { // Whenever form changes, if it is defined:
    if (form._status == "ERR")
        untrack(() => addNotification(`PUBLISH ERROR: ${form._issues["validator exception"]}`));
    else if (form._status == "OK") untrack(() => {
        addNotification(`Successfully published "${form.headline}"`);
        archive._items = archive._items.filter((item: any) => item._id !== form._id);
    })
}})
</script>

<style>
main {
    max-width: 1280px;
    margin: auto;
}
h3 {
    margin: 0 1rem;
    margin-top: 1rem;
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    padding-left: 1rem;
    border-bottom: 1px solid var(--neutral-primary-3);
}
.stage {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0.25rem;
    margin-bottom: 0;
    padding: 0 1rem;
}
.stage-overlay {
    background-color: #00000011;
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 7px;
}
.stage-header {
    margin: 0.75rem;
    margin-bottom: 0;
    display: flex;
    flex-direction: row;
    button {
        padding: 0.25rem 0.5rem;
        margin: 0 1rem;
        background: var(--accent-green);
        border-radius: 0.25rem;
        cursor: pointer;
        :global(svg) {
            height: 100%;
            fill: white;
        }
    }
}
h5 {
    margin: 0;
    padding: 0.25rem 0.75rem;
    background: var(--secondary-3);
    border-radius: 0.25rem;
}
.empty {
    margin: 1rem 2rem;
    font-style: italic;
}
.publish-container {
    position:fixed;
    bottom: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: row;
    background: linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #B4DFFCaa 100%);
}
.publish {
    margin: 80% 0;
    padding: 2rem;
    border: 1px solid black;
    border-right: none;
    border-radius: 5px 0 0 5px;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    :global(svg) {
        width: 3rem;
        height: 3rem;
        pointer-events: none;
    }
}
</style>

<main>
    <ToastContainer class="toast-container" position="top-right">
    {#each notifications as notification (notification.id)}
        <Toast
            class={`toast ${(notification.color == "red") ? "toast-red" : "toast-green"}`}
            transition={fly} params={{ x: 200, duration: 800 }}
            bind:toastStatus={notification.visible}>
                {notification.message}
        </Toast>
    {/each}
    </ToastContainer>
    {#each data.desks._items as desk}
        <h3>{desk.name.toUpperCase()}</h3>
        {#each getDeskStages(desk._id) as stage}
            <div class="stage" role="list"
                ondragover={(ev) => { ev.preventDefault(); highlightedStage=stage._id }}
                ondrop={(ev: DragEvent) => moveContentItem(ev.dataTransfer?.getData("text") || "", desk._id, stage._id)}>
                {#if highlightedStage == stage._id}
                <div class="stage-overlay"></div>
                {/if}
                <div class="stage-header">
                    <h5>{stage.name.toUpperCase()}</h5>
                    <button onclick={createContentItem(desk, stage._id)}><PlusIcon /></button>
                </div>
                {#each stageItems.get(stage._id) || [] as item (item._id)}
                    <ContentItem {item} {deleteContentItem} bind:dragging={dragging} />
                {:else}
                    <p class="empty">No items...</p>
                {/each}
            </div>
        {/each}
    {/each}
    {#if dragging && getItemPublishable(dragging)}
        <div class="publish-container">
            <div class="publish" role="dialog" tabindex="0"
                style:background={publishHovered ? "#00000022" : "transparent"}
                ondragenter={() => publishHovered = true} ondragleave={() => publishHovered = false} ondragover={(ev) => ev.preventDefault()}
                ondrop={(ev: DragEvent) => { publishHovered = false; publishing = ev.dataTransfer?.getData("text"); }}>
                <CloudUploadIcon />
            </div>
        </div>
    {/if}
    {#if publishing}
        <PublishDialog bind:publishing={publishing} subscribers={data.subscribers._items} item={archive._items.find((i: any) => i._id == publishing)} />
    {/if}
</main>
