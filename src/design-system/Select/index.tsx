'use client';

import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Select } from '@base-ui/react/select';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

// Constants
import { SELECT_POSITIONER_SIDE_OFFSET } from './constants';

// Styles
import styles from './styles.module.css';

// Types
import type { SelectOption } from './types';

export interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    icon?: LucideIcon;
    placeholder?: string;
    hint?: string;
    disabled?: boolean;
}

const SelectField: React.FunctionComponent<Props> = ({ label, value, options, onChange, icon: Icon, placeholder, hint, disabled = false, className, ...props }) => {
    const classes = classNames(styles.root, className);

    const items = useMemo(() => {
        const record: Record<string, string> = {};

        options.forEach((option) => {
            record[option.value] = option.label;
        });

        return record;
    }, [options]);

    const handleValueChange = useCallback((newValue: string | null) => {
        onChange(newValue ?? '');
    }, [onChange]);

    return (
        <div className={classes} {...props}>
            <Select.Root items={items} value={value} onValueChange={handleValueChange} disabled={disabled}>
                <Select.Label className={styles.label}>
                    {Icon && <Icon size="0.875rem" aria-hidden />}
                    {label}
                </Select.Label>
                <Select.Trigger className={styles.trigger}>
                    <Select.Value className={styles.value} placeholder={placeholder} />
                    <Select.Icon className={styles.icon}>
                        <ChevronDown size="0.875rem" aria-hidden />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner className={styles.positioner} sideOffset={SELECT_POSITIONER_SIDE_OFFSET}>
                        <Select.Popup className={styles.popup}>
                            <Select.List className={styles.list}>
                                {options.map((option) => {
                                    return (
                                        <Select.Item key={option.value} value={option.value} className={styles.item}>
                                            <Select.ItemText className={styles.itemText}>
                                                {option.label}
                                            </Select.ItemText>
                                            <Select.ItemIndicator className={styles.itemIndicator}>
                                                <Check size="0.875rem" aria-hidden />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    );
                                })}
                            </Select.List>
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
            {hint && (
                <div className={styles.hint}>
                    {hint}
                </div>
            )}
        </div>
    );
};

export default SelectField;
