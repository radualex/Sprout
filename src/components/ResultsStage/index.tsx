'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';
import IdentifyResultCard from './IdentifyResultCard';

// Services
import type { IdentifyResult } from '@/services/identify';

// Styles
import styles from './styles.module.scss';

export interface Props {
    results: IdentifyResult[];
    picked: IdentifyResult | undefined;
    onPick: (result: IdentifyResult) => void;
    onReset: () => void;
    onContinue: () => void;
}

const ResultsStage: React.FunctionComponent<Props> = ({ results, picked, onPick, onReset, onContinue }) => {
    return (
        <React.Fragment>
            <span className={styles.sectionTitle}>Best matches</span>
            {results.map((result) => {
                return (
                    <IdentifyResultCard key={result.species} result={result} selected={picked?.species === result.species} onSelect={onPick} />
                );
            })}
            <div className={styles.shutterRow}>
                <Button variant={ButtonVariant.Secondary} grow onClick={onReset}>
                    Retake
                </Button>
                <Button grow onClick={onContinue} disabled={!picked}>
                    Continue
                    <ArrowRight size={16} />
                </Button>
            </div>
        </React.Fragment>
    );
};

export default ResultsStage;
