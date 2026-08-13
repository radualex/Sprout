// Constants
import { API_KEY_STORAGE } from './constants';

// Types
import type { IdentifyResult } from './types';

export type { IdentifyResult } from './types';

interface PlantNetSpecies {
    scientificNameWithoutAuthor?: string;
    commonNames?: string[];
}

interface PlantNetMatch {
    species?: PlantNetSpecies;
    score?: number;
}

interface PlantNetResponse {
    results?: PlantNetMatch[];
}

export function getPlantNetKey(): string {
    return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setPlantNetKey(key: string) {
    if (key) localStorage.setItem(API_KEY_STORAGE, key.trim());
    else localStorage.removeItem(API_KEY_STORAGE);
}

/**
 * Identify a plant photo via the PlantNet API. Requires an API key configured
 * in Settings (free at https://my.plantnet.org).
 */
export async function identifyPlant(photo: Blob): Promise<IdentifyResult[]> {
    const key = getPlantNetKey();
    if (!key) throw new Error('Add a PlantNet API key in Settings to identify plants.');

    const form = new FormData();
    form.append('images', photo, 'plant.jpg');
    form.append('organs', 'auto');

    const response = await fetch(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(key)}&nb-results=5`,
        {
            method: 'POST',
            body: form
        }
    );

    if (!response.ok) {
        if (response.status === 401) throw new Error('PlantNet rejected the API key — check it in Settings.');
        if (response.status === 404) throw new Error('PlantNet couldn\'t recognise a plant in this photo. Try a closer shot of a leaf or flower.');
        throw new Error(`PlantNet error (HTTP ${response.status}). Try again.`);
    }

    const data = await response.json() as PlantNetResponse;
    const results: IdentifyResult[] = (data.results ?? []).slice(0, 5).map((match) => {
        return {
            species: match.species?.scientificNameWithoutAuthor ?? 'Unknown species',
            commonName: match.species?.commonNames?.at(0) ?? '',
            confidence: match.score ?? 0
        };
    });

    if (results.length === 0) {
        throw new Error('No matches found. Try a clearer photo of a single leaf or flower.');
    }

    return results;
}
