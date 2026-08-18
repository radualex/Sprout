'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { CameraStageView } from './CameraStageView';
import { ShutterRow } from './ShutterRow';

interface Props {
    photoUrl?: string;
    isIdentifying: boolean;
    onPhoto: (photo: Blob) => void;
    onError: (message: string) => void;
    onReset: () => void;
    onIdentify: () => void;
}

const playVideo = async (video: HTMLVideoElement): Promise<void> => {
    try {
        await video.play();
    } catch {
        // Autoplay may be blocked by the browser; the stream is still attached to the video element.
    }
};

export const CaptureStage: React.FunctionComponent<Props> = ({ photoUrl, isIdentifying, onPhoto, onError, onReset, onIdentify }) => {
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
        onError('');

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
            onError('Camera unavailable — you can upload a photo instead.');
        }
    }, [onError]);

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

            onPhoto(blob);
            handleStopCamera();
        }, 'image/jpeg', 0.85);
    }, [handleStopCamera, onPhoto]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0) ?? undefined;
        if (file) {
            onPhoto(file);
            handleStopCamera();
            onError('');
        }
        event.target.value = '';
    }, [handleStopCamera, onError, onPhoto]);

    const handleUpload = useCallback(() => {
        fileRef.current?.click();
    }, []);

    useEffect(() => {
        return handleStopCamera;
    }, [handleStopCamera]);

    return (
        <React.Fragment>
            <CameraStageView photoUrl={photoUrl} isStreaming={isStreaming} videoRef={videoRef} />
            <ShutterRow photoUrl={photoUrl} isStreaming={isStreaming} isIdentifying={isIdentifying} onReset={onReset} onIdentify={onIdentify} onStopCamera={handleStopCamera} onCapture={handleCapture} onStartCamera={handleStartCamera} onUpload={handleUpload} />
            <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden aria-label="Upload a photo of your plant" onChange={handleFileChange} />
        </React.Fragment>
    );
};
