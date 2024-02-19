import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "@/server/root";
import { createTRPCContext } from "@/server/context";
import { ResponseMeta } from "@trpc/server/http";
import cookie from "cookie";
import { HTTPHeaders } from "@trpc/client";

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext: createTRPCContext,
	onError:
		process.env.NODE_ENV === "development"
			? ({ path, error }) => {
					console.error(
						`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
					);
			  }
			: undefined,
	responseMeta(opts) {
		const headers: HTTPHeaders = {};

		if (opts.ctx?.encryptedToken) {
			headers["set-cookie"] = cookie.serialize(
				"token",
				opts.ctx.encryptedToken,
			);
		}

		return { headers };
	},
});
