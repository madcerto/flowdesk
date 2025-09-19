import { undoInputRule } from "prosemirror-inputrules";
import { splitListItem, liftListItem, sinkListItem } from "prosemirror-schema-list";
import { schema } from "./schema";
import { tabListItem } from "./list-commands";

export const keymaps = {
    "Backspace": undoInputRule,
    "Enter": splitListItem(schema.nodes.list_item),
    "Tab": tabListItem,
    "Shift-Tab": liftListItem(schema.nodes.list_item)
}; 
