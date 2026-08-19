import React from 'react';
import classNames from 'classnames';

// Helpers
import { DAY_MS, formatDue, nextDue } from '@/js/helpers/care';

// Styles
import styles from '../styles.module.scss';

// Types
import type { CareKind, Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    kind: CareKind;
    now: number;
}

export const CareStatValue: React.FunctionComponent<Props> = ({ plant, kind, now }) => {
    const due = nextDue(plant, kind);
    const daysUntil = due === undefined ? undefined : Math.ceil((due - now) / DAY_MS);

    const renderValue = () => {
        return daysUntil === undefined ? '—' : formatDue(daysUntil);
    };

    const valueClasses = classNames(styles.value, {
        [styles.overdue]: daysUntil !== undefined && daysUntil < 0,
        [styles.due]: daysUntil !== undefined && daysUntil <= 0
    });

    return (
        <div className={valueClasses}>
            {renderValue()}
        </div>
    );
};
