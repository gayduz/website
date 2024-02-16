import querystring from "node:querystring";
import { NextResponse } from "next/server";
import getAppUrl from "../../utils/get-app-url";

export function GET() {
	const params = {
		redirect_uri: `${getAppUrl()}/api/github/callback`,
	};

	const url = `https://github.com/apps/gayd-uz/installations/new?${querystring.encode(
		params,
	)}`;

	return NextResponse.redirect(url);
}
