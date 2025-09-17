import { Schema } from "prosemirror-model";

export const schema: Schema = new Schema({
    nodes: {
        text: { group: "inline" },
        doc: { content: "block+" },
        /// A plain paragraph textblock. Represented in the DOM
        /// as a `<p>` element.
        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [{tag: "p"}],
            toDOM() { return ["p", 0] }
        },
        /// A blockquote (`<blockquote>`) wrapping one or more blocks.
        // blockquote: {
        //     content: "block+",
        //     group: "block",
        //     defining: true,
        //     parseDOM: [{tag: "blockquote"}],
        //     toDOM() { return blockquoteDOM }
        // } as NodeSpec,
        /// A horizontal rule (`<hr>`).
        // horizontal_rule: {
        //     group: "block",
        //     parseDOM: [{tag: "hr"}],
        //     toDOM() { return hrDOM }
        // } as NodeSpec,
        /// A heading textblock, with a `level` attribute that
        /// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
        /// `<h6>` elements.
        heading: {
            attrs: {level: {default: 1, validate: "number"}},
            content: "inline*",
            group: "block",
            defining: true,
            parseDOM: [{tag: "h1", attrs: {level: 1}},
                       {tag: "h2", attrs: {level: 2}},
                       {tag: "h3", attrs: {level: 3}},
                       {tag: "h4", attrs: {level: 4}},
                       {tag: "h5", attrs: {level: 5}},
                       {tag: "h6", attrs: {level: 6}}],
            toDOM(node) { return ["h" + node.attrs.level, 0] }
        },
        /// A code listing. Disallows marks or non-text inline
        /// nodes by default. Represented as a `<pre>` element with a
        /// `<code>` element inside of it.
        // code_block: {
        //     content: "text*",
        //     marks: "",
        //     group: "block",
        //     code: true,
        //     defining: true,
        //     parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
        //     toDOM() { return preDOM }
        // } as NodeSpec,
        /// An inline image (`<img>`) node. Supports `src`,
        /// `alt`, and `href` attributes. The latter two default to the empty
        /// string.
        // image: {
        //     inline: true,
        //     attrs: {
        //       src: {validate: "string"},
        //       alt: {default: null, validate: "string|null"},
        //       title: {default: null, validate: "string|null"}
        //     },
        //     group: "inline",
        //     draggable: true,
        //     parseDOM: [{tag: "img[src]", getAttrs(dom: HTMLElement) {
        //       return {
        //         src: dom.getAttribute("src"),
        //         title: dom.getAttribute("title"),
        //         alt: dom.getAttribute("alt")
        //       }
        //     }}],
        //     toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
        // } as NodeSpec,
        /// A hard line break, represented in the DOM as `<br>`.
        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{tag: "br"}],
            toDOM() { return ["br"] }
        }
    },
    marks: {
        /// A link. Has `href` and `title` attributes. `title`
        /// defaults to the empty string. Rendered and parsed as an `<a>`
        /// element.
        // link: {
        //     attrs: {
        //         href: {validate: "string"},
        //         title: {default: null, validate: "string|null"}
        //     },
        //     inclusive: false,
        //     parseDOM: [{tag: "a[href]", getAttrs(dom: HTMLElement) {
        //         return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
        //     }}],
        //     toDOM(node) { let {href, title} = node.attrs; return ["a", {href, title}, 0] }
        // },
        italic: {
            parseDOM: [
                {tag: "i"}, {tag: "em"},
                {style: "font-style=italic"},
                {style: "font-style=normal", clearMark: m => m.type.name == "italic"}
            ],
            toDOM() { return ["i"] }
        },
        bold: {
            parseDOM: [
                {tag: "strong"},
                // This works around a Google Docs misbehavior where
                // pasted content will be inexplicably wrapped in `<b>`
                // tags with a font-weight normal.
                {tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null},
                {style: "font-weight=400", clearMark: m => m.type.name == "bold"},
                {style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null},
            ],
            toDOM() { return ["b"] }
        },
        underline: {
            parseDOM: [
                {tag: "u"},
                {style: "text-decoration=underline"},
                {style: "text-decoration=none", clearMark: m => m.type.name == "underline"}
            ],
            toDOM() { return ["u"] }
        },
        strikethrough: {
            parseDOM: [
                {tag: "s"},
                {style: "text-decoration=line-through"},
                {style: "text-decoration=none", clearMark: m => m.type.name == "strikethrough"}
            ],
            toDOM() { return ["s"] }
        },
        superscript: {
            parseDOM: [
                {tag: "sup"},
                {style: "vertical-align=super"},
                {style: "vertical-align=baseline", clearMark: m => m.type.name == "superscript"}
            ],
            toDOM() { return ["sup"] }
        },
        /// Code font mark. Represented as a `<code>` element.
        code: {
            code: true,
            parseDOM: [{tag: "code"}],
            toDOM() { return ["code", 0] }
        }
    }
});
