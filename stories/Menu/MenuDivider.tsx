import React from "react";
import { TMenuDivider } from "./types";

const MenuDivider: React.FC<TMenuDivider> = () => {
	return <div className="h-px w-full bg-gray-200 my-1" />;
};

export default MenuDivider;
