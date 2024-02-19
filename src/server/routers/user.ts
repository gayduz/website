import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Octokit } from "octokit";
import { TRPCError } from "@trpc/server";
import { GithubAccessToken } from "../context";
import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { z } from "zod";

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
	getRepo: protectedProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.query(async ({ input, ctx: { userOctokit } }) => {
			const [owner, repo] = input.name.split("/");
			const { data: branches } = await userOctokit.rest.repos.listBranches({
				owner,
				repo,
			});
			console.log("list branches");
			console.log("her?");
			if (branches.length === 0) {
				return {
					branches,
				};
			}
			console.log("her?");
			const { data: branch } = await userOctokit.rest.repos.getBranch({
				owner,
				repo,
				branch: branches[0].name,
			});
			console.log("list branch");
			const { data: files } = await userOctokit.rest.git.getTree({
				owner,
				repo,
				tree_sha: branch.name,
				recursive: "1",
			});
			console.log("list files");
			return {
				branches,
				branch,
				files,
			};
		}),

	getFile: protectedProcedure
		.input(
			z.object({
				path: z.string(),
				repo: z.string(),
				branch: z.string(),
			}),
		)
		.query(async ({ input, ctx: { userOctokit } }) => {
			const { data: files } = await userOctokit.rest.git.getTree({
				owner: input.repo.split("/")[0],
				repo: input.repo.split("/")[1],
				tree_sha: input.branch,
				recursive: "1",
			});

			const fileMeta = files.tree.find((file) => file.path === input.path);

			if (!fileMeta) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const { data: file } = await userOctokit.rest.git.getBlob({
				owner: input.repo.split("/")[0],
				repo: input.repo.split("/")[1],
				file_sha: fileMeta.sha!,
			});

			return file;
		}),
});
