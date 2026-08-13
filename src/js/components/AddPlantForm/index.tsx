import React, { useState } from 'react';

// Components
import { CareScheduleFields } from '../CareScheduleFields';

// Helpers
import { defaultCareFor } from '../../helpers/care';

// Hooks
import { useObjectUrl } from '../../hooks';

// Services
import { newId } from '../../services/db';
import type { IdentifyResult } from '../../services/identify';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { CareSchedule, Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    photo: Blob;
    result: IdentifyResult;
    onCancel: () => void;
    onSaved: (plant: Plant) => void;
}

export const AddPlantForm: React.FunctionComponent<Props> = ({ photo, result, onCancel, onSaved, ...props }) => {
    const [nickname, setNickname] = useState(result.commonName || result.species);
    const [care, setCare] = useState<CareSchedule>(() => {
        return defaultCareFor(result.species, result.commonName);
    });
    const photoUrl = useObjectUrl(photo);

    function save() {
        const now = Date.now();
        onSaved({
            id: newId(),
            nickname: nickname.trim() || result.commonName || result.species,
            species: result.species,
            commonName: result.commonName,
            photo,
            acquiredAt: now,
            care,
            lastCare: { water: now,
                fertilize: now,
                repot: now },
            lastNotified: {},
            notes: ''
        });
    }

    return (
        <div {...props}>
            <div className={`${shared.resultCard} ${shared.selected}`}>
                {photoUrl && <img src={photoUrl} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />}
                <div>
                    <div className={shared.common}>{result.commonName || result.species}</div>
                    <div className={shared.sci}>{result.species}</div>
                </div>
            </div>

            <div className={shared.field}>
                <label htmlFor="apf-nickname">Nickname</label>
                <input id="apf-nickname" value={nickname} onChange={(event_) => { setNickname(event_.target.value); }} placeholder="e.g. Kitchen monstera" />
            </div>

            <div className={shared.sectionTitle}>Care schedule</div>
            <CareScheduleFields idPrefix="apf" value={care} onChange={setCare} hint="Suggested defaults are based on the identified species — tweak as needed." />

            <div className={shared.shutterRow}>
                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={onCancel}>
                    Back
                </button>
                <button type="button" className={shared.btn} onClick={save}>
                    🌱 Add to my plants
                </button>
            </div>
        </div>
    );
};
