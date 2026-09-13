'use client';

import React from 'react';
import { Search } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';

// Styles
import styles from './styles.module.css';

export interface Props {
    isIdentifying: boolean;
    onReset: () => void;
    onIdentify: () => void;
}

const IdentifyActions: React.FunctionComponent<Props> = ({ isIdentifying, onReset, onIdentify }) => {
    return (
        <React.Fragment>
            <Button variant={ButtonVariant.Secondary} grow onClick={onReset} disabled={isIdentifying}>
                Retake
            </Button>
            <Button grow onClick={onIdentify} disabled={isIdentifying} aria-label="Identify plant" aria-busy={isIdentifying}>
                {isIdentifying ? (
                    <React.Fragment>
                        <span className={styles.spinner} aria-hidden />
                        <span className={styles.srOnly}>Identifying…</span>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Search size="1rem" aria-hidden />
                        Identify
                    </React.Fragment>
                )}
            </Button>
        </React.Fragment>
    );
};

export default IdentifyActions;
