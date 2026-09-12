import { NextResponse } from 'next/server';

// Services
import { listPlants } from '@/services/server/plants';

// Auth
import { requireUser } from '@/lib/auth/session';

export const GET = async () => {
    const session = await requireUser();
    const plants = await listPlants(session.user.id);

    return NextResponse.json(plants);
};
