'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { AboutCard } from './AboutCard';
import { AccountCard } from './AccountCard';
import { RecognitionCard } from './RecognitionCard';
import { RemindersCard } from './RemindersCard';

// Services
import { getPlantNetKey, setPlantNetKey } from '@/js/services/identify';
import { checkAndNotify, isNotificationsSupported, requestNotificationPermission } from '@/js/services/notifications';

// Auth
import { authClient } from '@/js/lib/auth/auth-client';

// Styles
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
    const classes = classNames(styles.screen, className);

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
        const permission = await requestNotificationPermission();

        setPerm(permission);

        if (permission === 'granted') {
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

    const renderAccountCard = () => {
        return (
            <AccountCard user={user} onSignOut={handleSignOut} />
        );
    };

    const renderRemindersCard = () => {
        return (
            <RemindersCard perm={perm} onEnable={handleEnableNotifications} onTest={handleTestNotification} />
        );
    };

    const renderRecognitionCard = () => {
        return (
            <RecognitionCard apiKey={key} isKeySaved={isKeySaved} onKeyChange={handleKeyChange} onSaveKey={handleSaveKey} />
        );
    };

    const renderAboutCard = () => {
        return (
            <AboutCard plantCount={plants.length} />
        );
    };

    const renderContent = () => {
        return (
            <React.Fragment>
                {renderAccountCard()}
                {renderRemindersCard()}
                {renderRecognitionCard()}
                {renderAboutCard()}
            </React.Fragment>
        );
    };

    return (
        <div className={classes} {...props}>
            <header className={styles.appHeader}>
                <div>
                    <h1>
                        Settings
                    </h1>
                    <div className={styles.sub}>
                        Notifications, recognition & data
                    </div>
                </div>
            </header>

            {renderContent()}
        </div>
    );
};
