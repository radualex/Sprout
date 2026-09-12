import React from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';
import { DELETE_BUTTON_STYLE, DELETE_ROW_STYLE } from '../constants';

// Components
import { Button } from '@/design-system/Button';

// Styles
import styles from './styles.module.scss';

interface Props {
    plantName: string;
    isConfirming: boolean;
    onKeep: () => void;
    onRemove: () => void;
    onStartDelete: () => void;
}

export const DeletePlantBlock: React.FunctionComponent<Props> = ({ plantName, isConfirming, onKeep, onRemove, onStartDelete }) => {
    const renderConfirm = () => {
        return (
            <div className={styles.shutterRow}>
                <Button variant={ButtonVariant.Secondary} grow onClick={onKeep}>
                    Keep plant
                </Button>
                <Button variant={ButtonVariant.Primary} grow style={DELETE_BUTTON_STYLE} onClick={onRemove}>
                    Delete forever
                </Button>
            </div>
        );
    };

    const renderRemove = () => {
        return (
            <Button variant={ButtonVariant.Danger} block onClick={onStartDelete}>
                {`Remove ${plantName}`}
            </Button>
        );
    };

    const renderContent = () => {
        return isConfirming ? renderConfirm() : renderRemove();
    };

    return (
        <div style={DELETE_ROW_STYLE}>
            {renderContent()}
        </div>
    );
};
