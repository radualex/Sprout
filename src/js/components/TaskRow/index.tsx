import React from 'react';

// Components
import { PlantPhoto } from '../PlantPhoto';

// Helpers
import { displayName } from '../../helpers/plant';
import { CARE_META, formatDue, type CareTask } from '../../helpers/care';

// Styles
import styles from './styles.module.scss';

const TASK_ROW_BUTTON_STYLE: React.CSSProperties = { all: 'unset',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    cursor: 'pointer' };

interface Props extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
    task: CareTask;
    onDone: (t: CareTask) => void;
    onSelect: (id: string) => void;
}

function capitalize(s: string): string {
    return (s.at(0) ?? '').toUpperCase() + s.slice(1);
}

export const TaskRow: React.FunctionComponent<Props> = ({ task, onDone, onSelect, ...props }) => {
    const meta = CARE_META[task.kind];
    const whenModule = task.daysUntil < 0 ? styles.overdue : (task.daysUntil <= 0 ? styles.due : '');
    return (
        <div className={styles.taskRow} {...props}>
            <button type="button" style={TASK_ROW_BUTTON_STYLE} onClick={() => { onSelect(task.plant.id); }}>
                <PlantPhoto photo={task.plant.photo} alt={displayName(task.plant)} className={styles.thumb} />
                <div className={styles.info}>
                    <div className={styles.title}>
                        {meta.emoji} {meta.label} {displayName(task.plant)}
                    </div>
                    <div className={`${styles.when} ${whenModule}`}>{capitalize(formatDue(task.daysUntil))}</div>
                </div>
            </button>
            {task.daysUntil <= 0 && (
                <button type="button" className={styles.doneBtn} onClick={() => { onDone(task); }}>
                    ✓ Done
                </button>
            )}
        </div>
    );
};
