import React from "react";

export type TMenu = {
	children: React.ReactNode;
};

export type TMenuFrame = {
	children: React.ReactNode;
};

export type TMenuTitle = {
	title: string;
};

export type TMenuItem = {
	icon: React.ReactNode;
	label: string;
	kbd?: string;
};

export type TMenuBigItem = {
	title: string;
	description?: string;
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type TMenuDivider = {};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type TMenuSearch = {};
