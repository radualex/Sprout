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

const AppError: React.FunctionComponent<Pick<Props, 'reset'>> = ({ reset }) => {
    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
                This screen hit an unexpected error. Try again to reload it.
            </p>
            <Button onClick={handleReset}>
                Try again
            </Button>
        </div>
    );
};

export default AppError;
