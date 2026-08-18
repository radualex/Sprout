// Types
import type { Plant } from '@/js/types';

export const displayName = (plant: Plant): string => {
    return plant.nickname || plant.commonName || plant.species;
};
