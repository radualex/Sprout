'use client';

import React, { useCallback, useState } from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';
import { CareScheduleFields } from '@/js/components/CareScheduleFields';

// Styles
import styles from './styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    onSave: (plant: Plant) => void;
    onCancel: () => void;
}

export const EditSchedule: React.FunctionComponent<Props> = ({ plant, onSave, onCancel, ...props }) => {
    const [nickname, setNickname] = useState(plant.nickname);
    const [care, setCare] = useState(plant.care);

    const handleNicknameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({
            ...plant,
            nickname: nickname.trim() || plant.nickname,
            care
        });
    }, [plant, onSave, nickname, care]);

    return (
        <div {...props}>
            <div className={styles.field}>
                <label htmlFor="es-nickname">
                    Nickname
                </label>
                <input id="es-nickname" value={nickname} onChange={handleNicknameChange} />
            </div>
            <CareScheduleFields idPrefix="es" value={care} onChange={setCare} />
            <div className={styles.shutterRow}>
                <Button variant={ButtonVariant.Secondary} grow onClick={onCancel}>
                    Cancel
                </Button>
                <Button grow onClick={handleSave}>
                    Save changes
                </Button>
            </div>
        </div>
    );
};
