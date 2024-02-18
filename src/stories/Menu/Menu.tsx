import React from "react";
import MenuFrame from "./MenuFrame";
import { MenuContext } from "./context";
import { TMenu } from "./types";

const Menu: React.FC<TMenu> = ({ children }) => {
	return (
		<MenuContext.Provider value={null}>
			<MenuFrame>{children}</MenuFrame>
		</MenuContext.Provider>
	);
};

export default Menu;
