// Constants
import { API_KEY_STORAGE, DEMO_POOL } from './constants';

// Types
import type { IdentifyResult } from './types';

export type { IdentifyResult } from './types';

export function getPlantNetKey(): string {
    return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setPlantNetKey(key: string) {
    if (key) localStorage.setItem(API_KEY_STORAGE, key.trim());
    else localStorage.removeItem(API_KEY_STORAGE);
}

/**
 * Identify a plant photo. Uses the PlantNet API when a key is configured
 * (free at https://my.plantnet.org), otherwise returns demo suggestions so
 * the flow is usable without setup.
 */
export async function identifyPlant(photo: Blob): Promise<IdentifyResult[]> {
    const key = getPlantNetKey();
    if (!key) return demoResults();

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

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: IdentifyResult[] = (data.results ?? []).slice(0, 5).map((r: any) => {
        return {
            species: r.species?.scientificNameWithoutAuthor ?? 'Unknown species',
            commonName: r.species?.commonNames?.at(0) ?? '',
            confidence: r.score ?? 0,
            source: 'plantnet' as const
        };
    });

    if (results.length === 0) {
        throw new Error('No matches found. Try a clearer photo of a single leaf or flower.');
    }

    return results;
}

function demoResults(): Promise<IdentifyResult[]> {
    const picks = [...DEMO_POOL].toSorted(() => {
        return Math.random() - 0.5;
    }).slice(0, 3);
    const results = picks.map(([species, commonName], i) => {
        return {
            species,
            commonName,
            confidence: [0.86, 0.41, 0.18][i],
            source: 'demo' as const
        };
    });

    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve(results);
        }, 900);
    });
}
