'use client';

import classNames from 'classnames';
import React, { useCallback } from 'react';

// Services
import type { IdentifyResult } from '../../services/identify';

// Styles
import shared from '../../scss/shared.module.scss';

interface Props extends Omit<React.ComponentProps<'button'>, 'onClick' | 'onSelect'> {
    result: IdentifyResult;
    selected: boolean;
    onSelect: (result: IdentifyResult) => void;
}

export const IdentifyResultCard: React.FunctionComponent<Props> = ({ result, selected, onSelect, ...props }) => {
    const classes = classNames(shared.resultCard, {
        [shared.selected]: selected
    });

    const handleSelect = useCallback(() => {
        onSelect(result);
    }, [onSelect, result]);

    return (
        <button type="button" className={classes} onClick={handleSelect} {...props}>
            <div>
                <div className={shared.common}>{result.commonName || result.species}</div>
                <div className={shared.sci}>{result.species}</div>
            </div>
            <div className={shared.conf}>{Math.round(result.confidence * 100)}%</div>
        </button>
    );
};
