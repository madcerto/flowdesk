import { undoInputRule } from "prosemirror-inputrules";
import { splitListItem, liftListItem, sinkListItem, wrapInList } from "prosemirror-schema-list";
import { setBlockType, toggleMark } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { schema } from "./schema";
import { tabListItem } from "./list-commands";

const setHeading = (level: number) => setBlockType(schema.nodes.heading, { level });

export const keymaps = {
    "Backspace": undoInputRule,
    "Enter": splitListItem(schema.nodes.list_item),
    "Tab": tabListItem,
    "Shift-Tab": liftListItem(schema.nodes.list_item),
    "Mod-z": undo, "Mod-Shift-z": redo, "Mod-y": redo,
    "Mod-Alt-0": setBlockType(schema.nodes.paragraph),
    "Mod-Alt-1": setHeading(1), "Mod-Alt-2": setHeading(2),
    "Mod-Alt-3": setHeading(3), "Mod-Alt-4": setHeading(4),
    "Mod-Alt-5": setHeading(5), "Mod-Alt-6": setHeading(6),
    "Mod-b": toggleMark(schema.marks.bold), "Mod-B": toggleMark(schema.marks.bold),
    "Mod-i": toggleMark(schema.marks.italic),
    "Mod-u": toggleMark(schema.marks.underline),
    "Alt-Shift-5": toggleMark(schema.marks.strikethrough),
    "Mod-.": toggleMark(schema.marks.superscript),
    "Mod-,": toggleMark(schema.marks.subscript),
    "Mod-Shift-7": wrapInList(schema.nodes.ordered_list),
    "Mod-Shift-8": wrapInList(schema.nodes.unordered_list)
}; 
