import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Constants
import { DB_POOL_CONNECTION_TIMEOUT_MS, DB_POOL_IDLE_TIMEOUT_MS, DB_POOL_MAX } from './constants';

const globalForDatabase = globalThis as unknown as { sproutPool?: Pool; };

// Reused across dev HMR re-evaluations so the module can't leak a pool per reload.
const pool = globalForDatabase.sproutPool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    max: DB_POOL_MAX,
    connectionTimeoutMillis: DB_POOL_CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: DB_POOL_IDLE_TIMEOUT_MS
});

if (process.env.NODE_ENV !== 'production') {
    globalForDatabase.sproutPool = pool;
}

export const database = drizzle(pool);
