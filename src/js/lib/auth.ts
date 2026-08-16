import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

// Lib
import { database } from './db';
import { account, plants, session, user, verification } from './db/schema';

export const auth = betterAuth({
    database: drizzleAdapter(database, {
        provider: 'pg',
        schema: { account, plants, session, user, verification }
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        }
    },
    plugins: [nextCookies()]
});
