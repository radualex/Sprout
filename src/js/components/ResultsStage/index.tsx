'use client';

import classNames from 'classnames';
import React from 'react';
import { ArrowRight } from 'lucide-react';

// Components
import { IdentifyResultCard } from './IdentifyResultCard';

// Services
import type { IdentifyResult } from '@/js/services/identify';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props {
    results: IdentifyResult[];
    picked: IdentifyResult | undefined;
    onPick: (result: IdentifyResult) => void;
    onReset: () => void;
    onContinue: () => void;
}

export const ResultsStage: React.FunctionComponent<Props> = ({ results, picked, onPick, onReset, onContinue }) => {
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);

    return (
        <React.Fragment>
            <div className={shared.sectionTitle}>
                Best matches
            </div>
            {results.map((result) => {
                return (
                    <IdentifyResultCard key={result.species} result={result} selected={picked?.species === result.species} onSelect={onPick} />
                );
            })}
            <div className={shared.shutterRow}>
                <button type="button" className={secondaryButtonClasses} onClick={onReset}>
                    Retake
                </button>
                <button type="button" className={shared.btn} disabled={!picked} onClick={onContinue}>
                    Continue
                    <ArrowRight size={16} />
                </button>
            </div>
        </React.Fragment>
    );
};
