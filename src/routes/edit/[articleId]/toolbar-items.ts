import { toggleMark } from "prosemirror-commands";
import { schema } from "./schema";

export const getToolbarItems = () => { return {
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
    ],
    textStyles: [
        {
            val: "p", shortcut: "0", name: "Normal text",
            blockType: schema.nodes.paragraph
        },
        {
            val: "h1", shortcut: "1", name: "Heading 1",
            blockType: schema.nodes.heading, args: { level: 1 }
        },
        {
            val: "h2", shortcut: "2", name: "Heading 2",
            blockType: schema.nodes.heading, args: { level: 2 }
        },
        {
            val: "h3", shortcut: "3", name: "Heading 3",
            blockType: schema.nodes.heading, args: { level: 3 }
        },
        {
            val: "h4", shortcut: "4", name: "Heading 4",
            blockType: schema.nodes.heading, args: { level: 4 }
        },
        {
            val: "h5", shortcut: "5", name: "Heading 5",
            blockType: schema.nodes.heading, args: { level: 5 }
        },
        {
            val: "h6", shortcut: "6", name: "Heading 6",
            blockType: schema.nodes.heading, args: { level: 6 }
        }
    ]
};};

// export default toolbarItems;
