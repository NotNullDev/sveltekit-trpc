import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import GitHub from '@auth/core/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';

export const handle = SvelteKitAuth({
	providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
	secret: AUTH_SECRET,
	adapter: DrizzleAdapter(db)
});
