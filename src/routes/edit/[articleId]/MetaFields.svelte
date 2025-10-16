<script lang="ts">
    import OpenFieldsIcon from "$lib/images/arrow-bar-right.svg";
    import CloseFieldsIcon from "$lib/images/arrow-bar-left.svg";
    import { fieldNames } from "./meta-field-relationships";

    const { metaFields }: { metaFields: Map<string, any> } = $props();

    const fieldIds = [...metaFields.keys().filter((f) => metaFields.get(f))].sort((a, b) => metaFields.get(a).order - metaFields.get(b).order );

    let open = $state(false);

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
        padding-right: 1rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        overflow: auto;
        max-width: 25rem;
        * { font-size: 1rem; }
        div {
            display: flex;
            flex-direction: column;
        }
        label { color: var(--neutral-secondary-3); }
        input {
            background: var(--neutral-primary-2);
            border-bottom: 2px solid transparent;
            padding: 0.25rem;
        }
        input:focus-visible {
            outline: none;
            border-bottom: 2px solid var(--primary-800);
        }
    }
    .full-width { width: 24rem; }
    .half-width { width: 11.625rem; }
    .quarter-width { width: 5.4375rem; }
</style>

<div id="meta-fields-container">
    <div style="border-right: 1px solid var(--primary-200); display: flex; flex-direction: column; padding: 1rem 1.5rem;">
        <img src={CloseFieldsIcon} alt="Hide meta fields" title="Hide meta fields" class={open ? "" : "hidden"} aria-hidden="true" onclick={toggle}/>
        <img src={OpenFieldsIcon} alt="Show meta fields" title="Show meta fields" class={open ? "hidden" : ""} aria-hidden="true" onclick={toggle}/>
        <div id="meta-fields" class={open ? "" : "hidden"}>
        {#each fieldIds as field}
            <div>
                <input name={field} class={metaFields.get(field).sdWidth + "-width"}/>
                <label for={field}>
                    {fieldNames[field]?.toUpperCase()}
                    <span style:color="var(--accent-red)">{metaFields.get(field).required ? "*" : ""}</span>
                </label>
            </div>
        {/each}
        </div>
    </div>
</div>
