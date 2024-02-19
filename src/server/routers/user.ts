import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Octokit } from "octokit";
import { TRPCError } from "@trpc/server";
import { GithubAccessToken } from "../context";
import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export const userRouter = createTRPCRouter({
	user: protectedProcedure.query(async ({ ctx: { user } }) => {
		return user;
	}),
	connectedRepos: protectedProcedure.query(
		async ({ ctx: { app, token, userOctokit } }) => {
			const repos: RestEndpointMethodTypes["apps"]["listReposAccessibleToInstallation"]["response"]["data"]["repositories"] =
				[];

			const installations = (
				await userOctokit.request("GET /user/installations")
			).data.installations;

			for (const installation of installations) {
				const i = await app.getInstallationOctokit(installation.id);
				const a = await i.rest.apps.listReposAccessibleToInstallation();
				repos.push(...a.data.repositories);
			}

			return repos;
		},
	),
});
