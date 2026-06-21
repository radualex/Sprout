import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useObjectUrl } from '../../hooks';
import { getPlantNetKey, identifyPlant, type IdentifyResult } from '../../services/identify';
import type { Plant } from '../../types';
import { AddPlantForm } from '../../components/AddPlantForm';
import type { Phase } from './types';

interface Props {
    onSaved: (plant: Plant) => void;
}

export function IdentifyScreen({ onSaved }: Props) {
    const [phase, setPhase] = useState<Phase>('capture');
    const [photo, setPhoto] = useState<Blob | null>(null);
    const [results, setResults] = useState<IdentifyResult[]>([]);
    const [picked, setPicked] = useState<IdentifyResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const photoUrl = useObjectUrl(photo ?? undefined);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [isStreaming, setStreaming] = useState(false);

    useEffect(() => { return stopCamera; }, []);

    function stopCamera() {
        streamRef.current?.getTracks().forEach((t) => { t.stop(); });
        streamRef.current = null;
        setStreaming(false);
    }

    async function startCamera() {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment',
                    width: { ideal: 1280 } },
                audio: false
            });
            streamRef.current = stream;
            setStreaming(true);
            requestAnimationFrame(() => {
                if (!videoRef.current) {
                    return;
                }

                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(() => {});
            });
        } catch {
            setError('Camera unavailable — you can upload a photo instead.');
        }
    }

    function capture() {
        const video = videoRef.current;
        if (!video?.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);
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

    function onFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.at(0);
        if (file) {
            setPhoto(file);
            stopCamera();
            setError(null);
        }
        e.target.value = '';
    }

    async function identify() {
        if (!photo) return;
        setPhase('identifying');
        setError(null);
        try {
            const res = await identifyPlant(photo);
            setResults(res);
            setPicked(res.at(0));
            setPhase('results');
        } catch (error_) {
            setError(error_ instanceof Error ? error_.message : 'Identification failed.');
            setPhase('capture');
        }
    }

    function reset() {
        setPhoto(null);
        setResults([]);
        setPicked(null);
        setPhase('capture');
    }

    return (
        <div className={shared.screen}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Identify</h1>
                    <div className={shared.sub}>Snap a leaf or flower up close</div>
                </div>
            </header>

            {error && <div className={`${shared.notice} ${shared.error}`}>{error}</div>}

            {(phase === 'capture' || phase === 'identifying') && (
                <>
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
                            <>
                                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={reset} disabled={phase === 'identifying'}>
                                    Retake
                                </button>
                                <button type="button" className={shared.btn} onClick={identify} disabled={phase === 'identifying'}>
                                    {phase === 'identifying' ? <span className={styles.spinner} /> : '🔍 Identify'}
                                </button>
                            </>
                        ) : (isStreaming
                            ? (
                                    <>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={stopCamera}>
                                            Cancel
                                        </button>
                                        <button type="button" className={shared.btn} onClick={capture}>
                                            📸 Capture
                                        </button>
                                    </>
                                )
                            : (
                                    <>
                                        <button type="button" className={shared.btn} onClick={startCamera}>
                                            📷 Open camera
                                        </button>
                                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={() => { return fileRef.current?.click(); }}>
                                            🖼 Upload
                                        </button>
                                    </>
                                ))}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        aria-label="Upload a photo of your plant"
                        onChange={onFile}
                    />

                    {!getPlantNetKey() && (
                        <div className={shared.notice}>
                            <strong>Demo mode:</strong> identification returns sample matches. Add a free{' '}
                            PlantNet API key in Settings for real recognition.
                        </div>
                    )}
                </>
            )}

            {phase === 'results' && (
                <>
                    <div className={shared.sectionTitle}>Best matches</div>
                    {results.map((r) => {
                        return (
                            <button
                                key={r.species}
                                type="button"
                                className={`${shared.resultCard} ${picked?.species === r.species ? shared.selected : ''}`}
                                onClick={() => { setPicked(r); }}
                            >
                                <div>
                                    <div className={shared.common}>{r.commonName || r.species}</div>
                                    <div className={shared.sci}>{r.species}</div>
                                </div>
                                <div className={shared.conf}>{Math.round(r.confidence * 100)}%</div>
                            </button>
                        );
                    })}
                    {results.at(0)?.source === 'demo' && (
                        <div className={`${shared.notice} ${shared.warn}`}>
                            These are sample results (demo mode). Add a PlantNet key in Settings for real
                            identification.
                        </div>
                    )}
                    <div className={shared.shutterRow}>
                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={reset}>
                            Retake
                        </button>
                        <button type="button" className={shared.btn} disabled={!picked} onClick={() => { setPhase('form'); }}>
                            Continue →
                        </button>
                    </div>
                </>
            )}

            {phase === 'form' && picked && photo && (
                <AddPlantForm photo={photo} result={picked} onCancel={() => { setPhase('results'); }} onSaved={onSaved} />
            )}
        </div>
    );
}
