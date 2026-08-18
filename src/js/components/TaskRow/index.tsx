'use client';

import classNames from 'classnames';
import React, { useCallback } from 'react';
import { capitalize } from 'lodash-es';
import { Check } from 'lucide-react';

// Constants
import { TASK_ROW_BUTTON_STYLE } from './constants';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';

// Helpers
import { displayName } from '@/js/helpers/plant';
import { CARE_META, formatDue, type CareTask } from '@/js/helpers/care';

// Styles
import styles from './styles.module.scss';

interface Props extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
    task: CareTask;
    onDone: (t: CareTask) => void;
    onSelect: (id: string) => void;
}

export const TaskRow: React.FunctionComponent<Props> = ({ task, onDone, onSelect, ...props }) => {
    const meta = CARE_META[task.kind];
    const classes = classNames(styles.when, {
        [styles.overdue]: task.daysUntil < 0,
        [styles.due]: task.daysUntil === 0
    });

    const handleSelect = useCallback(() => {
        onSelect(task.plant.id);
    }, [onSelect, task]);

    const handleDone = useCallback(() => {
        onDone(task);
    }, [onDone, task]);

    return (
        <div className={styles.taskRow} {...props}>
            <button type="button" style={TASK_ROW_BUTTON_STYLE} onClick={handleSelect}>
                <PlantPhoto photo={task.plant.photo} alt={displayName(task.plant)} className={styles.thumb} />
                <div className={styles.info}>
                    <div className={styles.title}>
                        <meta.icon size={14} />
                        {meta.label}
                        {displayName(task.plant)}
                    </div>
                    <div className={classes}>
                        {capitalize(formatDue(task.daysUntil))}
                    </div>
                </div>
            </button>
            {task.daysUntil <= 0 && (
                <button type="button" className={styles.doneBtn} onClick={handleDone}>
                    <Check size={14} />
                    Done
                </button>
            )}
        </div>
    );
};
