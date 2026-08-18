import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth
import { auth } from '@/js/lib/auth';

/** Redirect to /login when unauthenticated; returns the active session otherwise. */
export const requireUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    return session;
};
