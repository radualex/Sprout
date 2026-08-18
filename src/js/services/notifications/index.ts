// Helpers
import { CARE_META, DAY_MS, dueTasks } from '@/js/helpers/care';

// Database
import { recordNotified } from '@/js/lib/db/actions';

// Types
import type { Plant } from '@/js/types';

interface PeriodicSyncManager {
    register: (tag: string, options: { minInterval: number; }) => Promise<void>;
}

interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
    periodicSync?: PeriodicSyncManager;
}

interface CareCheckMessage {
    type?: string;
}

const fetchPlants = async (): Promise<Plant[]> => {
    try {
        const response = await fetch('/api/plants', {
            cache: 'no-store'
        });

        if (!response.ok) {
            return [];
        }

        return (await response.json()) as Plant[];
    } catch {
        return [];
    }
};

const registerPeriodicSync = async () => {
    try {
        const reg = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithPeriodicSync;
        // Only available on installed PWAs in Chromium; fails silently elsewhere.
        await reg.periodicSync?.register('sprout-care-check', {
            minInterval: 12 * 60 * 60 * 1000
        });
    } catch {
        /* periodic sync unavailable — in-app checks still run */
    }
};

export const isNotificationsSupported = (): boolean => {
    return 'Notification' in globalThis && 'serviceWorker' in navigator;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!isNotificationsSupported()) {
        return 'denied';
    }

    const perm = await Notification.requestPermission();

    if (perm === 'granted') {
        await registerPeriodicSync();
    }

    return perm;
};

/**
 * Check all plants for due care and show one notification per due task,
 * at most once per day per task.
 */
export const checkAndNotify = async (): Promise<number> => {
    if (!isNotificationsSupported() || Notification.permission !== 'granted') {
        return 0;
    }

    const [reg, plants] = await Promise.all([navigator.serviceWorker.ready, fetchPlants()]);
    const now = Date.now();

    const pendingTasks = dueTasks(plants, now).filter((task) => {
        const last = task.plant.lastNotified[task.kind] ?? 0;

        return now - last >= DAY_MS;
    });

    await Promise.all(pendingTasks.map(async (task) => {
        const meta = CARE_META[task.kind];
        const name = task.plant.nickname || task.plant.commonName || task.plant.species;

        await reg.showNotification(`Time to ${meta.label.toLowerCase()} ${name}`, {
            body:
                task.daysUntil < 0
                    ? `${name} is ${-task.daysUntil} day${task.daysUntil === -1 ? '' : 's'} overdue for ${meta.label.toLowerCase()}ing.`
                    : `${name} is due for ${meta.label.toLowerCase()}ing today.`,
            tag: `sprout-${task.plant.id}-${task.kind}`,
            icon: '/icon-192.png',
            badge: '/icon-192.png'
        });
        await recordNotified(task.plant.id, task.kind, now);
    }));

    return pendingTasks.length;
};

/** Run care checks: on load, when the tab regains focus, and hourly while open. */
export const startCareWatcher = async () => {
    await checkAndNotify();
    window.addEventListener('focus', () => {
        return checkAndNotify();
    });

    setInterval(() => {
        return checkAndNotify();
    }, 60 * 60 * 1000);

    navigator.serviceWorker.addEventListener('message', async (event: MessageEvent<CareCheckMessage>) => {
        if (event.data.type === 'care-check') {
            await checkAndNotify();
        }
    });
};
