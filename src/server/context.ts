import { decryptData, encryptData } from "@/utils/crypt";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import axios from "axios";
import cookie, { CookieSerializeOptions } from "cookie";
import querystring from "node:querystring";

export type GithubAccessToken = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in: number;
	scope: string;
	token_type: string;
	given_at: number;
	installation_ids: number[];
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
	const ctx = {
		setGithubToken,
		token: null as GithubAccessToken | null,
		encryptedToken: null as string | null,
		githubAuthorize,

		request: _opts.req,
	};

	const token = await getGithubToken();
	if (token) {
		ctx.token = token[1];
		ctx.encryptedToken = token[0];
	}

	function getCookie(name: string) {
		const cookieHeader = _opts.req.headers.cookie;
		if (!cookieHeader) return;
		const cookies = cookie.parse(cookieHeader);
		return cookies[name];
	}

	async function getGithubToken() {
		try {
			const rawToken = getCookie("token") ?? "";
			const token: GithubAccessToken = JSON.parse(await decryptData(rawToken));
			return [rawToken, token] as [string, GithubAccessToken];
		} catch {
			return null;
		}
	}

	async function setGithubToken(token: GithubAccessToken) {
		const encryptedData = await encryptData(JSON.stringify(token));
		ctx.encryptedToken = encryptedData;
	}

	return ctx;
};

async function githubAuthorize({
	code,
	refreshToken,
}: { code?: string; refreshToken?: string }) {
	try {
		const requestData: Record<string, string> = {
			client_id: process.env.GITHUB_CLIENT_ID as string,
			client_secret: process.env.GITHUB_CLIENT_SECRET as string,
		};

		if (code) {
			requestData.code = code;
		}

		if (refreshToken) {
			requestData.grant_type = "refresh_token";
			requestData.refresh_token = refreshToken;
		}

		const res = await axios.post(
			"https://github.com/login/oauth/access_token",
			requestData,
		);
		const data = querystring.decode(res.data);

		if ("error" in data) {
			throw new Error(res.data);
		}

		const token = {
			access_token: data.access_token,
			expires_in: parseInt(data.expires_in as string),
			refresh_token: data.refresh_token,
			refresh_token_expires_in: parseInt(
				data.refresh_token_expires_in as string,
			),
			scope: data.scope,
			given_at: new Date().getTime(),
			token_type: data.token_type,
			installation_ids: [],
		} as GithubAccessToken;

		return token;
	} catch (e) {
		console.error(e);
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid code",
		});
	}
}
