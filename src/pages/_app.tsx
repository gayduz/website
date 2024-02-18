import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import "@/tiptap/styles/tiptap.scss";
import "@/tiptap/extensions/resizableMedia/styles.scss";
import "@/tiptap/extensions/slash-menu/styles/CommandList.scss";
import "@/tiptap/menus/bubble-menu/styles.scss";
import "@/tiptap/extensions/supercharged-table/extension-table-cell/styles.scss";
import "@/tiptap/extensions/resizableMedia/styles.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
