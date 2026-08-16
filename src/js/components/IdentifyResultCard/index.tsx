'use client';

import React, { useCallback } from 'react';

// Services
import type { IdentifyResult } from '../../services/identify';

// Styles
import shared from '../../scss/shared.module.scss';

interface Props {
    result: IdentifyResult;
    selected: boolean;
    onSelect: (result: IdentifyResult) => void;
}

export const IdentifyResultCard: React.FunctionComponent<Props> = ({ result, selected, onSelect }) => {
    const handleSelect = useCallback(() => {
        onSelect(result);
    }, [onSelect, result]);

    return (
        <button type="button" className={`${shared.resultCard} ${selected ? shared.selected : ''}`} onClick={handleSelect}>
            <div>
                <div className={shared.common}>{result.commonName || result.species}</div>
                <div className={shared.sci}>{result.species}</div>
            </div>
            <div className={shared.conf}>{Math.round(result.confidence * 100)}%</div>
        </button>
    );
};
