import React from "react";

export const MenuContext = React.createContext(null);

export function useMenuContext() {
	const context = React.useContext(MenuContext);

	if (!context) {
		throw new Error("Menu.* component must be rendered inside Menu component");
	}

	return context;
}
