/* @unocss-include */
// import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconFloatLeft, IconFloatRight, IconDelete } from '~/assets'

import React from "react";
import {
	MdDelete,
	MdFormatAlignCenter,
	MdFormatAlignLeft,
	MdFormatAlignRight,
} from "react-icons/md";

interface ResizableMediaAction {
	tooltip: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	icon?: React.FC<any>;
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	action?: (updateAttributes: (o: Record<string, any>) => any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	isActive?: (attrs: Record<string, any>) => boolean;
	delete?: (d: () => void) => void;
}

export const resizableMediaActions: ResizableMediaAction[] = [
	{
		tooltip: "Align left",
		action: (updateAttributes) =>
			updateAttributes({
				dataAlign: "start",
				dataFloat: null,
			}),
		icon: MdFormatAlignLeft,
		isActive: (attrs) => attrs.dataAlign === "start",
	},
	{
		tooltip: "Align center",
		action: (updateAttributes) =>
			updateAttributes({
				dataAlign: "center",
				dataFloat: null,
			}),
		icon: MdFormatAlignCenter,
		isActive: (attrs) => attrs.dataAlign === "center",
	},
	{
		tooltip: "Align right",
		action: (updateAttributes) =>
			updateAttributes({
				dataAlign: "end",
				dataFloat: null,
			}),
		icon: MdFormatAlignRight,
		isActive: (attrs) => attrs.dataAlign === "end",
	},
	{
		tooltip: "Delete",
		icon: MdDelete,
		delete: (deleteNode) => deleteNode(),
	},
];
