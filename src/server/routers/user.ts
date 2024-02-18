import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Octokit } from "octokit";
import { TRPCError } from "@trpc/server";
import { GithubAccessToken } from "../context";
import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export const userRouter = createTRPCRouter({
	user: protectedProcedure.query(async ({ ctx: { user } }) => {
		return user;
	}),
	connectedRepos: protectedProcedure.query(async ({ ctx: { app, token } }) => {
		const repos: RestEndpointMethodTypes["apps"]["listReposAccessibleToInstallation"]["response"]["data"]["repositories"] =
			[];

		for (const installationId of token?.installation_ids ?? []) {
			const i = await app.getInstallationOctokit(installationId);
			const a = await i.rest.apps.listReposAccessibleToInstallation();
			// console.log(a.data);
			repos.push(...a.data.repositories);
		}

		return repos;
	}),
});
