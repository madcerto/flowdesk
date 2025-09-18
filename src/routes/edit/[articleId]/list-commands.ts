import { EditorState } from "prosemirror-state";
import { sinkListItem } from "prosemirror-schema-list";
import { schema } from "./schema";

export function tabListItem(state: EditorState, dispatch?: (tr: Transaction) => any): boolean {
    const fromRes = state.selection.$from;
    const nodeType = fromRes.node(fromRes.depth-1).type;
    // If selection start position is inside a list item and at the beginning of said list item
    if (nodeType == schema.nodes.list_item && fromRes.parentOffset == 0) {
        // Then try to sink the list item into a nested list of the appropriate type
        return sinkListItem(schema.nodes.list_item)(state, dispatch);
    } else return true;
}
