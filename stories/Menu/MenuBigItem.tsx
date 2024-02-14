import React from "react";
import { TMenuBigItem } from "./types";

const MenuBigItem: React.FC<TMenuBigItem> = ({ title, description }) => {
	return (
		<div className="flex gap-3 px-2 py-1 mx-1 hover:bg-gray-100 rounded cursor-pointer transition-all">
			<div className="flex-shrink-0 border w-10 h-10 rounded overflow-hidden" />
			<div className="flex flex-col flex-1">
				<div className="text-sm">{title}</div>
				<div className="text-xs text-gray-500">{description}</div>
			</div>
		</div>
	);
};

export default MenuBigItem;
