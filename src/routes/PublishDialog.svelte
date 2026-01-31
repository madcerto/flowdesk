<script lang="ts">
import { enhance } from "$app/forms";
import { MultiSelect } from "flowbite-svelte";
import "$lib/styles/multi-select.css";
import XIcon from "$lib/images/x.svelte";

let { publishing = $bindable(), subscribers, item } = $props();

let targets = $state([]);
let dialog: HTMLDialogElement;

$effect(() => {
    if (publishing) dialog.showModal();
})
</script>

<style>
#publish-container {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: #00000055;
    display: flex;
    justify-content: center;
    align-items: center;
}
dialog {
    background: transparent;
}
form {
    background: var(--neutral-primary-1);
    border-radius: 10px;
    border: 1px solid var(--neutral-secondary-1);
    padding: 1rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    * {
        margin: 0.25rem 0;
    }
    h3 {
        margin: 0.75rem 1rem 2rem 0;
    }
    label {
        color: var(--neutral-secondary-3);
        font-size: 1rem;
    }
}
#close-publishing {
    position: absolute;
    top: 1rem;
    right: 1rem;
    border-radius: 9999px;
    background: none;
    margin: 0;
    padding: 0;
    :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
        vertical-align: bottom;
    }
}
#close-publishing:hover {
    color: red;
    cursor: pointer;
    background: #00000022;
}
#dialog-actions {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: row;
    justify-content: end;
    button {
        font-size: 1rem;
        padding: 0.25rem 0.75rem;
        margin: 0 0.5rem;
        border-radius: 5px;
    }
    button[type="submit"] {
        background: var(--primary-800);
        color: white;
    }
    button[type="submit"]:hover {
        background: var(--accent-blue);
    }
    button[disabled], button[disabled]:hover {
        background: var(--neutral-primary-3);
        cursor: not-allowed;
    }
}
</style>

<div id="publish-container" style:display={publishing ? undefined : "none"}>
    <dialog bind:this={dialog} onclose={() => publishing = undefined} closedBy="any">
        <form method="post" use:enhance={({ formData }) => {
            formData.append("contentId", publishing);

            return async ({ update }) => {
                update({ reset: false });
                dialog.close();
            };
        }}>
            <button id="close-publishing" type="button" onclick={() => dialog.close()}><XIcon /></button>
            <h3>Publish '{item.headline}'?</h3>
            <label for="subscribers">TARGETS</label>
            <MultiSelect
                name="subscribers" class="multi-select" placeholder="Select target subscribers..."
                items={subscribers.map((s: any) => ({name: s.name, value: s._id}))} bind:value={targets} />
            <div id="dialog-actions">
                <button type="button" onclick={() => dialog.close()}>CANCEL</button>
                <button type="submit" disabled={targets.length == 0}>PUBLISH</button>
            </div>
        </form>
    </dialog>
</div>
