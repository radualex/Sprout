'use client';

import classNames from 'classnames';
import React, { useCallback, useId, useState } from 'react';

// Constants
import { FREQUENCY_TITLE } from '@/components/CareScheduleFields/constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';
import CareScheduleFields from '@/components/CareScheduleFields';

// Styles
import styles from './styles.module.css';

// Types
import type { Plant } from '@/types';

export interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    onSave: (plant: Plant) => void;
    onCancel: () => void;
}

const EditSchedule: React.FunctionComponent<Props> = ({ plant, onSave, onCancel, className, ...props }) => {
    const classes = classNames(styles.root, className);

    const [nickname, setNickname] = useState(plant.nickname);
    const [care, setCare] = useState(plant.care);
    const nicknameId = useId();

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
        <div className={classes} {...props}>
            <div className={styles.field}>
                <label htmlFor={nicknameId}>
                    Nickname
                </label>
                <input id={nicknameId} value={nickname} onChange={handleNicknameChange} />
            </div>
            <h2 className={styles.sectionTitle}>
                {FREQUENCY_TITLE}
            </h2>
            <CareScheduleFields value={care} onChange={setCare} />
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

export default EditSchedule;
