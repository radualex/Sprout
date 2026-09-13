'use client';

import React, { useCallback } from 'react';

// Styles
import './globals.css';
import styles from './global-error.module.css';

export interface Props {
    error: Error & { digest?: string; };
    reset: () => void;
    retry: () => void;
}

const GlobalError: React.FunctionComponent<Pick<Props, 'retry'>> = ({ retry }) => {
    const handleRetry = useCallback(() => {
        retry();
    }, [retry]);

    return (
        <html lang="en">
            <body>
                <main className={styles.root}>
                    <h1 className={styles.title}>Something went wrong</h1>
                    <p className={styles.message}>
                        Sprout hit an unexpected error while loading. Try again to reload the app.
                    </p>
                    <button type="button" className={styles.retry} onClick={handleRetry}>
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
};

export default GlobalError;
