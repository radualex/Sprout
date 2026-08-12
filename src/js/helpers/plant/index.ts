// Types
import type { Plant } from '../../types';

export function displayName(plant: Plant): string {
    return plant.nickname || plant.commonName || plant.species;
}
