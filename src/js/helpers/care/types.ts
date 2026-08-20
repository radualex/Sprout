import type { LucideIcon } from 'lucide-react';

// Types
import type { CareKind, Plant } from '@/js/types';

export interface CareTask {
    plant: Plant;
    kind: CareKind;
    dueAt: number;
    /** Days relative to today: negative = overdue. */
    daysUntil: number;
}

export interface CareMeta {
    label: string;
    verb: string;
    icon: LucideIcon;
}
