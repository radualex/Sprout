// Types
import type { CareKind, Plant } from '../../types';

export interface CareTask {
    plant: Plant;
    kind: CareKind;
    dueAt: number;
    /** Days relative to today: negative = overdue. */
    daysUntil: number;
}
