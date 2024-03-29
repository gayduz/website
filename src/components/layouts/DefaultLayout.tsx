import React from "react";
import Sidebar from "../Sidebar";
import Head from "next/head";

const DefaultLayout: React.FC<{
	children: React.ReactNode;
	sidebarChildren?: React.ReactNode;
}> = ({ children, sidebarChildren }) => {
	return (
		<>
			<Head>
				<title>gayd.uz</title>
				<meta name="description" content="gayd.uz" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex">
				<Sidebar>{sidebarChildren}</Sidebar>
				<div className="h-screen overflow-y-auto flex-1">{children}</div>
			</div>
		</>
	);
};

export default DefaultLayout;
