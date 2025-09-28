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
</script>

<Header
    {editorState} dispatch={editorView?.dispatch} focusEditor={editorView?.focus.bind(editorView)}
    headline={data.content.headline} etag={data.content._etag} desk={data.desk} stage={data.stage} />
<Editor bind:editorView bind:editorState content={data.content.body_html} />

<footer>
    <p>Editing article: {page.params.articleId}</p>
</footer>
