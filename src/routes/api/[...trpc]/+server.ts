import { appRouter, createContext } from '$lib/server/trpc-server';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const GET: RequestHandler = async ({ request }) => {
	return forwardToTrpc(request);
};

export const POST: RequestHandler = async ({ request }) => {
	return forwardToTrpc(request);
};

async function forwardToTrpc(req: Request) {
	return await fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		onError: ({ path, error }) => {
			console.log(`something went wrong... ${path} ${error.message}`);
		},
		createContext
	});
}
