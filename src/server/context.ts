import { decryptData, encryptData } from "@/utils/crypt";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import cookie, { CookieSerializeOptions } from "cookie";

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
	const getCookies = () => {
		const cookieHeader = _opts.req.headers.cookie;
		if (!cookieHeader) return {};
		return cookie.parse(cookieHeader);
	};

	const getCookie = (name: string) => {
		const cookieHeader = _opts.req.headers.cookie;
		if (!cookieHeader) return;
		const cookies = cookie.parse(cookieHeader);
		return cookies[name];
	};

	const setCookie = (
		name: string,
		value: string,
		options?: CookieSerializeOptions,
	) => {
		_opts.res.appendHeader(
			"Set-Cookie",
			cookie.serialize(name, value, options),
		);
	};

	const getGithubToken = async () => {
		try {
			const rawToken = getCookie("token") ?? "";
			const token: GithubAccessToken = JSON.parse(await decryptData(rawToken));
			return token;
		} catch {
			return null;
		}
	};

	const setGithubToken = async (token: GithubAccessToken) => {
		const encryptedData = await encryptData(JSON.stringify(token));
		setCookie("token", encryptedData);
	};

	return {
		getCookies,
		getCookie,
		setCookie,
		getGithubToken,
		setGithubToken,
		request: _opts.req,
		token: await getGithubToken(),
	};
};
