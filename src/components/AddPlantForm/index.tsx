'use client';

import classNames from 'classnames';
import React, { useCallback, useId, useState } from 'react';
import { Sprout } from 'lucide-react';

// Constants
import { NICKNAME_LABEL, NICKNAME_PLACEHOLDER } from './constants';
import { FREQUENCY_TITLE } from '@/components/CareScheduleFields/constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';
import CareScheduleFields from '@/components/CareScheduleFields';

// Hooks
import { useObjectUrl } from '@/hooks';

// Services
import type { IdentifyResult } from '@/services/identify';

// Styles
import styles from './styles.module.css';

// Types
import type { CareSchedule, PlantInput } from '@/types';

export interface Props extends React.ComponentProps<'div'> {
    photo: Blob;
    result: IdentifyResult;
    onCancel: () => void;
    onSave: (input: PlantInput) => void;
}

const AddPlantForm: React.FunctionComponent<Props> = ({ photo, result, onCancel, onSave, className, ...props }) => {
    const classes = classNames(styles.form, className);
    const resultCardClasses = classNames(styles.resultCard, styles.selected);

    const [nickname, setNickname] = useState(result.commonName || result.species);
    const [care, setCare] = useState<CareSchedule>(() => {
        return result.defaultCare;
    });
    const photoUrl = useObjectUrl(photo);
    const nicknameId = useId();

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
        <div className={classes} {...props}>
            <div className={styles.previewPane}>
                <div className={resultCardClasses}>
                    {photoUrl && <img src={photoUrl} alt="" className={styles.thumb} />}
                    <div>
                        <div className={styles.common}>
                            {result.commonName || result.species}
                        </div>
                        <div className={styles.sci}>
                            {result.species}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formPane}>
                <div className={styles.field}>
                    <label htmlFor={nicknameId}>
                        {NICKNAME_LABEL}
                    </label>
                    <input id={nicknameId} value={nickname} onChange={handleNicknameChange} placeholder={NICKNAME_PLACEHOLDER} />
                </div>

                <h2 className={styles.sectionTitle}>
                    {FREQUENCY_TITLE}
                </h2>
                <CareScheduleFields value={care} onChange={setCare} hint="Suggested defaults are based on the identified species — tweak as needed." />

                <div className={styles.shutterRow}>
                    <Button variant={ButtonVariant.Secondary} grow onClick={onCancel}>
                        Back
                    </Button>
                    <Button grow onClick={handleSave} icon={Sprout}>
                        Add to my plants
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddPlantForm;
