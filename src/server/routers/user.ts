import { createTRPCRouter, publicProcedure } from "../trpc";
import { Octokit } from "octokit";
import { TRPCError } from "@trpc/server";
import { GithubAccessToken } from "../context";

export const userRouter = createTRPCRouter({
	user: publicProcedure.query(async ({ ctx: { getGithubToken } }) => {
		const token = (await getGithubToken()) as GithubAccessToken;
		const octokit = new Octokit({
			auth: token.access_token,
			// auth: process.env.GITHUB_BOT_PERSONAL_TOKEN,
			// authStrategy: createAppAuth,
			// auth: {
			// 	appId: process.env.GITHUB_APP_ID,
			// 	privateKey: process.env.GITHUB_PRIVATE_KEY,
			// 	// installationId: token.installation_id,
			// },
		});
		try {
			const user = await octokit.rest.users.getAuthenticated();
			return user.data;
		} catch (e) {
			console.error(e);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: (e as Error).message,
			});
		}
	}),
});
