import { NextResponse } from 'next/server';

// Database
import { getPlantsForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

export const GET = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return NextResponse.json(plants);
};
