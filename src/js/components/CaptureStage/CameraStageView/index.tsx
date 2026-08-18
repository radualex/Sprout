'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

// Styles
import styles from './styles.module.scss';

interface Props extends React.ComponentProps<'div'> {
    photoUrl?: string;
    isStreaming: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const CameraStageView: React.FunctionComponent<Props> = ({ photoUrl, isStreaming, videoRef, ...props }) => {
    const renderPlantImage = () => {
        return <img src={photoUrl} alt="Captured plant" />;
    };

    const renderVideo = () => {
        return <video ref={videoRef} playsInline muted aria-label="Camera preview" />;
    };

    const renderPlaceholder = () => {
        return (
            <div className={styles.placeholder}>
                <div className={styles.big}>
                    <Leaf size={48} />
                </div>
                Use the camera or upload a photo of the plant you want to identify.
            </div>
        );
    };

    const renderContent = () => {
        if (photoUrl) {
            return renderPlantImage();
        }

        return isStreaming ? renderVideo() : renderPlaceholder();
    };

    return (
        <div className={styles.cameraStage} {...props}>
            {renderContent()}
        </div>
    );
};
