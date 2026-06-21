// Components
import { PlantPhoto } from '../PlantPhoto';

// Helpers
import { capitalize } from './helpers';
import { displayName } from '../../helpers/plant';
import { CARE_META, formatDue, type CareTask } from '../../helpers/care';

// Styles
import styles from './styles.module.scss';

interface Props {
    task: CareTask;
    onDone: (t: CareTask) => void;
    onSelect: (id: string) => void;
}

export function TaskRow({ task, onDone, onSelect }: Props) {
    const meta = CARE_META[task.kind];
    const whenModule = task.daysUntil < 0 ? styles.overdue : (task.daysUntil <= 0 ? styles.due : '');
    return (
        <div className={styles.taskRow}>
            <button
                type="button"
                style={{ all: 'unset',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    flex: 1,
                    minWidth: 0,
                    cursor: 'pointer' }}
                onClick={() => { onSelect(task.plant.id); }}
            >
                <PlantPhoto plant={task.plant} className={styles.thumb} />
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
}
