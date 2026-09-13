'use client';

import React, { useCallback } from 'react';

// Styles
import styles from './error.module.css';

export interface Props {
    error: Error & { digest?: string; };
    reset: () => void;
    retry: () => void;
}

const AppError: React.FunctionComponent<Pick<Props, 'retry'>> = ({ retry }) => {
    const handleRetry = useCallback(() => {
        retry();
    }, [retry]);

    return (
        <main className={styles.root}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
                This screen hit an unexpected error. Try again to reload it.
            </p>
            <button type="button" className={styles.retry} onClick={handleRetry}>
                Try again
            </button>
        </main>
    );
};

export default AppError;
