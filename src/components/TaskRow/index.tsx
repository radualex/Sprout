'use client';

import classNames from 'classnames';
import React, { useCallback } from 'react';
import { capitalize } from 'lodash-es';
import { Check } from 'lucide-react';

// Constants
import { ButtonSize, ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';
import PlantPhoto from '@/components/PlantPhoto';

// Helpers
import { displayName } from '@/helpers/plant';
import { CARE_META, formatDue, type CareTask } from '@/helpers/care';

// Styles
import styles from './styles.module.css';

export interface Props extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
    task: CareTask;
    onDone: (t: CareTask) => void;
    onSelect: (id: string) => void;
}

const TaskRow: React.FunctionComponent<Props> = ({ task, onDone, onSelect, ...props }) => {
    const meta = CARE_META[task.kind];
    const rootClasses = styles.taskRow;
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
        <div className={rootClasses} {...props}>
            <Button variant={ButtonVariant.Bare} className={styles.select} onClick={handleSelect}>
                <PlantPhoto photo={task.plant.photo} alt={displayName(task.plant)} className={styles.thumb} />
                <span className={styles.info}>
                    <span className={styles.title}>
                        <meta.icon size="0.875rem" aria-hidden />
                        <span>
                            {meta.label}
                        </span>
                        <span>
                            {displayName(task.plant)}
                        </span>
                    </span>
                    <span className={classes}>
                        {capitalize(formatDue(task.daysUntil))}
                    </span>
                </span>
            </Button>
            {task.daysUntil <= 0 && (
                <Button variant={ButtonVariant.Soft} size={ButtonSize.Sm} onClick={handleDone} icon={Check}>
                    Done
                </Button>
            )}
        </div>
    );
};

export default TaskRow;
