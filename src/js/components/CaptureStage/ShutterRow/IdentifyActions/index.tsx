'use client';

import classNames from 'classnames';
import React from 'react';
import { Search } from 'lucide-react';

// Styles
import shared from '@/js/scss/shared.module.scss';
import styles from './styles.module.scss';

interface Props {
    isIdentifying: boolean;
    onReset: () => void;
    onIdentify: () => void;
}

export const IdentifyActions: React.FunctionComponent<Props> = ({ isIdentifying, onReset, onIdentify }) => {
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);

    return (
        <React.Fragment>
            <button type="button" className={secondaryButtonClasses} onClick={onReset} disabled={isIdentifying}>
                Retake
            </button>
            <button type="button" className={shared.btn} onClick={onIdentify} disabled={isIdentifying}>
                {isIdentifying ? <span className={styles.spinner} /> : (
                    <React.Fragment>
                        <Search size={16} />
                        Identify
                    </React.Fragment>
                )}
            </button>
        </React.Fragment>
    );
};
