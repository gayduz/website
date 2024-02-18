import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import querystring from "node:querystring";
import { GithubAccessToken } from "../context";

export const githubRouter = createTRPCRouter({
	callback: publicProcedure.query(
		async ({ ctx: { getGithubToken, setGithubToken, request } }) => {
			const code = request.query.code as string | undefined;
			const installationId = parseInt(
				(request.query.installation_id as string | undefined) ?? "",
			);
			const token: GithubAccessToken =
				(await getGithubToken()) ??
				({ installation_ids: [] } as unknown as GithubAccessToken);

			if (code) {
				try {
					const res = await axios.post(
						"https://github.com/login/oauth/access_token",
						{
							client_id: process.env.GITHUB_CLIENT_ID,
							client_secret: process.env.GITHUB_CLIENT_SECRET,
							code,
						},
					);
					const rawData = querystring.decode(res.data);
					if ("error" in rawData) {
						throw new Error(res.data);
					}
					Object.assign(token, {
						...token,
						...rawData,
						installation_ids: [...(token.installation_ids ?? [])],
					});
				} catch (e) {
					console.error(e);
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Invalid code",
					});
				}
			}

			if (!Array.isArray(token.installation_ids)) {
				token.installation_ids = [];
			}

			if (
				!Number.isNaN(installationId) &&
				!token.installation_ids.includes(installationId)
			) {
				token.installation_ids.push(installationId);
			}

			await setGithubToken(token);

			return true;
		},
	),
	webhook: publicProcedure.mutation(async () => {
		return true;
	}),
});
