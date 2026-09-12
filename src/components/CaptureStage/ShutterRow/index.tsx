'use client';

import React from 'react';
import { Aperture, Camera, ImageUp } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { IdentifyActions } from './IdentifyActions';
import { ShutterActions } from './ShutterActions';

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
        const actions = [{
            key: 'cancel',
            label: 'Cancel',
            variant: ButtonVariant.Secondary,
            onClick: onStopCamera
        }, {
            key: 'capture',
            label: 'Capture',
            icon: Aperture,
            variant: ButtonVariant.Primary,
            onClick: onCapture
        }];

        return (
            <ShutterActions actions={actions} />
        );
    };

    const renderIdleActions = () => {
        const actions = [{
            key: 'camera',
            label: 'Open camera',
            icon: Camera,
            variant: ButtonVariant.Primary,
            onClick: onStartCamera
        }, {
            key: 'upload',
            label: 'Upload',
            icon: ImageUp,
            variant: ButtonVariant.Secondary,
            onClick: onUpload
        }];

        return (
            <ShutterActions actions={actions} />
        );
    };

    const renderContent = () => {
        if (photoUrl) {
            return renderIdentifyActions();
        }

        return isStreaming ? renderStreamActions() : renderIdleActions();
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};
