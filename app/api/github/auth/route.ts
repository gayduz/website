import querystring from "node:querystring";
import { NextResponse } from "next/server";
import getAppUrl from "../../utils/get-app-url";

export function GET() {
	const params = {
		client_id: process.env.GITHUB_CLIENT_ID,
		redirect_uri: `${getAppUrl()}/api/github/callback`,
	};
	const url = `https://github.com/login/oauth/authorize?${querystring.encode(
		params,
	)}`;
	return NextResponse.redirect(url);
}
