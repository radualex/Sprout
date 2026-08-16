'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Sprout } from 'lucide-react';

// Constants
import { RESULT_THUMB_STYLE } from './constants';

// Components
import { CareScheduleFields } from '../CareScheduleFields';

// Hooks
import { useObjectUrl } from '../../hooks';

// Services
import type { IdentifyResult } from '../../services/identify';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { CareSchedule, PlantInput } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    photo: Blob;
    result: IdentifyResult;
    onCancel: () => void;
    onSave: (input: PlantInput) => void;
}

export const AddPlantForm: React.FunctionComponent<Props> = ({ photo, result, onCancel, onSave, ...props }) => {
    const classes = classNames(shared.resultCard, shared.selected);
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);

    const [nickname, setNickname] = useState(result.commonName || result.species);
    const [care, setCare] = useState<CareSchedule>(() => {
        return result.defaultCare;
    });
    const photoUrl = useObjectUrl(photo);

    const handleNicknameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({
            nickname: nickname.trim() || result.commonName || result.species,
            species: result.species,
            commonName: result.commonName,
            photo,
            care,
            acquiredAt: Date.now()
        });
    }, [nickname, result, photo, care, onSave]);

    return (
        <div {...props}>
            <div className={classes}>
                {photoUrl && <img src={photoUrl} alt="" style={RESULT_THUMB_STYLE} />}
                <div>
                    <div className={shared.common}>{result.commonName || result.species}</div>
                    <div className={shared.sci}>{result.species}</div>
                </div>
            </div>

            <div className={shared.field}>
                <label htmlFor="apf-nickname">Nickname</label>
                <input id="apf-nickname" value={nickname} onChange={handleNicknameChange} placeholder="e.g. Kitchen monstera" />
            </div>

            <div className={shared.sectionTitle}>Care schedule</div>
            <CareScheduleFields idPrefix="apf" value={care} onChange={setCare} hint="Suggested defaults are based on the identified species — tweak as needed." />

            <div className={shared.shutterRow}>
                <button type="button" className={secondaryButtonClasses} onClick={onCancel}>
                    Back
                </button>
                <button type="button" className={shared.btn} onClick={handleSave}>
                    <Sprout size={16} /> Add to my plants
                </button>
            </div>
        </div>
    );
};
