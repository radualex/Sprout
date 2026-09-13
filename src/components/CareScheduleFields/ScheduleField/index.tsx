'use client';

import React, { useCallback, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';

// Components
import Select from '@/design-system/Select';

// Types
import type { SelectOption } from '@/design-system/Select/types';

export interface Props extends Omit<React.ComponentProps<'div'>, 'onChange' | 'id'> {
    label: string;
    icon: LucideIcon;
    value: number;
    options: number[];
    unit: 'days' | 'months';
    allowNever?: boolean;
    onChange: (value: number) => void;
    hint?: string;
}

const ScheduleField: React.FunctionComponent<Props> = ({ label, icon, value, options, unit, allowNever = false, onChange, hint, ...props }) => {
    const selectOptions = useMemo<SelectOption[]>(() => {
        const mapped = options.map((amount) => {
            return {
                value: String(amount),
                label: `every ${amount} ${unit}`
            };
        });

        if (allowNever) {
            return [{
                value: '0',
                label: 'never'
            }, ...mapped];
        }

        return mapped;
    }, [options, unit, allowNever]);

    const handleChange = useCallback((newValue: string) => {
        onChange(Number(newValue));
    }, [onChange]);

    return (
        <Select label={label} icon={icon} value={String(value)} options={selectOptions} onChange={handleChange} hint={hint} {...props} />
    );
};

export default ScheduleField;
