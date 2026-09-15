'use client';

import { useEffect } from 'react';

// Services
import { startCareWatcher } from '@/services/notifications';

export interface Props {
    children: React.ReactNode;
}

const SiteCore: React.FunctionComponent<Props> = ({ children }) => {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
            void navigator.serviceWorker.register('/sw.js');
        }

        return startCareWatcher();
    }, []);

    return children;
};

export default SiteCore;
