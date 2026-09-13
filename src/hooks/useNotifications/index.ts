import { useCallback, useEffect, useState } from 'react';

// Services
import { isNotificationsSupported, requestNotificationPermission } from '@/services/notifications';

export interface NotificationsState {
    isSupported: boolean | undefined;
    permission: NotificationPermission;
    requestPermission: () => Promise<NotificationPermission>;
}

export const useNotifications = (): NotificationsState => {
    const [isSupported, setIsSupported] = useState<boolean | undefined>(undefined);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        const canNotify = isNotificationsSupported();

        setIsSupported(canNotify);
        setPermission(canNotify ? Notification.permission : 'denied');
    }, []);

    const requestPermission = useCallback(async () => {
        const next = await requestNotificationPermission();

        setPermission(next);

        return next;
    }, []);

    return {
        isSupported,
        permission,
        requestPermission
    };
};
