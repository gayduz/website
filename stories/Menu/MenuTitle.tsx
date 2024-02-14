import React from "react";
import { TMenuTitle } from "./types";

const MenuTitle: React.FC<TMenuTitle> = ({ title }) => {
	return <div className="text-xs px-3 my-1">{title}</div>;
};

export default MenuTitle;
