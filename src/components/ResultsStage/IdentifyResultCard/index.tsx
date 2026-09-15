'use client';

import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';

// Services
import type { IdentifyResult } from '@/services/identify';

// Styles
import styles from './styles.module.css';

export interface Props extends Omit<React.ComponentProps<'button'>, 'onClick' | 'onSelect'> {
    result: IdentifyResult;
    selected: boolean;
    onSelect: (result: IdentifyResult) => void;
}

const IdentifyResultCard: React.FunctionComponent<Props> = ({ result, selected, onSelect, ...props }) => {
    const classes = classNames(styles.resultCard, {
        [styles.selected]: selected
    });

    const confidence = useMemo(() => {
        return Math.round(result.confidence * 100);
    }, [result.confidence]);

    const handleSelect = useCallback(() => {
        onSelect(result);
    }, [onSelect, result]);

    return (
        <Button variant={ButtonVariant.Bare} className={styles.select} onClick={handleSelect} {...props}>
            <span className={classes}>
                <span>
                    <span className={styles.common}>
                        {result.commonName || result.species}
                    </span>
                    <span className={styles.sci}>
                        {result.species}
                    </span>
                </span>
                <span className={styles.conf}>
                    <span>{confidence}%</span>
                </span>
            </span>
        </Button>
    );
};

export default IdentifyResultCard;
