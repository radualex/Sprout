'use client';

import { useEffect } from 'react';

// Services
import { startCareWatcher } from '@/js/services/notifications';

interface Props {
    children: React.ReactNode;
}

export const SiteCore: React.FunctionComponent<Props> = ({ children }) => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            void navigator.serviceWorker.register('/sw.js');
        }
        void startCareWatcher();
    }, []);

    return children;
};
