import { NextApiRequest, NextApiResponse } from "next";
import getAppUrl from "@/utils/get-app-url";
import querystring from "node:querystring";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const params = {
		client_id: process.env.GITHUB_CLIENT_ID,
		redirect_uri: `${getAppUrl()}/api/trpc/github.callback`,
		scope: "user repo",
	};

	const url = `https://github.com/login/oauth/authorize?${querystring.encode(
		params,
	)}`;

	return res.redirect(url);
}
