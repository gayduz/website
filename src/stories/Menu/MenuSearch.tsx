import React from "react";
import { TMenuSearch } from "./types";

const MenuSearch: React.FC<TMenuSearch> = () => {
	return (
		<div className="flex px-3 my-1">
			<input className="border rounded w-full bg-gray-50 p-1 text-sm outline-none" />
		</div>
	);
};

export default MenuSearch;
