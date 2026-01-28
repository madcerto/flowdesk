<script lang="ts">
let { publishing = $bindable() } = $props();

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
</style>

<div id="publish-container" style:display={publishing ? undefined : "none"}>
    <dialog bind:this={dialog} onclose={() => publishing = undefined} closedBy="any">
        PUBLISHING
    </dialog>
</div>
