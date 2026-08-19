'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Camera, Check, Info, Lightbulb, User } from 'lucide-react';

// Constants
import { IPHONE_HINT_STYLE, NO_MARGIN_STYLE } from './constants';

// Services
import { getPlantNetKey, setPlantNetKey } from '@/js/services/identify';
import { checkAndNotify, isNotificationsSupported, requestNotificationPermission } from '@/js/services/notifications';

// Auth
import { authClient } from '@/js/lib/auth/auth-client';

// Styles
import shared from '@/js/scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
    user: {
        name: string;
        email: string;
    };
}

const handleTestNotification = async (): Promise<void> => {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('Sprout is ready', {
        body: 'You\'ll get a reminder here when a plant needs watering, fertilising or repotting.',
        icon: '/icon-192.png'
    });
};

export const SettingsScreen: React.FunctionComponent<Props> = ({ plants, user, className, ...props }) => {
    const classes = classNames(shared.screen, className);
    const warnNoticeClasses = classNames(shared.notice, shared.warn);
    const blockButtonClasses = classNames(shared.btn, shared.block);
    const secondaryBlockButtonClasses = classNames(shared.btn, shared.secondary, shared.block);

    const router = useRouter();
    const [perm, setPerm] = useState<NotificationPermission>(() => {
        return isNotificationsSupported() ? Notification.permission : 'denied';
    });
    const [key, setKey] = useState(() => {
        return getPlantNetKey();
    });
    const [isKeySaved, setIsKeySaved] = useState(false);

    const handleSignOut = useCallback(async () => {
        await authClient.signOut();

        router.push('/login');
        router.refresh();
    }, [router]);

    const handleEnableNotifications = useCallback(async () => {
        const p = await requestNotificationPermission();

        setPerm(p);

        if (p === 'granted') {
            await checkAndNotify();
        }
    }, []);

    const handleKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setKey(event.target.value);
        setIsKeySaved(false);
    }, []);

    const handleSaveKey = useCallback(() => {
        setPlantNetKey(key);
        setIsKeySaved(true);
    }, [key]);

    const renderNotificationStatus = () => {
        if (!isNotificationsSupported()) {
            return (
                <div className={warnNoticeClasses}>
                    Notifications aren't supported in this browser.
                </div>
            );
        }

        // TODO: More render helpers splitting here.
        if (perm === 'granted') {
            return (
                <React.Fragment>
                    <div className={shared.notice}>
                        <Check size={16} />
                        Notifications are enabled.
                    </div>
                    <button type="button" className={secondaryBlockButtonClasses} onClick={handleTestNotification}>
                        Send a test notification
                    </button>
                </React.Fragment>
            );
        }

        if (perm === 'denied' && Notification.permission === 'denied') {
            return (
                <div className={warnNoticeClasses}>
                    Notifications are blocked. Enable them for this site in your browser settings.
                </div>
            );
        }

        return (
            <button type="button" className={blockButtonClasses} onClick={handleEnableNotifications}>
                Enable notifications
            </button>
        );
    };

    // TODO: This needs some splitting. It's too large
    return (
        <div className={classes} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>
                        Settings
                    </h1>
                    <div className={shared.sub}>
                        Notifications, recognition & data
                    </div>
                </div>
            </header>

            <div className={styles.settingsCard}>
                <h3>
                    <User size={18} />
                    Account
                </h3>
                <p style={NO_MARGIN_STYLE}>
                    <span>
                        {`Signed in as `}
                    </span>
                    <strong>
                        {user.name}
                    </strong>
                    <span>
                        {` · `}
                    </span>
                    <span>
                        {user.email}
                    </span>
                </p>
                <button type="button" className={secondaryBlockButtonClasses} onClick={handleSignOut}>
                    Sign out
                </button>
            </div>

            <div className={styles.settingsCard}>
                <h3>
                    <Bell size={18} />
                    Care reminders
                </h3>
                <p>
                    Get a notification when a plant is due for watering, fertilising or repotting. Checks run
                    when the app is open or in the background (installed app on Android/Chrome).
                </p>
                {renderNotificationStatus()}
                <p style={IPHONE_HINT_STYLE}>
                    <Lightbulb size={16} />
                    On iPhone, open this app in Safari, tap Share →
                    <strong>
                        Add to Home Screen
                    </strong>
                    , then enable notifications from the installed app (iOS 16.4+).
                </p>
            </div>

            <div className={styles.settingsCard}>
                <h3>
                    <Camera size={18} />
                    Plant recognition
                </h3>
                <p>
                    Identification uses the free
                    <a href="https://my.plantnet.org" target="_blank" rel="noreferrer">
                        PlantNet API
                    </a>
                    . Create an account, copy your API key, and paste it here to enable recognition.
                </p>
                <div className={shared.field}>
                    <label htmlFor="settings-plantnet-key">
                        PlantNet API key
                    </label>
                    <input id="settings-plantnet-key" value={key} onChange={handleKeyChange} placeholder="2b10…" autoCapitalize="off" autoCorrect="off" />
                </div>
                <button type="button" className={secondaryBlockButtonClasses} onClick={handleSaveKey}>
                    {isKeySaved ? (
                        <React.Fragment>
                            <Check size={14} />
                            Saved
                        </React.Fragment>
                    ) : 'Save key'}
                </button>
            </div>

            <div className={styles.settingsCard}>
                <h3>
                    <Info size={18} />
                    About
                </h3>
                <p style={NO_MARGIN_STYLE}>
                    {`Sprout v0.1 — ${plants.length} plant${plants.length === 1 ? '' : 's'} tracked. Your plants are synced to your account and available on any device. Install via your browser's "Add to Home Screen" for the full app experience.`}
                </p>
            </div>
        </div>
    );
};
