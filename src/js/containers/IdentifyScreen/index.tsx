'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { AddPlantForm } from '../../components/AddPlantForm';
import { IdentifyResultCard } from '../../components/IdentifyResultCard';

// Hooks
import { useObjectUrl } from '../../hooks';

// Services
import { identifyPlant, type IdentifyResult } from '../../services/identify';

// Lib
import { createPlant } from '../../lib/actions/plants';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { PlantInput } from '../../types';
import type { Phase } from './types';

interface Props extends React.ComponentProps<'div'> {
}

async function playVideo(video: HTMLVideoElement): Promise<void> {
    try {
        await video.play();
    } catch {
        // Autoplay may be blocked by the browser; the stream is still attached to the video element.
    }
}

export const IdentifyScreen: React.FunctionComponent<Props> = ({ className, ...props }) => {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>('capture');
    const [photo, setPhoto] = useState<Blob | undefined>(undefined);
    const [results, setResults] = useState<IdentifyResult[]>([]);
    const [picked, setPicked] = useState<IdentifyResult | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const photoUrl = useObjectUrl(photo);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | undefined>(undefined);
    const fileRef = useRef<HTMLInputElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const handleStopCamera = useCallback(() => {
        const tracks = streamRef.current?.getTracks() ?? [];
        for (const track of tracks) {
            track.stop();
        }
        streamRef.current = undefined;
        setIsStreaming(false);
    }, []);

    const handleStartCamera = useCallback(async () => {
        setError(undefined);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: {
                        ideal: 1280
                    }
                },
                audio: false
            });
            streamRef.current = stream;
            setIsStreaming(true);
            requestAnimationFrame(() => {
                if (!videoRef.current) {
                    return;
                }

                videoRef.current.srcObject = stream;
                void playVideo(videoRef.current);
            });
        } catch {
            setError('Camera unavailable — you can upload a photo instead.');
        }
    }, []);

    const handleCapture = useCallback(() => {
        const video = videoRef.current;

        if (!video?.videoWidth) {
            return;
        }

        const canvas = document.createElement('canvas');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }

            setPhoto(blob);
            handleStopCamera();
        }, 'image/jpeg', 0.85);
    }, [handleStopCamera]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0) ?? undefined;
        if (file) {
            setPhoto(file);
            handleStopCamera();
            setError(undefined);
        }
        event.target.value = '';
    }, [handleStopCamera]);

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
        } catch (error_) {
            setError(error_ instanceof Error ? error_.message : 'Identification failed.');
            setPhase('capture');
        }
    }, [photo]);

    const handleReset = useCallback(() => {
        setPhoto(undefined);
        setResults([]);
        setPicked(undefined);
        setPhase('capture');
    }, []);

    const handleUpload = useCallback(() => {
        fileRef.current?.click();
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

    useEffect(() => {
        return handleStopCamera;
    }, [handleStopCamera]);

    return (
        <div className={`${shared.screen} ${className ?? ''}`} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Identify</h1>
                    <div className={shared.sub}>Snap a leaf or flower up close</div>
                </div>
            </header>

            {error && <div className={`${shared.notice} ${shared.error}`}>{error}</div>}

            {(phase === 'capture' || phase === 'identifying') && (
                <React.Fragment>
                    <div className={styles.cameraStage}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Captured plant" />
                        ) : (isStreaming
                            ? (
                                    <video ref={videoRef} playsInline muted aria-label="Camera preview" />
                                )
                            : (
                                    <div className={styles.placeholder}>
                                        <div className={styles.big}>🌿</div>
                                        Use the camera or upload a photo of the plant you want to identify.
                                    </div>
                                ))}
                    </div>

                    <div className={shared.shutterRow}>
                        {photoUrl ? (
                            <React.Fragment>
                                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={handleReset} disabled={phase === 'identifying'}>
                                    Retake
                                </button>
                                <button type="button" className={shared.btn} onClick={handleIdentify} disabled={phase === 'identifying'}>
                                    {phase === 'identifying' ? <span className={styles.spinner} /> : '🔍 Identify'}
                                </button>
                            </React.Fragment>
                        ) : (isStreaming
                            ? (
                                    <React.Fragment>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={handleStopCamera}>
                                            Cancel
                                        </button>
                                        <button type="button" className={shared.btn} onClick={handleCapture}>
                                            📸 Capture
                                        </button>
                                    </React.Fragment>
                                )
                            : (
                                    <React.Fragment>
                                        <button type="button" className={shared.btn} onClick={handleStartCamera}>
                                            📷 Open camera
                                        </button>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={handleUpload}>
                                            🖼 Upload
                                        </button>
                                    </React.Fragment>
                                ))}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden aria-label="Upload a photo of your plant" onChange={handleFileChange} />
                </React.Fragment>
            )}

            {phase === 'results' && (
                <React.Fragment>
                    <div className={shared.sectionTitle}>Best matches</div>
                    {results.map((r) => {
                        return (
                            <IdentifyResultCard key={r.species} result={r} selected={picked?.species === r.species} onSelect={handlePick} />
                        );
                    })}
                    <div className={shared.shutterRow}>
                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={handleReset}>
                            Retake
                        </button>
                        <button type="button" className={shared.btn} disabled={!picked} onClick={handleContinue}>
                            Continue →
                        </button>
                    </div>
                </React.Fragment>
            )}

            {phase === 'form' && picked && photo && (
                <AddPlantForm photo={photo} result={picked} onCancel={handleBackToResults} onSave={handleSave} />
            )}
        </div>
    );
};
