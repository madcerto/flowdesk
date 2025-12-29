<script lang="ts">
import { page } from "$app/state";
import "$lib/styles/app.css";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import Header from "./Header.svelte";
import Editor from "./Editor.svelte";

const { data } = $props();

let editorState: EditorState | undefined = $state();
let editorView: EditorView | undefined = $state();

let metaFields = new Map(Object.entries(data.type.editor));
let schema = new Map(Object.entries(data.type.schema));
let vocabs = new Map(data.vocabularies._items.map((vocab: any) => [vocab._id, vocab]));
</script>

<Header
    {editorState} dispatch={editorView?.dispatch} focusEditor={editorView?.focus.bind(editorView)}
    item={data.content} desk={data.desk} stage={data.stage}
    {metaFields} {schema} {vocabs} />
<Editor bind:editorView bind:editorState content={data.content.body_html || ""} />

<!-- <footer> -->
<!--     <p>Editing article: {page.params.articleId}</p> -->
<!-- </footer> -->
