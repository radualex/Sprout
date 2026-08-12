import { useState } from 'react';

// Constants
import { SAMPLE_PLANTS } from './constants';

// Helpers
import { DAY_MS, defaultCareFor } from '../../helpers/care';

// Services
import { newId, savePlant } from '../../services/db';
import { getPlantNetKey, setPlantNetKey } from '../../services/identify';
import { checkAndNotify, isNotificationsSupported, requestNotificationPermission } from '../../services/notifications';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '../../types';

interface Props {
    plants: Plant[];
    onSeeded: () => void;
}

async function testNotification() {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('🌱 Sprout is ready', {
        body: 'You\'ll get a reminder here when a plant needs watering, fertilising or repotting.',
        icon: '/icon-192.png'
    });
}

export function SettingsScreen({ plants, onSeeded }: Props) {
    const [perm, setPerm] = useState<NotificationPermission>(() => {
        return isNotificationsSupported() ? Notification.permission : 'denied';
    });
    const [key, setKey] = useState(() => {
        return getPlantNetKey();
    });
    const [isKeySaved, setIsKeySaved] = useState(false);
    const [isSeeded, setIsSeeded] = useState(false);

    function renderNotificationStatus() {
        if (!isNotificationsSupported()) {
            return (
                <div className={`${shared.notice} ${shared.warn}`}>Notifications aren't supported in this browser.</div>
            );
        }
        if (perm === 'granted') {
            return (
                <>
                    <div className={shared.notice}>✓ Notifications are enabled.</div>
                    <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={testNotification}>
                        Send a test notification
                    </button>
                </>
            );
        }
        if (perm === 'denied' && Notification.permission === 'denied') {
            return (
                <div className={`${shared.notice} ${shared.warn}`}>
                    Notifications are blocked. Enable them for this site in your browser settings.
                </div>
            );
        }
        return (
            <button type="button" className={`${shared.btn} ${shared.block}`} onClick={enableNotifications}>
                Enable notifications
            </button>
        );
    }

    async function enableNotifications() {
        const p = await requestNotificationPermission();
        setPerm(p);
        if (p === 'granted') await checkAndNotify();
    }

    async function seedSampleData() {
        const now = Date.now();
        const plants = SAMPLE_PLANTS.map(([nickname, species, commonName, daysAgo]) => {
            return {
                id: newId(),
                nickname,
                species,
                commonName,
                acquiredAt: now - 90 * DAY_MS,
                care: defaultCareFor(species, commonName),
                lastCare: {
                    water: now - daysAgo * DAY_MS,
                    fertilize: now - 20 * DAY_MS,
                    repot: now - 200 * DAY_MS
                },
                lastNotified: {},
                notes: ''
            };
        });
        await Promise.all(plants.map((plant) => {
            return savePlant(plant);
        }));
        setIsSeeded(true);
        onSeeded();
    }

    return (
        <div className={shared.screen}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Settings</h1>
                    <div className={shared.sub}>Notifications, recognition & data</div>
                </div>
            </header>

            <div className={styles.settingsCard}>
                <h3>🔔 Care reminders</h3>
                <p>
                    Get a notification when a plant is due for watering, fertilising or repotting. Checks run
                    when the app is open or in the background (installed app on Android/Chrome).
                </p>
                {renderNotificationStatus()}
                <p style={{ marginTop: 12,
                    marginBottom: 0 }}
                >
                    💡 On iPhone, open this app in Safari, tap Share → <strong>Add to Home Screen</strong>,
                    then enable notifications from the installed app (iOS 16.4+).
                </p>
            </div>

            <div className={styles.settingsCard}>
                <h3>📷 Plant recognition</h3>
                <p>
                    Identification uses the free{' '}
                    <a href="https://my.plantnet.org" target="_blank" rel="noreferrer">
                        PlantNet API
                    </a>
                    . Create an account, copy your API key, and paste it here. Without a key the app runs in
                    demo mode with sample matches.
                </p>
                <div className={shared.field}>
                    <label htmlFor="settings-plantnet-key">PlantNet API key</label>
                    <input
                        id="settings-plantnet-key"
                        value={key}
                        onChange={(event_) => {
                            setKey(event_.target.value);
                            setIsKeySaved(false);
                        }}
                        placeholder="2b10…"
                        autoCapitalize="off"
                        autoCorrect="off"
                    />
                </div>
                <button
                    type="button"
                    className={`${shared.btn} ${shared.secondary} ${shared.block}`}
                    onClick={() => {
                        setPlantNetKey(key);
                        setIsKeySaved(true);
                    }}
                >
                    {isKeySaved ? '✓ Saved' : 'Save key'}
                </button>
            </div>

            <div className={styles.settingsCard}>
                <h3>🧪 Sample data</h3>
                <p>Add three example plants with realistic care schedules to explore the app.</p>
                <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={seedSampleData} disabled={isSeeded}>
                    {isSeeded ? '✓ Sample plants added' : 'Add sample plants'}
                </button>
            </div>

            <div className={styles.settingsCard}>
                <h3>ℹ️ About</h3>
                <p style={{ marginBottom: 0 }}>
                    Sprout v0.1 — {plants.length} plant{plants.length === 1 ? '' : 's'} tracked. All data
                    stays on this device (IndexedDB). Install via your browser's "Add to Home Screen" for the
                    full app experience.
                </p>
            </div>
        </div>
    );
}
