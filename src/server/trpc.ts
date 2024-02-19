import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { GithubAccessToken, createTRPCContext } from "./context";
import { App, Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { isAxiosError } from "axios";

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (ctx.token == null) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You're not authorized",
		});
	}

	let userOctokit = new Octokit({
		auth: ctx.token.access_token,
	});

	const appOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: process.env.GITHUB_APP_ID,
			privateKey: process.env.GITHUB_PRIVATE_KEY,
		},
	});

	const app = new App({
		appId: process.env.GITHUB_APP_ID as string,
		privateKey: process.env.GITHUB_PRIVATE_KEY as string,
	});

	try {
		const user = await userOctokit.rest.users.getAuthenticated();
		return next({
			ctx: {
				...ctx,
				user: user.data,
				userOctokit,
				appOctokit,
				app,
			},
		});
	} catch (e) {
		// @ts-expect-error
		if (e?.response?.status === 401) {
			const data = await ctx.githubAuthorize({
				refreshToken: ctx.token.refresh_token,
			});

			Object.assign(ctx.token, {
				...ctx.token,
				...data,
				installation_ids: [...(ctx.token.installation_ids ?? [])],
			});

			await ctx.setGithubToken(ctx.token);

			userOctokit = new Octokit({
				auth: ctx.token.access_token,
			});

			const user = await userOctokit.rest.users.getAuthenticated();

			return next({
				ctx: {
					...ctx,
					user: user.data,
					userOctokit,
					appOctokit,
					app,
				},
			});
		}

		console.error(e);
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You're not authorized",
		});
	}
});
