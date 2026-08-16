'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { AddPlantForm } from '../../components/AddPlantForm';
import { CaptureStage } from '../../components/CaptureStage';
import { ResultsStage } from '../../components/ResultsStage';

// Hooks
import { useObjectUrl } from '../../hooks';

// Services
import { identifyPlant, type IdentifyResult } from '../../services/identify';

// Database
import { createPlant } from '../../lib/db/actions';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { PlantInput } from '../../types';
import type { Phase } from './types';

interface Props extends React.ComponentProps<'div'> {
}

export const IdentifyScreen: React.FunctionComponent<Props> = ({ className, ...props }) => {
    const classes = classNames(shared.screen, className);
    const errorNoticeClasses = classNames(shared.notice, shared.error);
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>('capture');
    const [photo, setPhoto] = useState<Blob | undefined>(undefined);
    const [results, setResults] = useState<IdentifyResult[]>([]);
    const [picked, setPicked] = useState<IdentifyResult | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const photoUrl = useObjectUrl(photo);

    const handlePhoto = useCallback((nextPhoto: Blob) => {
        setPhoto(nextPhoto);
        setError(undefined);
    }, []);

    const handleIdentifyError = useCallback((message: string) => {
        setError(message);
    }, []);

    const handleIdentify = useCallback(async () => {
        if (!photo) {
            return;
        }
        setPhase('identifying');
        setError(undefined);
        try {
            const result = await identifyPlant(photo);
            setResults(result);
            setPicked(result.at(0));
            setPhase('results');
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Identification failed.');
            setPhase('capture');
        }
    }, [photo]);

    const handleReset = useCallback(() => {
        setPhoto(undefined);
        setResults([]);
        setPicked(undefined);
        setPhase('capture');
    }, []);

    const handlePick = useCallback((result: IdentifyResult) => {
        setPicked(result);
    }, []);

    const handleContinue = useCallback(() => {
        setPhase('form');
    }, []);

    const handleBackToResults = useCallback(() => {
        setPhase('results');
    }, []);

    const handleSave = useCallback(async (input: PlantInput) => {
        const id = await createPlant(input);
        router.push(`/plants/${id}`);
        router.refresh();
    }, [router]);

    return (
        <div className={classes} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Identify</h1>
                    <div className={shared.sub}>Snap a leaf or flower up close</div>
                </div>
            </header>

            {error && <div className={errorNoticeClasses}>{error}</div>}

            {(phase === 'capture' || phase === 'identifying') && (
                <CaptureStage photoUrl={photoUrl} isIdentifying={phase === 'identifying'} onPhoto={handlePhoto} onError={handleIdentifyError} onReset={handleReset} onIdentify={handleIdentify} />
            )}

            {phase === 'results' && (
                <ResultsStage results={results} picked={picked} onPick={handlePick} onReset={handleReset} onContinue={handleContinue} />
            )}

            {phase === 'form' && picked && photo && (
                <AddPlantForm photo={photo} result={picked} onCancel={handleBackToResults} onSave={handleSave} />
            )}
        </div>
    );
};
