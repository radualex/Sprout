'use client';

import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';

// Services
import type { IdentifyResult } from '@/js/services/identify';

// Styles
import styles from './styles.module.scss';

interface Props extends Omit<React.ComponentProps<'button'>, 'onClick' | 'onSelect'> {
    result: IdentifyResult;
    selected: boolean;
    onSelect: (result: IdentifyResult) => void;
}

export const IdentifyResultCard: React.FunctionComponent<Props> = ({ result, selected, onSelect, ...props }) => {
    const classes = classNames({
        [styles.selected]: selected
    });

    const confidence = useMemo(() => {
        return Math.round(result.confidence * 100);
    }, [result.confidence]);

    const handleSelect = useCallback(() => {
        onSelect(result);
    }, [onSelect, result]);

    return (
        <button type="button" className={classes} onClick={handleSelect} {...props}>
            <div>
                <div className={styles.common}>
                    {result.commonName || result.species}
                </div>
                <div className={styles.sci}>
                    {result.species}
                </div>
            </div>
            <div className={styles.conf}>
                <span>{confidence}%</span>
            </div>
        </button>
    );
};
