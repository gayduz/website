import type { Meta, StoryObj } from "@storybook/react";

import {
	Menu,
	MenuBigItem,
	MenuDivider,
	MenuItem,
	MenuSearch,
	MenuTitle,
} from "./index";

const meta = {
	title: "Menu",
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
	render() {
		return (
			<Menu>
				<MenuSearch />
				<MenuTitle title="Basic blocks" />
				<MenuBigItem title="Text" description="Just start with plain text" />
				<MenuBigItem title="Text" description="Just start with plain text" />
				<MenuDivider />
				<MenuItem icon="" label="Copy link to block" kbd="Alt+Shift+L" />
				<MenuDivider />
				<MenuItem icon="" label="Move to" kbd="Ctrl+Shift+P" />
				<MenuDivider />
				<MenuItem icon="" label="Comment" kbd="Ctrl+Shift+M" />
			</Menu>
		);
	},
};
