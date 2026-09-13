'use client';

import React from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';
import { DELETE_ROW_STYLE } from '../constants';

// Components
import AlertDialog from '@/design-system/AlertDialog';
import Button from '@/design-system/Button';

export interface Props {
    plantName: string;
    isConfirming: boolean;
    onKeep: () => void;
    onRemove: () => void;
    onStartDelete: () => void;
}

const DeletePlantBlock: React.FunctionComponent<Props> = ({ plantName, isConfirming, onKeep, onRemove, onStartDelete }) => {
    return (
        <div style={DELETE_ROW_STYLE}>
            <Button variant={ButtonVariant.Danger} block onClick={onStartDelete}>
                {`Remove ${plantName}`}
            </Button>
            <AlertDialog isOpen={isConfirming} title={`Delete ${plantName}?`} description="This plant and its care history will be permanently removed." confirmLabel="Delete forever" onConfirm={onRemove} onCancel={onKeep} />
        </div>
    );
};

export default DeletePlantBlock;
