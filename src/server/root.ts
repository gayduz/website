import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "./routers/user";
import { githubRouter } from "./routers/github";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	github: githubRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
