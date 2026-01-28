<script lang="ts">
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
    display: flex;
    flex-direction: column;
    * {
        margin: 0.5rem 0 ;
        text-align: center;
    }
}
</style>

<div id="publish-container" style:display={publishing ? undefined : "none"}>
    <dialog bind:this={dialog} onclose={() => publishing = undefined} closedBy="any">
        <form>
            <h3>PUBLISH</h3>
            <button id="close-publishing" onclick={() => dialog.close()}>close</button>
            <label for="subscribers">Target Subscribers:</label>
            <select id="subscribers">
            {#each subscribers as subscriber}
                <option value={subscriber._id}>{subscriber.name}</option>
            {/each}
            </select>
            <input type="submit" value="Publish" />
        </form>
    </dialog>
</div>
