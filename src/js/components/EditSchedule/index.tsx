import React, { useState } from 'react';

// Components
import { CareScheduleFields } from '../CareScheduleFields';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    onSave: (plant: Plant) => void;
    onCancel: () => void;
}

export const EditSchedule: React.FunctionComponent<Props> = ({ plant, onSave, onCancel, ...props }) => {
    const [nickname, setNickname] = useState(plant.nickname);
    const [care, setCare] = useState(plant.care);

    return (
        <div {...props}>
            <div className={shared.field}>
                <label htmlFor="es-nickname">Nickname</label>
                <input id="es-nickname" value={nickname} onChange={(event_) => { setNickname(event_.target.value); }} />
            </div>
            <CareScheduleFields idPrefix="es" value={care} onChange={setCare} />
            <div className={shared.shutterRow}>
                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={onCancel}>Cancel</button>
                <button type="button" className={shared.btn} onClick={() => { onSave({ ...plant, nickname: nickname.trim() || plant.nickname, care }); }}>
                    Save changes
                </button>
            </div>
        </div>
    );
};
