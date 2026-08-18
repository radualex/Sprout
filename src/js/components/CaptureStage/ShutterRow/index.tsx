'use client';

import React from 'react';

// Components
import { CaptureIdleActions } from './CaptureIdleActions';
import { CaptureStreamActions } from './CaptureStreamActions';
import { IdentifyActions } from './IdentifyActions';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props {
    photoUrl?: string;
    isStreaming: boolean;
    isIdentifying: boolean;
    onReset: () => void;
    onIdentify: () => void;
    onStopCamera: () => void;
    onCapture: () => void;
    onStartCamera: () => void;
    onUpload: () => void;
}

export const ShutterRow: React.FunctionComponent<Props> = ({ photoUrl, isStreaming, isIdentifying, onReset, onIdentify, onStopCamera, onCapture, onStartCamera, onUpload }) => {
    const renderIdentifyActions = () => {
        return <IdentifyActions isIdentifying={isIdentifying} onReset={onReset} onIdentify={onIdentify} />;
    };

    const renderStreamActions = () => {
        return <CaptureStreamActions onStopCamera={onStopCamera} onCapture={onCapture} />;
    };

    const renderIdleActions = () => {
        return <CaptureIdleActions onStartCamera={onStartCamera} onUpload={onUpload} />;
    };

    const renderContent = () => {
        if (photoUrl) {
            return renderIdentifyActions();
        }

        return isStreaming ? renderStreamActions() : renderIdleActions();
    };

    return (
        <div className={shared.shutterRow}>
            {renderContent()}
        </div>
    );
};
