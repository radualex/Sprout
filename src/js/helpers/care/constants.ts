import { Droplets, Flower2, Leaf } from 'lucide-react';

// Types
import { CareKind } from '@/js/types';
import type { CareMeta } from './types';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const DAYS_PER_MONTH = 30;

export const CARE_META: Record<CareKind, CareMeta> = {
    [CareKind.Water]: {
        label: 'Water',
        verb: 'watered',
        icon: Droplets
    },
    [CareKind.Fertilize]: {
        label: 'Fertilise',
        verb: 'fertilised',
        icon: Leaf
    },
    [CareKind.Repot]: {
        label: 'Repot',
        verb: 'repotted',
        icon: Flower2
    }
};
