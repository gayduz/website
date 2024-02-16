import querystring from "node:querystring";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { GithubAccessToken } from "../../types";
import getAppUrl from "../../utils/get-app-url";
import { getToken, setToken } from "../../utils/token";

export async function GET(request: NextRequest) {
	const sp = request.nextUrl.searchParams;
	const code = sp.get("code");
	const setupAction = sp.get("setup_action");
	const installationId = parseInt(sp.get("installation_id") as string);
	let token = await getToken();

	if (token == null) {
		const res = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			},
		);
		const rawData = querystring.decode(res.data);
		token = {
			access_token: rawData.access_token as string,
			expires_in: parseInt(rawData.expires_in as string),
			refresh_token: rawData.refresh_token as string,
			refresh_token_expires_in: parseInt(
				rawData.refresh_token_expires_in as string,
			),
			scope: rawData.scope as string,
			token_type: rawData.token_type as string,
			given_at: new Date().getTime(),
			installation_ids: [],
		};
	}

	if (!Number.isNaN(installationId)) {
		if (!token.installation_ids.includes(installationId)) {
			token.installation_ids.push(installationId);
		}
	}

	await setToken(token);
	return NextResponse.redirect(getAppUrl());
}
