'use client';

import React, { useCallback, useId } from 'react';
import type { LucideIcon } from 'lucide-react';

// Styles
import styles from './styles.module.css';

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
    const Icon = icon;

    const classes = styles.field;
    const fieldId = useId();
    const hintId = useId();

    const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(+event.target.value);
    }, [onChange]);

    return (
        <div className={classes} {...props}>
            <label htmlFor={fieldId}>
                <Icon size="0.875rem" aria-hidden />
                {label}
            </label>
            <select id={fieldId} value={value} onChange={handleChange} aria-describedby={hint ? hintId : undefined}>
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
                <div id={hintId} className={styles.hint}>
                    {hint}
                </div>
            )}
        </div>
    );
};

export default ScheduleField;
