/* @unocss-include */
// import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconFloatLeft, IconFloatRight, IconDelete } from '~/assets'

import {MdDelete, MdFormatAlignCenter, MdFormatAlignLeft, MdFormatAlignRight} from "react-icons/md";
import React from "react";

interface ResizableMediaAction {
  tooltip: string;
  icon?: React.FC;
  action?: (updateAttributes: (o: Record<string, any>) => any) => void;
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
