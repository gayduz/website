import React from "react";
import { TMenuFrame } from "./types";

const MenuFrame: React.FC<TMenuFrame> = ({ children }) => {
	return <div className="border py-1 rounded-lg">{children}</div>;
};

export default MenuFrame;
