'use client';

import React, { useCallback } from 'react';

// Components
import Button from '@/design-system/Button';

// Styles
import styles from './error.module.css';

export interface Props {
    error: Error & { digest?: string; };
    reset: () => void;
}

const RootError: React.FunctionComponent<Pick<Props, 'reset'>> = ({ reset }) => {
    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <main className={styles.root}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
                An unexpected error interrupted this screen. Try again to reload it.
            </p>
            <Button onClick={handleReset}>
                Try again
            </Button>
        </main>
    );
};

export default RootError;
