import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { GithubAccessToken, createTRPCContext } from "./context";
import { App, Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

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
	if (!ctx.token) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You're not authorized",
		});
	}

	const token = (await ctx.getGithubToken()) as GithubAccessToken;

	const userOctokit = new Octokit({
		auth: token.access_token,
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
		console.error(e);
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You're not authorized",
		});
	}
});
