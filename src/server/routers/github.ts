import { createTRPCRouter, publicProcedure } from "../trpc";
import { GithubAccessToken } from "../context";

export const githubRouter = createTRPCRouter({
	callback: publicProcedure.query(
		async ({ ctx: { setGithubToken, githubAuthorize, request, ...ctx } }) => {
			const code = request.query.code as string | undefined;
			const installationId = parseInt(
				(request.query.installation_id as string | undefined) ?? "",
			);
			const token: GithubAccessToken =
				ctx.token ?? ({ installation_ids: [] } as unknown as GithubAccessToken);

			if (code) {
				const data = await githubAuthorize({ code });
				console.log(token, data);
				Object.assign(token, {
					...token,
					...data,
					installation_ids: [...(token.installation_ids ?? [])],
				});
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
