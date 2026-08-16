import { NextResponse } from 'next/server';

// Database
import { defaultCareFor } from '@/js/lib/db/care-defaults';

// Auth
import { requireUser } from '@/js/lib/auth/session';

// Types
import type { IdentifyResult } from '@/js/services/identify/types';

interface PlantNetResult {
    scientificNameWithoutAuthor?: string | null;
    commonNames?: string[] | null;
    score?: number | null;
}

export const POST = async (request: Request) => {
    await requireUser();

    const form = await request.formData();
    const image = form.get('images');
    if (!(image instanceof File)) {
        return NextResponse.json({
            error: 'No image provided.'
        }, {
            status: 400
        });
    }

    const apiKey = process.env.PLANTNET_API_KEY ?? (form.get('apiKey') as string | null);
    if (!apiKey) {
        return NextResponse.json({
            error: 'No PlantNet API key configured. Add one in Settings.'
        }, {
            status: 400
        });
    }

    const body = new FormData();
    body.append('images', image, 'plant.jpg');
    body.append('organs', 'auto');

    const response = await fetch(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(apiKey)}&nb-results=5`,
        {
            method: 'POST',
            body
        }
    );

    if (!response.ok) {
        if (response.status === 401) {
            return NextResponse.json({
                error: 'PlantNet rejected the API key. Check it in Settings.'
            }, {
                status: 400
            });
        }
        if (response.status === 404) {
            return NextResponse.json({
                error: 'PlantNet couldn\'t recognise the plant. Try a clearer photo.'
            }, {
                status: 400
            });
        }

        return NextResponse.json({
            error: `PlantNet failed with HTTP ${response.status}.`
        }, {
            status: 502
        });
    }

    const data = (await response.json()) as { results?: PlantNetResult[]; };
    const results: IdentifyResult[] = (data.results ?? []).map((r) => {
        const species = r.scientificNameWithoutAuthor ?? 'Unknown species';
        const commonName = r.commonNames?.at(0) ?? '';

        return {
            species,
            commonName,
            confidence: r.score ?? 0,
            defaultCare: defaultCareFor(species, commonName)
        };
    });

    return NextResponse.json(results);
};
