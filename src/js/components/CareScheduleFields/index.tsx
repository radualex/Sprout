'use client';

import React, { useCallback } from 'react';
import { Droplets, Flower2, Leaf } from 'lucide-react';

// Constants
import { FERTILIZE_OPTIONS, REPOT_OPTIONS, WATER_OPTIONS } from './constants';

// Components
import { ScheduleField } from './ScheduleField';

// Styles
import styles from './styles.module.scss';

// Types
import type { CareSchedule } from '../../types';

interface Props extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    idPrefix: string;
    value: CareSchedule;
    onChange: (care: CareSchedule) => void;
    hint?: string;
}

export const CareScheduleFields: React.FunctionComponent<Props> = ({ idPrefix, value, onChange, hint, ...props }) => {
    const handleWaterChange = useCallback((newValue: number) => {
        onChange({
            ...value,
            waterEveryDays: newValue
        });
    }, [value, onChange]);

    const handleFertilizeChange = useCallback((newValue: number) => {
        onChange({
            ...value,
            fertilizeEveryDays: newValue
        });
    }, [value, onChange]);

    const handleRepotChange = useCallback((newValue: number) => {
        onChange({
            ...value,
            repotEveryMonths: newValue
        });
    }, [value, onChange]);

    const renderWaterField = () => {
        return (
            <ScheduleField id={`${idPrefix}-water`} label="Water" icon={Droplets} value={value.waterEveryDays} options={WATER_OPTIONS} unit="days" onChange={handleWaterChange} />
        );
    };

    const renderFertilizeField = () => {
        return (
            <ScheduleField id={`${idPrefix}-fertilize`} label="Fertilise" icon={Leaf} value={value.fertilizeEveryDays} options={FERTILIZE_OPTIONS} unit="days" allowNever onChange={handleFertilizeChange} />
        );
    };

    const renderRepotField = () => {
        return (
            <ScheduleField id={`${idPrefix}-repot`} label="Repot" icon={Flower2} value={value.repotEveryMonths} options={REPOT_OPTIONS} unit="months" allowNever onChange={handleRepotChange} hint={hint} />
        );
    };

    const renderContent = () => {
        return (
            <React.Fragment>
                <div className={styles.fieldRow}>
                    {renderWaterField()}
                    {renderFertilizeField()}
                </div>
                {renderRepotField()}
            </React.Fragment>
        );
    };

    return (
        <div {...props}>
            {renderContent()}
        </div>
    );
};
