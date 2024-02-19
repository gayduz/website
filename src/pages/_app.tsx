import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import "@/tiptap/styles/tiptap.scss";
import "@/tiptap/extensions/resizableMedia/styles.scss";
import "@/tiptap/extensions/slash-menu/styles/CommandList.scss";
import "@/tiptap/menus/bubble-menu/styles.scss";
import "@/tiptap/extensions/supercharged-table/extension-table-cell/styles.scss";
import "@/tiptap/extensions/resizableMedia/styles.scss";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/utils/shadcn";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<style jsx global>{`
        html {
          font-family: ${fontSans.style.fontFamily};
        }
      `}</style>
			<main
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Component {...pageProps} />
			</main>
		</>
	);
};

export default api.withTRPC(MyApp);
