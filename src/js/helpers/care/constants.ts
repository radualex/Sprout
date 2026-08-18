import { Droplets, Flower2, Leaf, type LucideIcon } from 'lucide-react';

// Types
import { CareKind } from '@/js/types';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const CARE_META: Record<CareKind, { label: string; verb: string; icon: LucideIcon; }> = {
    [CareKind.Water]: { label: 'Water',
        verb: 'watered',
        icon: Droplets },
    [CareKind.Fertilize]: { label: 'Fertilise',
        verb: 'fertilised',
        icon: Leaf },
    [CareKind.Repot]: { label: 'Repot',
        verb: 'repotted',
        icon: Flower2 }
};
