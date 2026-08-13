import React, { useState } from 'react';

// Services
import { getPlantNetKey, setPlantNetKey } from '../../services/identify';
import { checkAndNotify, isNotificationsSupported, requestNotificationPermission } from '../../services/notifications';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

async function testNotification() {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('🌱 Sprout is ready', {
        body: 'You\'ll get a reminder here when a plant needs watering, fertilising or repotting.',
        icon: '/icon-192.png'
    });
}

export const SettingsScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    const [perm, setPerm] = useState<NotificationPermission>(() => {
        return isNotificationsSupported() ? Notification.permission : 'denied';
    });
    const [key, setKey] = useState(() => {
        return getPlantNetKey();
    });
    const [isKeySaved, setIsKeySaved] = useState(false);

    function renderNotificationStatus() {
        if (!isNotificationsSupported()) {
            return (
                <div className={`${shared.notice} ${shared.warn}`}>Notifications aren't supported in this browser.</div>
            );
        }
        if (perm === 'granted') {
            return (
                <React.Fragment>
                    <div className={shared.notice}>✓ Notifications are enabled.</div>
                    <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={testNotification}>
                        Send a test notification
                    </button>
                </React.Fragment>
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

    function updateKey(event_: React.ChangeEvent<HTMLInputElement>) {
        setKey(event_.target.value);
        setIsKeySaved(false);
    }

    function saveKey() {
        setPlantNetKey(key);
        setIsKeySaved(true);
    }

    return (
        <div className={`${shared.screen} ${className ?? ''}`} {...props}>
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
                <p style={{ marginTop: 12, marginBottom: 0 }}>
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
                    . Create an account, copy your API key, and paste it here to enable recognition.
                </p>
                <div className={shared.field}>
                    <label htmlFor="settings-plantnet-key">PlantNet API key</label>
                    <input id="settings-plantnet-key" value={key} onChange={updateKey} placeholder="2b10…" autoCapitalize="off" autoCorrect="off" />
                </div>
                <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={saveKey}>
                    {isKeySaved ? '✓ Saved' : 'Save key'}
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
};
