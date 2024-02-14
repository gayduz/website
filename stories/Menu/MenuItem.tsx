import React from "react";
import { TMenuItem } from "./types";

const MenuItem: React.FC<TMenuItem> = ({ icon, label, kbd }) => {
	return (
		<div className="flex items-center gap-2 mx-1 px-2 py-1 hover:bg-gray-100 rounded transition-all cursor-pointer">
			{icon}
			<span className="text-sm flex-1">{label}</span>
			<span className="text-xs text-gray-400">{kbd}</span>
		</div>
	);
};

export default MenuItem;
