// Constants
import { API_KEY_STORAGE } from './constants';

// Types
import type { IdentifyResult } from './types';

export function getPlantNetKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setPlantNetKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_KEY_STORAGE, key);
}

export async function identifyPlant(photo: Blob): Promise<IdentifyResult[]> {
    const form = new FormData();
    form.append('images', photo, 'plant.jpg');

    const userKey = getPlantNetKey();
    if (userKey) {
        form.append('apiKey', userKey);
    }

    const response = await fetch('/api/identify', {
        method: 'POST',
        body: form
    });

    if (!response.ok) {
        let error: { error?: string; } | undefined;
        try {
            error = (await response.json()) as { error?: string; };
        } catch {
            // response body was not JSON
        }
        throw new Error(error?.error ?? `Identification failed (HTTP ${response.status}).`);
    }

    return (await response.json()) as IdentifyResult[];
}

export { type IdentifyResult } from './types';
