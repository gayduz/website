import { BubbleMenu, Editor } from "@tiptap/react";

import { NodeTypeDropdown } from "./NodeTypeDropdown";
import { generalButtons } from "./buttons";

interface CustomBubbleMenuProps {
	editor: Editor;
}

export const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
	editor,
}) => {
	return (
		<BubbleMenu
			editor={editor}
			className="bubble-menu"
			tippyOptions={{
				duration: 200,
				animation: "shift-toward-subtle",
				moveTransition: "transform 0.2s ease-in-out",
			}}
		>
			<NodeTypeDropdown editor={editor} />
			{generalButtons.map((btn) => {
				return (
					<button
						type="button"
						className="bubble-menu-button"
						onClick={() => btn.action(editor)}
						key={btn.tooltip}
					>
						{btn.icon && <btn.icon size={16} />}
					</button>
				);
			})}
		</BubbleMenu>
	);
};
