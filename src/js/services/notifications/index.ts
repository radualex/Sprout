// Helpers
import { CARE_META, DAY_MS, dueTasks } from '../../helpers/care';

// Services
import { getAllPlants, savePlant } from '../db';

export function isNotificationsSupported(): boolean {
    return 'Notification' in globalThis && 'serviceWorker' in navigator;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!isNotificationsSupported()) return 'denied';
    const perm = await Notification.requestPermission();
    if (perm === 'granted') await registerPeriodicSync();
    return perm;
}

async function registerPeriodicSync() {
    try {
        const reg = await navigator.serviceWorker.ready;
        // Only available on installed PWAs in Chromium; fails silently elsewhere.
        await (reg as any).periodicSync?.register('sprout-care-check', {
            minInterval: 12 * 60 * 60 * 1000
        });
    } catch {
    /* periodic sync unavailable — in-app checks still run */
    }
}

/**
 * Check all plants for due care and show one notification per due task,
 * at most once per day per task.
 */
export async function checkAndNotify(): Promise<number> {
    if (!isNotificationsSupported() || Notification.permission !== 'granted') return 0;
    const [reg, plants] = await Promise.all([navigator.serviceWorker.ready, getAllPlants()]);
    const now = Date.now();

    const pendingTasks = dueTasks(plants, now).filter((task) => {
        const last = task.plant.lastNotified[task.kind] ?? 0;
        return now - last >= DAY_MS;
    });

    await Promise.all(pendingTasks.map(async (task) => {
        const meta = CARE_META[task.kind];
        const name = task.plant.nickname || task.plant.commonName || task.plant.species;
        await reg.showNotification(`${meta.emoji} Time to ${meta.label.toLowerCase()} ${name}`, {
            body:
        task.daysUntil < 0
            ? `${name} is ${-task.daysUntil} day${task.daysUntil === -1 ? '' : 's'} overdue for ${meta.label.toLowerCase()}ing.`
            : `${name} is due for ${meta.label.toLowerCase()}ing today.`,
            tag: `sprout-${task.plant.id}-${task.kind}`,
            icon: '/icon-192.png',
            badge: '/icon-192.png'
        });
        task.plant.lastNotified[task.kind] = now;
        await savePlant(task.plant);
    }));

    return pendingTasks.length;
}

/** Run care checks: on load, when the tab regains focus, and hourly while open. */
export async function startCareWatcher() {
    await checkAndNotify();
    window.addEventListener('focus', () => {
        return checkAndNotify();
    });

    setInterval(() => {
        return checkAndNotify();
    }, 60 * 60 * 1000);

    navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data?.type === 'care-check') {
            await checkAndNotify();
        };
    });
}
