'use client';

import React from 'react';
import { Search } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Styles
import styles from './styles.module.scss';

interface Props {
    isIdentifying: boolean;
    onReset: () => void;
    onIdentify: () => void;
}

export const IdentifyActions: React.FunctionComponent<Props> = ({ isIdentifying, onReset, onIdentify }) => {
    return (
        <React.Fragment>
            <Button variant={ButtonVariant.Secondary} grow onClick={onReset} disabled={isIdentifying}>
                Retake
            </Button>
            <Button grow onClick={onIdentify} disabled={isIdentifying}>
                {isIdentifying ? <span className={styles.spinner} /> : (
                    <React.Fragment>
                        <Search size={16} />
                        Identify
                    </React.Fragment>
                )}
            </Button>
        </React.Fragment>
    );
};
