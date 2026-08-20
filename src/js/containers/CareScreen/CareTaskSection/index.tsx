import React from 'react';

// Components
import { TaskRow } from '@/js/components/TaskRow';

// Helpers
import type { CareTask } from '@/js/helpers/care';

// Styles
import styles from './styles.module.scss';

interface Props {
    title: string;
    tasks: CareTask[];
    onDone: (task: CareTask) => void | Promise<void>;
    onSelectPlant: (id: string) => void;
    emptyNotice?: string;
}

export const CareTaskSection: React.FunctionComponent<Props> = ({ title, tasks, onDone, onSelectPlant, emptyNotice }) => {
    const shouldShowTitle = tasks.length > 0 || Boolean(emptyNotice);

    const renderTitle = () => {
        return (
            <div className={styles.sectionTitle}>
                {title}
            </div>
        );
    };

    const renderEmptyNotice = () => {
        return (
            <div className={styles.notice}>
                {emptyNotice}
            </div>
        );
    };

    const renderTaskList = () => {
        return (
            <div className={styles.taskList}>
                {tasks.map((task) => {
                    return (
                        <TaskRow key={`${task.plant.id}-${task.kind}`} task={task} onDone={onDone} onSelect={onSelectPlant} />
                    );
                })}
            </div>
        );
    };

    const renderContent = () => {
        if (tasks.length === 0) {
            return emptyNotice && renderEmptyNotice();
        }

        return renderTaskList();
    };

    return (
        <React.Fragment>
            {shouldShowTitle && renderTitle()}
            {renderContent()}
        </React.Fragment>
    );
};
