import { NextResponse } from 'next/server';

// Services
import { identifySpecies, PlantNetError } from '@/services/server/plantnet';

// Auth
import { requireUser } from '@/lib/auth/session';

export const POST = async (request: Request) => {
    await requireUser();

    const form = await request.formData();

    try {
        return NextResponse.json(await identifySpecies(form));
    } catch (error) {
        if (error instanceof PlantNetError) {
            return NextResponse.json({
                error: error.message
            }, {
                status: error.httpStatus
            });
        }

        throw error;
    }
};
