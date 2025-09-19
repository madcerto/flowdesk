import { toggleMark } from "prosemirror-commands";
import { schema } from "./schema";

export const getToolbarItems = {
    textFormatting: [
        {
            tooltip: "Bold (Ctrl-B)",
            command: toggleMark(schema.marks.bold),
            innerHtml: "<b>B</b>"
        },
        {
            tooltip: "Italic (Ctrl-I)",
            command: toggleMark(schema.marks.italic),
            innerHtml: "<i>I</i>"
        },
        {
            tooltip: "Underline (Ctrl-U)",
            command: toggleMark(schema.marks.underline),
            innerHtml: "<u>U</u>"
        },
        {
            tooltip: "Strikethrough (Alt-Shift-5)",
            command: toggleMark(schema.marks.strikethrough),
            innerHtml: "<s>T</s>"
        },
        {
            tooltip: "Superscript (Ctrl-.)",
            command: toggleMark(schema.marks.superscript),
            innerHtml: '<span style="font-size: 1rem">X<sup>2</sup></span>'
        },
        {
            tooltip: "Subscript (Ctrl-,)",
            command: toggleMark(schema.marks.subscript),
            innerHtml: '<span style="font-size: 1rem">X<sub>2</sub></span>'
        },
    ]
};

// export default toolbarItems;
