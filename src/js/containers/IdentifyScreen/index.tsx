import React, { useEffect, useRef, useState } from 'react';

// Components
import { AddPlantForm } from '../../components/AddPlantForm';

// Hooks
import { useObjectUrl } from '../../hooks';

// Services
import { identifyPlant, type IdentifyResult } from '../../services/identify';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '../../types';
import type { Phase } from './types';

interface Props extends React.ComponentProps<'div'> {
    onSaved: (plant: Plant) => void;
}

export const IdentifyScreen: React.FunctionComponent<Props> = ({ onSaved, className, ...props }) => {
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

    useEffect(() => {
        return stopCamera;
    }, []);

    function stopCamera() {
        const tracks = streamRef.current?.getTracks() ?? [];
        for (const track of tracks) {
            track.stop();
        }
        streamRef.current = undefined;
        setIsStreaming(false);
    }

    async function startCamera() {
        setError(undefined);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment',
                    width: { ideal: 1280 } },
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
    }

    async function playVideo(video: HTMLVideoElement) {
        try {
            await video.play();
        } catch {
            // Autoplay may be blocked by the browser; the stream is still attached to the video element.
        }
    }

    function capture() {
        const video = videoRef.current;
        if (!video?.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }
        context.drawImage(video, 0, 0);
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    return;
                }

                setPhoto(blob);
                stopCamera();
            },
            'image/jpeg',
            0.85
        );
    }

    function onFile(event_: React.ChangeEvent<HTMLInputElement>) {
        const file = event_.target.files?.item(0) ?? undefined;
        if (file) {
            setPhoto(file);
            stopCamera();
            setError(undefined);
        }
        event_.target.value = '';
    }

    async function identify() {
        if (!photo) return;
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
    }

    function reset() {
        setPhoto(undefined);
        setResults([]);
        setPicked(undefined);
        setPhase('capture');
    }

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
                                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={reset} disabled={phase === 'identifying'}>
                                    Retake
                                </button>
                                <button type="button" className={shared.btn} onClick={identify} disabled={phase === 'identifying'}>
                                    {phase === 'identifying' ? <span className={styles.spinner} /> : '🔍 Identify'}
                                </button>
                            </React.Fragment>
                        ) : (isStreaming
                            ? (
                                    <React.Fragment>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={stopCamera}>
                                            Cancel
                                        </button>
                                        <button type="button" className={shared.btn} onClick={capture}>
                                            📸 Capture
                                        </button>
                                    </React.Fragment>
                                )
                            : (
                                    <React.Fragment>
                                        <button type="button" className={shared.btn} onClick={startCamera}>
                                            📷 Open camera
                                        </button>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={() => { return fileRef.current?.click(); }}>
                                            🖼 Upload
                                        </button>
                                    </React.Fragment>
                                ))}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden aria-label="Upload a photo of your plant" onChange={onFile} />
                </React.Fragment>
            )}

            {phase === 'results' && (
                <React.Fragment>
                    <div className={shared.sectionTitle}>Best matches</div>
                    {results.map((r) => {
                        return (
                            <button key={r.species} type="button" className={`${shared.resultCard} ${picked?.species === r.species ? shared.selected : ''}`} onClick={() => { setPicked(r); }}>
                                <div>
                                    <div className={shared.common}>{r.commonName || r.species}</div>
                                    <div className={shared.sci}>{r.species}</div>
                                </div>
                                <div className={shared.conf}>{Math.round(r.confidence * 100)}%</div>
                            </button>
                        );
                    })}
                    <div className={shared.shutterRow}>
                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={reset}>
                            Retake
                        </button>
                        <button type="button" className={shared.btn} disabled={!picked} onClick={() => { setPhase('form'); }}>
                            Continue →
                        </button>
                    </div>
                </React.Fragment>
            )}

            {phase === 'form' && picked && photo && (
                <AddPlantForm photo={photo} result={picked} onCancel={() => { setPhase('results'); }} onSaved={onSaved} />
            )}
        </div>
    );
};
