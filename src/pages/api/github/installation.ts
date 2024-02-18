import { NextApiRequest, NextApiResponse } from "next";
import getAppUrl from "@/utils/get-app-url";
import querystring from "node:querystring";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const params = {
		state: `${getAppUrl()}/api/trpc/github.callback`,
	};

	const url = `https://github.com/apps/gayd-uz/installations/new?${querystring.encode(
		params,
	)}`;

	return res.redirect(url);
}
