import { TRPCError, initTRPC, type inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { z } from 'zod';

export type User = {
	id: string;
	name: string;
	bio?: string;
};

const users: Record<string, User> = {};

export const t = initTRPC.context<Context>().create({
	transformer: superjson
});
export const appRouter = t.router({
	getUserById: t.procedure.input(z.string()).query((opts) => {
		return users[opts.input];
	}),
	createUser: t.procedure
		.input(
			z.object({
				name: z.string().min(3),
				bio: z.string().max(142).optional()
			})
		)
		.mutation((opts) => {
			const id = Date.now().toString();
			if (Math.random() > 0.5) {
				throw new TRPCError({
					message: 'yes, this is a trpc error!',
					code: 'BAD_REQUEST',
					cause: 'idk'
				});
			}
			const user: User = { id, ...opts.input };
			users[user.id] = user;
			return user;
		})
});

export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
	const user = { name: req.headers.get('username') ?? 'anonymous' };
	return { req, resHeaders, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type AppRouter = typeof appRouter;
