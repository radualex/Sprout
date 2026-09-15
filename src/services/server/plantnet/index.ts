// Constants
import { ERROR_BAD_KEY, ERROR_NO_IMAGE, ERROR_NO_KEY, ERROR_NOT_RECOGNISED, ERROR_UNREACHABLE, HTTP_BAD_GATEWAY, HTTP_BAD_REQUEST, PLANTNET_API_URL, PLANTNET_NB_RESULTS } from './constants';

// Helpers
import { FALLBACK_CARE } from '@/helpers/care';

// Services
import type { IdentifyResult } from '@/services/identify';

// Types
import type { PlantNetResponse } from './types';

export class PlantNetError extends Error {
    readonly httpStatus: 400 | 502;

    constructor(message: string, httpStatus: 400 | 502) {
        super(message);
        this.name = 'PlantNetError';
        this.httpStatus = httpStatus;
    }
}

export const identifySpecies = async (form: FormData): Promise<IdentifyResult[]> => {
    const image = form.get('images');
    if (!(image instanceof File)) {
        throw new PlantNetError(ERROR_NO_IMAGE, HTTP_BAD_REQUEST);
    }

    const apiKey = process.env.PLANTNET_API_KEY ?? '';
    if (!apiKey) {
        throw new PlantNetError(ERROR_NO_KEY, HTTP_BAD_REQUEST);
    }

    const body = new FormData();
    body.append('images', image, 'plant.jpg');
    body.append('organs', 'auto');

    let response: Response;
    try {
        response = await fetch(
            `${PLANTNET_API_URL}?api-key=${encodeURIComponent(apiKey)}&nb-results=${PLANTNET_NB_RESULTS}`,
            {
                method: 'POST',
                body
            }
        );
    } catch {
        // network-level failure (DNS, offline, connection reset)
        throw new PlantNetError(ERROR_UNREACHABLE, HTTP_BAD_GATEWAY);
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw new PlantNetError(ERROR_BAD_KEY, HTTP_BAD_REQUEST);
        }

        if (response.status === 404) {
            throw new PlantNetError(ERROR_NOT_RECOGNISED, HTTP_BAD_REQUEST);
        }

        throw new PlantNetError(`PlantNet failed with HTTP ${response.status}.`, HTTP_BAD_GATEWAY);
    }

    const data = (await response.json()) as PlantNetResponse;

    return (data.results ?? []).map((result) => {
        const species = result.species?.scientificNameWithoutAuthor ?? 'Unknown species';
        const commonName = result.species?.commonNames?.at(0) ?? '';

        return {
            species,
            commonName,
            confidence: result.score ?? 0,
            defaultCare: FALLBACK_CARE
        };
    });
};
