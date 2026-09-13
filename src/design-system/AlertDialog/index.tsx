'use client';

import React, { useCallback } from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';
import { DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_VARIANT, ESCAPE_REASON } from './constants';

// Components
import Button from '@/design-system/Button';

// Styles
import styles from './styles.module.css';

// Types
import type { AlertDialogChangeDetails } from './types';

export interface Props {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    confirmVariant?: ButtonVariant;
    onConfirm: () => void;
    onCancel: () => void;
}

const AlertDialog: React.FunctionComponent<Props> = ({ isOpen, title, description, confirmLabel, cancelLabel = DEFAULT_CANCEL_LABEL, confirmVariant = DEFAULT_CONFIRM_VARIANT, onConfirm, onCancel }) => {
    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleOpenChange = useCallback((isNextOpen: boolean, changeDetails: AlertDialogChangeDetails) => {
        if (!isNextOpen && changeDetails.reason === ESCAPE_REASON) {
            onCancel();
        }
    }, [onCancel]);

    return (
        <BaseAlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <BaseAlertDialog.Portal>
                <BaseAlertDialog.Backdrop className={styles.backdrop} />
                <BaseAlertDialog.Popup className={styles.popup}>
                    <BaseAlertDialog.Title className={styles.title}>{title}</BaseAlertDialog.Title>
                    <BaseAlertDialog.Description className={styles.description}>{description}</BaseAlertDialog.Description>
                    <div className={styles.actions}>
                        <BaseAlertDialog.Close render={<Button variant={ButtonVariant.Secondary} onClick={handleCancel} />}>
                            {cancelLabel}
                        </BaseAlertDialog.Close>
                        <BaseAlertDialog.Close render={<Button variant={confirmVariant} onClick={handleConfirm} />}>
                            {confirmLabel}
                        </BaseAlertDialog.Close>
                    </div>
                </BaseAlertDialog.Popup>
            </BaseAlertDialog.Portal>
        </BaseAlertDialog.Root>
    );
};

export default AlertDialog;
