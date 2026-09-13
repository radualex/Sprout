export interface PeriodicSyncOptions {
    minInterval: number;
}

export interface PeriodicSyncManager {
    register: (tag: string, options: PeriodicSyncOptions) => Promise<void>;
}

export interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
    periodicSync?: PeriodicSyncManager;
}

export interface CareCheckMessage {
    type?: string;
}
