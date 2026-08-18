'use client';

import classNames from 'classnames';
import React from 'react';
import { Camera, ImageUp } from 'lucide-react';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props {
    onStartCamera: () => void;
    onUpload: () => void;
}

export const CaptureIdleActions: React.FunctionComponent<Props> = ({ onStartCamera, onUpload }) => {
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);

    return (
        <React.Fragment>
            <button type="button" className={shared.btn} onClick={onStartCamera}>
                <Camera size={16} />
                Open camera
            </button>
            <button type="button" className={secondaryButtonClasses} onClick={onUpload}>
                <ImageUp size={16} />
                Upload
            </button>
        </React.Fragment>
    );
};
