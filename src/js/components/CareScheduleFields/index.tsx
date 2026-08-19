'use client';

import React, { useCallback } from 'react';
import { Droplets, Flower2, Leaf } from 'lucide-react';

// Constants
import { FERTILIZE_OPTIONS, REPOT_OPTIONS, WATER_OPTIONS } from './constants';

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

export const CareScheduleFields: React.FunctionComponent<Props> = ({ idPrefix, value, onChange, hint, ...props }) => {
    const handleWaterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({
            ...value,
            waterEveryDays: +event.target.value
        });
    }, [value, onChange]);

    const handleFertilizeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({
            ...value,
            fertilizeEveryDays: +event.target.value
        });
    }, [value, onChange]);

    const handleRepotChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({
            ...value,
            repotEveryMonths: +event.target.value
        });
    }, [value, onChange]);

    // TODO: Refactor into subcomponent
    return (
        <div {...props}>
            <div className={shared.fieldRow}>
                <div className={shared.field}>
                    <label htmlFor={`${idPrefix}-water`}>
                        <Droplets size={14} />
                        Water
                    </label>
                    <select id={`${idPrefix}-water`} value={value.waterEveryDays} onChange={handleWaterChange}>
                        {WATER_OPTIONS.map((d) => {
                            return (
                                <option key={d} value={d}>
                                    {`every ${d} days`}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className={shared.field}>
                    <label htmlFor={`${idPrefix}-fertilize`}>
                        <Leaf size={14} />
                        Fertilise
                    </label>
                    <select id={`${idPrefix}-fertilize`} value={value.fertilizeEveryDays} onChange={handleFertilizeChange}>
                        <option value={0}>
                            never
                        </option>
                        {FERTILIZE_OPTIONS.map((d) => {
                            return (
                                <option key={d} value={d}>
                                    {`every ${d} days`}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className={shared.field}>
                <label htmlFor={`${idPrefix}-repot`}>
                    <Flower2 size={14} />
                    Repot
                </label>
                <select id={`${idPrefix}-repot`} value={value.repotEveryMonths} onChange={handleRepotChange}>
                    <option value={0}>
                        never
                    </option>
                    {REPOT_OPTIONS.map((m) => {
                        return (
                            <option key={m} value={m}>
                                {`every ${m} months`}
                            </option>
                        );
                    })}
                </select>
                {hint && (
                    <div className={shared.hint}>
                        {hint}
                    </div>
                )}
            </div>
        </div>
    );
};
