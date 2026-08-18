'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

// Components
import { CareScheduleFields } from '@/js/components/CareScheduleFields';

// Styles
import shared from '@/js/scss/shared.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    onSave: (plant: Plant) => void;
    onCancel: () => void;
}

export const EditSchedule: React.FunctionComponent<Props> = ({ plant, onSave, onCancel, ...props }) => {
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);
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
            <div className={shared.field}>
                <label htmlFor="es-nickname">
                    Nickname
                </label>
                <input id="es-nickname" value={nickname} onChange={handleNicknameChange} />
            </div>
            <CareScheduleFields idPrefix="es" value={care} onChange={setCare} />
            <div className={shared.shutterRow}>
                <button type="button" className={secondaryButtonClasses} onClick={onCancel}>
                    Cancel
                </button>
                <button type="button" className={shared.btn} onClick={handleSave}>
                    Save changes
                </button>
            </div>
        </div>
    );
};
