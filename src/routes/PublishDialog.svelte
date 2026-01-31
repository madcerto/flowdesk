<script lang="ts">
import { enhance } from "$app/forms";
import XIcon from "$lib/images/x.svelte";

let { publishing = $bindable(), subscribers } = $props();

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
    border: 1px solid black;
    padding: 1rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    * {
        margin: 0.5rem 0 ;
        text-align: center;
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
            <h3>PUBLISH</h3>
            <button id="close-publishing" type="button" onclick={() => dialog.close()}><XIcon /></button>
            <label for="subscribers">Target Subscribers:</label>
            <select name="subscribers">
            {#each subscribers as subscriber}
                <option value={subscriber._id}>{subscriber.name}</option>
            {/each}
            </select>
            <input type="submit" value="Publish" />
        </form>
    </dialog>
</div>
