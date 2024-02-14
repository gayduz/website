import { AnyExtension, Editor, Extension } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import DropCursor from "@tiptap/extension-dropcursor";
import GapCursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";

import { Node as ProsemirrorNode } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import { Commands, suggestions } from "@/tiptap/extensions/slash-menu";
import { DBlock } from "./dBlock";
import { Document } from "./doc";
import { Link } from "./link";
import { Paragraph } from "./paragraph";
import { ResizableMedia } from "./resizableMedia";
import { SuperchargedTableExtensions } from "./supercharged-table";
import { TrailingNode } from "./trailingNode";

export interface PlaceholderOptions {
	emptyEditorClass: string;
	emptyNodeClass: string;
	placeholder:
		| ((PlaceholderProps: {
				editor: Editor;
				node: ProsemirrorNode;
				pos: number;
				hasAnchor: boolean;
		  }) => string)
		| string;
	showOnlyWhenEditable: boolean;
	showOnlyCurrent: boolean;
	includeChildren: boolean;
}

export const Placeholder = Extension.create<PlaceholderOptions>({
	name: "placeholder",

	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			placeholder: "Write something …",
			showOnlyWhenEditable: true,
			showOnlyCurrent: true,
			includeChildren: false,
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					decorations: ({ doc, selection }) => {
						const active =
							this.editor.isEditable || !this.options.showOnlyWhenEditable;
						const { anchor } = selection;
						const decorations: Decoration[] = [];

						if (!active) {
							return null;
						}

						doc.descendants((node, pos) => {
							const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
							const isEmpty = !node.isLeaf && !node.childCount;

							if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
								const classes = [this.options.emptyNodeClass];

								if (this.editor.isEmpty) {
									classes.push(this.options.emptyEditorClass);
								}

								const decoration = Decoration.node(pos, pos + node.nodeSize, {
									class: classes.join(" "),
									"data-placeholder":
										typeof this.options.placeholder === "function"
											? this.options.placeholder({
													editor: this.editor,
													node,
													pos,
													hasAnchor,
											  })
											: this.options.placeholder,
								});

								decorations.push(decoration);
							}

							return this.options.includeChildren;
						});

						return DecorationSet.create(doc, decorations);
					},
				},
			}),
		];
	},
});

interface GetExtensionsProps {
	openLinkModal: () => void;
}

export const getExtensions = ({
	openLinkModal,
}: GetExtensionsProps): AnyExtension[] => {
	return [
		// Necessary
		Document,
		DBlock,
		Paragraph,
		Text,
		DropCursor.configure({
			width: 2,
			class: "notitap-dropcursor",
			color: "skyblue",
		}),
		GapCursor,
		History,
		HardBreak,

		// marks
		Bold,
		Italic,
		Strike,
		Underline,
		Link.configure({
			autolink: true,
			linkOnPaste: true,
			protocols: ["mailto"],
			openOnClick: false,
			onModKPressed: openLinkModal,
		}),

		// Node
		ListItem,
		BulletList,
		OrderedList,
		Heading.configure({
			levels: [1, 2, 3],
		}),
		TrailingNode,

		// Table
		...SuperchargedTableExtensions,

		// Resizable Media
		ResizableMedia.configure({
			uploadFn: async (image) => {
				const fd = new FormData();

				fd.append("file", image);

				try {
					const response = await fetch("https://api.imgur.com/3/image", {
						method: "POST",
						body: fd,
					});

					console.log(await response.json());
				} catch {
					// do your thing
				} finally {
					// do your thing
				}

				return "https://source.unsplash.com/8xznAGy4HcY/800x400";
			},
		}),

		Commands.configure({
			suggestions,
		}),

		Placeholder.configure({
			placeholder: "Type `/` for commands",
			includeChildren: true,
		}),
	];
};
