import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Lib
import { auth } from './auth';

/** Redirect to /login when unauthenticated; returns the active session otherwise. */
export async function requireUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) redirect('/login');
    return session;
}
