<script lang="ts">
    import OpenFieldsIcon from "$lib/images/arrow-bar-right.svg";
    import CloseFieldsIcon from "$lib/images/arrow-bar-left.svg";

    let open = $state(true);

    function toggle() { open = !open; }
</script>

<style>
    #meta-fields-container {
        /* border-top: 1px solid var(--neutral-primary-4); */
        position: fixed;
        left: 0;
        display: flex;
        padding-top: 1rem;
        height: 100%;
        background: var(--neutral-primary-1);
        img {
            height: 1.5rem;
            width: 1.5rem;
            box-sizing: content-box;
            padding: 1rem;
            border-radius: 9999px;
            cursor: pointer;
        }
        img:hover {
            background: var(--neutral-primary-2);
        }
    }
    #meta-fields {
        padding-top: 2rem;
        display: flex;
        flex-direction: column;
        
    }
</style>

<div id="meta-fields-container">
    <div style="border-right: 1px solid var(--primary-200); display: flex; flex-direction: column; padding: 1rem 1.5rem;">
        <img src={CloseFieldsIcon} alt="Hide meta fields" class={open ? "" : "hidden"} aria-hidden="true" onclick={toggle}/>
        <img src={OpenFieldsIcon} alt="Show meta fields" title="Show meta fields" class={open ? "hidden" : ""} aria-hidden="true" onclick={toggle}/>
        <div id="meta-fields" class={open ? "" : "hidden"}>
            <label for="slugline">SLUGLINE</label>
            <input name="slugline"/>
            <label for="categories">CATEGORIES</label>
            <input name="categories"/>
            <label for="byline">BYLINE</label>
            <input name="byline"/>
        </div>
    </div>
</div>
