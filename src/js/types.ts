export type CareKind = 'water' | 'fertilize' | 'repot';

export interface CareSchedule {
    /** Interval in days between waterings. */
    waterEveryDays: number;
    /** Interval in days between fertilizing. 0 = never. */
    fertilizeEveryDays: number;
    /** Interval in months between repotting. 0 = never. */
    repotEveryMonths: number;
}

export interface Plant {
    id: string;
    /** User-given nickname, e.g. "Kitchen monstera". */
    nickname: string;
    /** Scientific name, e.g. "Monstera deliciosa". */
    species: string;
    commonName: string;
    /** Photo stored as a Blob in IndexedDB alongside the record. */
    photo?: Blob;
    acquiredAt: number;
    care: CareSchedule;
    lastCare: Record<CareKind, number>;
    /** Last time we showed a notification per care kind, to avoid repeats. */
    lastNotified: Partial<Record<CareKind, number>>;
    notes: string;
}
