import { NextResponse } from 'next/server';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

export const GET = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);
    return NextResponse.json(plants);
};
