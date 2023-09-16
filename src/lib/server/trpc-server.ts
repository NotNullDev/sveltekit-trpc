import { users } from '$lib/schema';
import { TRPCError, initTRPC, type inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { z } from 'zod';
import { db } from './db';

export type User = {
	id: string;
	name: string;
	bio?: string;
};

export const t = initTRPC.context<Context>().create({
	transformer: superjson
});

export const appRouter = t.router({
	getUserById: t.procedure.input(z.number()).query(async ({ input }) => {
		return await db.query.users.findFirst({
			where: (fields, { eq }) => {
				return eq(fields.id, input);
			}
		});
	}),
	createUser: t.procedure
		.input(
			z.object({
				name: z.string().min(3)
			})
		)
		.mutation(async ({ input }) => {
			if (Math.random() > 0.5) {
				throw new TRPCError({
					message: 'yes, this is a trpc error!',
					code: 'BAD_REQUEST',
					cause: 'idk'
				});
			}

			const createdUsers = await db
				.insert(users)
				.values({
					fullName: input.name
				})
				.returning();

			const createdUser = createdUsers.at(0);
			if (!createdUser) {
				console.error('failed to create user');
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'failed to create user'
				});
			}

			return createdUser;
		})
});

export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
	const user = { name: req.headers.get('username') ?? 'anonymous' };
	return { req, resHeaders, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type AppRouter = typeof appRouter;
