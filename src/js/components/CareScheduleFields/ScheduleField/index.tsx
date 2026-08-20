'use client';

import React, { useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';

// Styles
import styles from './styles.module.scss';

interface Props extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    id: string;
    label: string;
    icon: LucideIcon;
    value: number;
    options: number[];
    unit: 'days' | 'months';
    allowNever?: boolean;
    onChange: (value: number) => void;
    hint?: string;
}

export const ScheduleField: React.FunctionComponent<Props> = ({ id, label, icon, value, options, unit, allowNever = false, onChange, hint, ...props }) => {
    const Icon = icon;

    const classes = styles.field;

    const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(+event.target.value);
    }, [onChange]);

    return (
        <div className={classes} {...props}>
            <label htmlFor={id}>
                <Icon size={14} />
                {label}
            </label>
            <select id={id} value={value} onChange={handleChange}>
                {allowNever && (
                    <option value={0}>
                        never
                    </option>
                )}
                {options.map((days) => {
                    return (
                        <option key={days} value={days}>
                            {`every ${days} ${unit}`}
                        </option>
                    );
                })}
            </select>
            {hint && (
                <div className={styles.hint}>
                    {hint}
                </div>
            )}
        </div>
    );
};
