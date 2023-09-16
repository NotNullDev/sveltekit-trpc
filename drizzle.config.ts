import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DRIZZLE_DATABASE_URL!,
		ssl: true
	}
} satisfies Config;
