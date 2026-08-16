'use client';

import React, { useCallback } from 'react';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { CareSchedule } from '../../types';

interface Props extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    idPrefix: string;
    value: CareSchedule;
    onChange: (care: CareSchedule) => void;
    hint?: string;
}

const WATER_OPTIONS = [2, 3, 4, 5, 6, 7, 9, 10, 12, 14, 16, 18, 21, 28];
const FERTILIZE_OPTIONS = [14, 21, 30, 45, 60, 90];
const REPOT_OPTIONS = [6, 12, 18, 24, 30, 36];

function updateWater(event: React.ChangeEvent<HTMLSelectElement>, value: CareSchedule, onChange: (care: CareSchedule) => void) {
    onChange({
        ...value,
        waterEveryDays: +event.target.value
    });
}

function updateFertilize(event: React.ChangeEvent<HTMLSelectElement>, value: CareSchedule, onChange: (care: CareSchedule) => void) {
    onChange({
        ...value,
        fertilizeEveryDays: +event.target.value
    });
}

function updateRepot(event: React.ChangeEvent<HTMLSelectElement>, value: CareSchedule, onChange: (care: CareSchedule) => void) {
    onChange({
        ...value,
        repotEveryMonths: +event.target.value
    });
}

export const CareScheduleFields: React.FunctionComponent<Props> = ({ idPrefix, value, onChange, hint, ...props }) => {
    const handleWaterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        updateWater(event, value, onChange);
    }, [value, onChange]);

    const handleFertilizeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        updateFertilize(event, value, onChange);
    }, [value, onChange]);

    const handleRepotChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        updateRepot(event, value, onChange);
    }, [value, onChange]);

    return (
        <div {...props}>
            <div className={shared.fieldRow}>
                <div className={shared.field}>
                    <label htmlFor={`${idPrefix}-water`}>💧 Water</label>
                    <select id={`${idPrefix}-water`} value={value.waterEveryDays} onChange={handleWaterChange}>
                        {WATER_OPTIONS.map((d) => {
                            return (
                                <option key={d} value={d}>every {d} days</option>
                            );
                        })}
                    </select>
                </div>
                <div className={shared.field}>
                    <label htmlFor={`${idPrefix}-fertilize`}>🌿 Fertilise</label>
                    <select id={`${idPrefix}-fertilize`} value={value.fertilizeEveryDays} onChange={handleFertilizeChange}>
                        <option value={0}>never</option>
                        {FERTILIZE_OPTIONS.map((d) => {
                            return (
                                <option key={d} value={d}>every {d} days</option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className={shared.field}>
                <label htmlFor={`${idPrefix}-repot`}>🪴 Repot</label>
                <select id={`${idPrefix}-repot`} value={value.repotEveryMonths} onChange={handleRepotChange}>
                    <option value={0}>never</option>
                    {REPOT_OPTIONS.map((m) => {
                        return (
                            <option key={m} value={m}>every {m} months</option>
                        );
                    })}
                </select>
                {hint && <div className={shared.hint}>{hint}</div>}
            </div>
        </div>
    );
};
