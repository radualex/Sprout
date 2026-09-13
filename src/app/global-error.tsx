'use client';

import React, { useCallback } from 'react';

// Components
import Button from '@/design-system/Button';

// Styles
import './globals.css';
import styles from './global-error.module.css';

export interface Props {
    error: Error & { digest?: string; };
    reset: () => void;
}

const GlobalError: React.FunctionComponent<Pick<Props, 'reset'>> = ({ reset }) => {
    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <html lang="en">
            <body>
                <main className={styles.root}>
                    <h1 className={styles.title}>Something went wrong</h1>
                    <p className={styles.message}>
                        Sprout hit an unexpected error while loading. Try again to reload the app.
                    </p>
                    <Button onClick={handleReset}>
                        Try again
                    </Button>
                </main>
            </body>
        </html>
    );
};

export default GlobalError;
