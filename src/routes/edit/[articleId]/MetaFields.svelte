<script lang="ts">
    import { MultiSelect } from "flowbite-svelte";
    import OpenFieldsIcon from "$lib/images/arrow-bar-right.svg";
    import CloseFieldsIcon from "$lib/images/arrow-bar-left.svg";
    import "./multi-select.css";
    import { fieldNames, fieldVocabs } from "./meta-field-relationships";

    const { metaFields, schema, vocabs, item }: { metaFields: Map<string, any>, schema: Map<string, any>, vocabs: any, item: any } = $props();
    // if (schema.has("genre")) schema.set("genre", { ...schema.get("genre"), type: "string" }); // WORKAROUND! Genre is type list even though that doesn't make sense...

    const headerFieldIds = [...metaFields.keys().filter((f) => metaFields.get(f)?.section == "header")].sort((a, b) => metaFields.get(a).order - metaFields.get(b).order );
    const contentFieldIds = [...metaFields.keys().filter((f) => metaFields.get(f)?.section == "content")].sort((a, b) => metaFields.get(a).order - metaFields.get(b).order );

    const multiOptions = (field: string) => vocabs.get(fieldVocabs[field])?.items.map((i: any) => ({ name: i.name, value: i.qcode }));
    const multiValues = (field: string) => Object.getOwnPropertyDescriptor(item, field)?.value?.map((i: any) => i.qcode);

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
        input, select {
            background: var(--neutral-primary-2);
            border-bottom: 2px solid var(--neutral-primary-3);
            padding: 0.25rem 0.5rem;
        }
        input:focus-visible {
            outline: none;
            border-bottom: 2px solid var(--primary-800);
        }
    }
    .full-width { width: 24rem; }
    .half-width { width: 11.625rem; }
    .quarter-width { width: 5.4375rem; }
    hr {
        border-bottom: 1px solid var(--neutral-primary-3);
        width: 100%;
        margin: 0.75rem 0;
    }
</style>

<div id="meta-fields-container">
    <div style="border-right: 1px solid var(--primary-200); display: flex; flex-direction: column; padding: 1rem 1.5rem;">
        <img src={CloseFieldsIcon} alt="Hide meta fields" title="Hide meta fields" class={open ? "" : "hidden"} aria-hidden="true" onclick={toggle}/>
        <img src={OpenFieldsIcon} alt="Show meta fields" title="Show meta fields" class={open ? "hidden" : ""} aria-hidden="true" onclick={toggle}/>
        <div id="meta-fields" class={open ? "" : "hidden"}>
        {#each headerFieldIds as field}
            <div>
            {#if fieldVocabs[field]}
                {#if schema.get(field)?.type == "list"}
                    <MultiSelect
                        class={"multi-select " + metaFields.get(field).sdWidth + "-width"}
                        items={multiOptions(field)}
                        value={multiValues(field) || []} />
                {:else}
                    <select name={field} class={metaFields.get(field).sdWidth + "-width"} value={Object.getOwnPropertyDescriptor(item,field)?.value}>
                        {#if schema.get(field)?.nullable}<option></option>{/if}
                    {#each vocabs.get(fieldVocabs[field])?.items as item}
                        <option value={item.qcode}>{item.name}</option>
                    {/each}
                    </select>
                {/if}
            {:else}
                <input name={field} class={metaFields.get(field).sdWidth + "-width"} value={Object.getOwnPropertyDescriptor(item,field)?.value}/>
            {/if}
                <label for={field}>
                    {fieldNames[field]?.toUpperCase()}
                    <span style:color="var(--accent-red)">{metaFields.get(field).required ? "*" : ""}</span>
                </label>
            </div>
        {/each}
        <hr />
        {#each contentFieldIds as field}
        {#if fieldNames[field]}
            <div>
            {#if fieldVocabs[field]}
                <select name={field} class="full-width" value={Object.getOwnPropertyDescriptor(item,field)?.value}>
                    {#if schema.get(field)?.nullable}<option></option>{/if}
                {#each vocabs.get(fieldVocabs[field])?.items as item}
                    <option value={item.qcode}>{item.name}</option>
                {/each}
                </select>
            {:else}
                <input name={field} class="full-width" style:color={(field == "ednote") ? "var(--accent-red)" : ""} value={Object.getOwnPropertyDescriptor(item,field)?.value}/>
            {/if}
                <label for={field}>
                    {fieldNames[field]?.toUpperCase()}
                    <span style:color="var(--accent-red)">{metaFields.get(field).required ? "*" : ""}</span>
                </label>
            </div>
        {/if}
        {/each}
        </div>
    </div>
</div>
