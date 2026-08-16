// Types
import type { CareSchedule } from '../../types';

export interface IdentifyResult {
    species: string;
    commonName: string;
    confidence: number; // 0..1
    /** Recommended care schedule for this species, computed server-side. */
    defaultCare: CareSchedule;
}
