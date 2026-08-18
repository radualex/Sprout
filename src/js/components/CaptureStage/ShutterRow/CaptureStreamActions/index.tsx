'use client';

import classNames from 'classnames';
import React from 'react';
import { Aperture } from 'lucide-react';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props {
    onStopCamera: () => void;
    onCapture: () => void;
}

export const CaptureStreamActions: React.FunctionComponent<Props> = ({ onStopCamera, onCapture }) => {
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);

    return (
        <React.Fragment>
            <button type="button" className={secondaryButtonClasses} onClick={onStopCamera}>
                Cancel
            </button>
            <button type="button" className={shared.btn} onClick={onCapture}>
                <Aperture size={16} />
                Capture
            </button>
        </React.Fragment>
    );
};
