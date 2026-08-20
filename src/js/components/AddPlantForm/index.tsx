'use client';

import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Sprout } from 'lucide-react';

// Constants
import { RESULT_THUMB_STYLE } from './constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';
import { CareScheduleFields } from '@/js/components/CareScheduleFields';

// Hooks
import { useObjectUrl } from '@/js/hooks';

// Services
import type { IdentifyResult } from '@/js/services/identify';

// Styles
import styles from './styles.module.scss';

// Types
import type { CareSchedule, PlantInput } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    photo: Blob;
    result: IdentifyResult;
    onCancel: () => void;
    onSave: (input: PlantInput) => void;
}

export const AddPlantForm: React.FunctionComponent<Props> = ({ photo, result, onCancel, onSave, ...props }) => {
    const classes = classNames(styles.resultCard, styles.selected);

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
                    <div className={styles.common}>
                        {result.commonName || result.species}
                    </div>
                    <div className={styles.sci}>
                        {result.species}
                    </div>
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="apf-nickname">
                    Nickname
                </label>
                <input id="apf-nickname" value={nickname} onChange={handleNicknameChange} placeholder="e.g. Kitchen monstera" />
            </div>

            <div className={styles.sectionTitle}>
                Care schedule
            </div>
            <CareScheduleFields idPrefix="apf" value={care} onChange={setCare} hint="Suggested defaults are based on the identified species — tweak as needed." />

            <div className={styles.shutterRow}>
                <Button variant={ButtonVariant.Secondary} grow onClick={onCancel}>
                    Back
                </Button>
                <Button grow onClick={handleSave} icon={Sprout}>
                    Add to my plants
                </Button>
            </div>
        </div>
    );
};
